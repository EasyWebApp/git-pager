import { documentReady, ObjectView, $, stringifyDOM } from 'web-cell';

import GitElement from 'git-element';

import {
    fileOf,
    isGitMarkdown,
    contentOf,
    wrapTemplate,
    pageOf
} from './utility';

import marked from 'marked';

documentReady.then(() => {
    const main_view = new ObjectView(document.body),
        git_user = $('git-user')[0],
        [article_template] = $('page-template'),
        [article_path] = $('git-path'),
        editor = $('text-editor')[0];

    if (self.localStorage.token) git_user.token = self.localStorage.token;

    document.addEventListener('signin', ({ detail }) => {
        article_template.user = article_path.user = detail.login;

        self.localStorage.token = detail.token;

        document.forms[0].hidden = false;
    });

    document.addEventListener('signout', () => {
        article_template.user = article_path.user = '';

        delete self.localStorage.token;

        document.forms[0].hidden = true;
    });

    article_path.on('change', async ({ target: { content, contentURI } }) => {
        if (!content || content.type !== 'file') return;

        content = await fileOf(contentURI);

        if (isGitMarkdown(contentURI)) {
            content = marked(content);

            editor.disabled = true;
        } else {
            if (/\.html?$/.test(contentURI)) content = contentOf(content);

            editor.disabled = false;
        }

        editor.value = content;

        main_view.render({
            pageURL: pageOf(article_path.repository, article_path.path)
        });
    });

    document.addEventListener('submit', async event => {
        event.preventDefault();

        const { contentURI, content } = article_path,
            { title, description, message } = event.target.elements;

        try {
            const data = await GitElement.fetch(contentURI, 'PUT', {
                message: message.value,
                content: self.btoa(
                    stringifyDOM(
                        await wrapTemplate(article_template.value, {
                            title: title.value,
                            description: description.value,
                            author: git_user.session.email,
                            content: editor.value
                        })
                    )
                ),
                sha: content.sha
            });

            content.render(data.content);

            self.alert('Commit success!');
        } catch (error) {
            self.alert(error.message);
        }
    });
});
