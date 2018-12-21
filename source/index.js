import { documentReady, ObjectView, $, delegate, stringifyDOM } from 'web-cell';

import GitElement from 'git-element';

import { fileOf, isGitMarkdown, contentOf, wrapTemplate } from './utility';

import marked from 'marked';

import main_data from './index.json';

documentReady.then(() => {
    const main_view = new ObjectView(document.body),
        git_user = $('git-user')[0],
        git_path = $('git-path')[0],
        editor = $('text-editor [contenteditable]')[0];

    main_view.render(main_data);

    if (self.localStorage.token) git_user.token = self.localStorage.token;

    document.addEventListener('signin', ({ detail }) => {
        git_path.user = detail.login;

        self.localStorage.token = detail.token;

        document.forms[0].hidden = false;
    });

    document.addEventListener('signout', () => {
        git_path.user = '';

        delete self.localStorage.token;

        document.forms[0].hidden = true;
    });

    document.addEventListener(
        'change',
        delegate('git-path', async ({ target: { content, URI } }) => {
            if (content.type !== 'file') return;

            content = await fileOf(URI);

            if (isGitMarkdown(URI)) {
                content = marked(content);

                editor.contentEditable = false;
            } else {
                if (/\.html?$/.test(URI)) content = contentOf(content);

                editor.contentEditable = true;
            }

            editor.innerHTML = content;
        })
    );

    document.addEventListener('submit', async event => {
        event.preventDefault();

        const { URI, content } = git_path,
            { template, message } = event.target.elements;

        try {
            const data = await GitElement.fetch(URI, 'PUT', {
                message: message.value,
                content: self.btoa(
                    stringifyDOM(
                        await wrapTemplate(
                            template.value || template.parentNode.value,
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
