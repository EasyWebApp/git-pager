import { documentReady, ObjectView, $, stringifyDOM } from 'web-cell';

import GitElement from 'git-element';

import { contentOf, buildArticle, saveFile, buildIndex } from './utility';

import marked from 'marked';

documentReady.then(() => {
    const main_view = new ObjectView(document.body),
        git_user = $('git-user')[0],
        [index_template, article_template] = $('page-template'),
        [index_path, article_path] = $('git-path'),
        editor = $('text-editor')[0];

    if (self.localStorage.token) git_user.token = self.localStorage.token;

    document.addEventListener('signin', ({ detail }) => {
        index_template.user = index_path.user = article_template.user = article_path.user =
            detail.login;

        self.localStorage.token = detail.token;

        document.forms[0].hidden = false;
    });

    document.addEventListener('signout', () => {
        index_template.user = index_path.user = article_template.user = article_path.user =
            '';

        delete self.localStorage.token;

        document.forms[0].hidden = true;
    });

    article_path.on('change', async ({ target: { content, contentURI } }) => {
        if (!content || content.type !== 'file') return;

        content = await GitElement.fileOf(contentURI);

        if (GitElement.isGitMarkdown(contentURI)) {
            content = marked(content);

            editor.disabled = true;
        } else {
            if (/\.html?$/.test(contentURI)) content = contentOf(content);

            editor.disabled = false;
        }

        editor.value = content;

        main_view.render({
            pageURL: GitElement.pageOf(
                article_path.repository,
                article_path.path
            )
        });
    });

    document.addEventListener('submit', async event => {
        event.preventDefault();

        const { repository, path } = article_path,
            { title, description, message } = event.target.elements;

        try {
            await saveFile(
                article_path,
                stringifyDOM(
                    await buildArticle(article_template.value, repository, {
                        title: title.value,
                        description: description.value,
                        author: git_user.session.email,
                        path,
                        content: editor.value
                    })
                ),
                message.value
            );

            await saveFile(
                index_path,
                stringifyDOM(
                    await buildIndex(
                        index_template.value,
                        repository,
                        path.split('/')[0],
                        {
                            title: title.value,
                            description: description.value
                        }
                    )
                ),
                message.value
            );

            self.alert('Commit success!');
        } catch (error) {
            self.alert(error.message);
        }
    });
});
