import { documentReady, $, delegate } from 'web-cell';

import GitElement from 'git-element';

import marked from 'marked';

async function fileOf(URI) {
    const content = self.atob((await GitElement.fetch(URI)).content);

    return /\.(md|markdown)/i.test(URI) ? marked(content) : content;
}

documentReady.then(() => {
    const git_user = $('git-user')[0],
        git_path = $('git-path')[0],
        editor = $('form > [contenteditable]')[0];

    if (self.localStorage.token) git_user.token = self.localStorage.token;

    document.addEventListener('signin', ({ detail }) => {
        git_path.user = detail.login;

        self.localStorage.token = detail.token;
    });

    document.addEventListener(
        'change',
        delegate('git-path', async ({ target: { content, URI } }) => {
            if (content.type === 'file') editor.innerHTML = await fileOf(URI);
        })
    );

    self.MarkdownIME.Enhance(editor);

    document.addEventListener('submit', async event => {
        event.preventDefault();

        const { URI, content } = git_path;

        try {
            const data = await GitElement.fetch(URI, 'PUT', {
                message: event.target.elements.message,
                content: editor.innerHTML,
                sha: content.sha
            });

            content.render(data.content);

            self.alert('Commit success!');
        } catch (error) {
            self.alert(error.message);
        }
    });
});
