import { documentReady, ObjectView, $, stringifyDOM } from 'web-cell';

import GitElement from 'git-element';

import { fileOf, isGitMarkdown, contentOf, wrapTemplate } from './utility';

import marked from 'marked';

import main_data from './index.json';

documentReady.then(() => {
    const main_view = new ObjectView(document.body),
        git_user = $('git-user')[0],
        [template_path, page_path] = $('git-path'),
        editor = $('text-editor [contenteditable]')[0];

    main_view.render(main_data);

    if (self.localStorage.token) git_user.token = self.localStorage.token;

    document.addEventListener('signin', ({ detail }) => {
        template_path.user = page_path.user = detail.login;

        self.localStorage.token = detail.token;

        document.forms[0].hidden = false;
    });

    document.addEventListener('signout', () => {
        template_path.user = page_path.user = '';

        delete self.localStorage.token;

        document.forms[0].hidden = true;
    });

    page_path.on('change', async ({ target: { content, contentURI } }) => {
        if (content.type !== 'file') return;

        content = await fileOf(contentURI);

        if (isGitMarkdown(contentURI)) {
            content = marked(content);

            editor.contentEditable = false;
        } else {
            if (/\.html?$/.test(contentURI)) content = contentOf(content);

            editor.contentEditable = true;
        }

        editor.innerHTML = content;
    });

    document.addEventListener('submit', async event => {
        event.preventDefault();

        const { contentURI, content } = page_path,
            { template, message } = event.target.elements;

        try {
            const data = await GitElement.fetch(contentURI, 'PUT', {
                message: message.value,
                content: self.btoa(
                    stringifyDOM(
                        await wrapTemplate(
                            template_path.contentURI || template.value,
                            editor.innerHTML
                        )
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
