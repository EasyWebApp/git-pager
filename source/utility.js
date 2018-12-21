import GitElement from 'git-element';

export async function fileOf(URI) {
    return self.atob((await GitElement.fetch(URI)).content);
}

export function isGitMarkdown(URI) {
    return (
        /\.(md|markdown)/i.test(URI) ||
        /^(ReadMe|Contributing|License)\.?/.test(URI)
    );
}

export async function wrapTemplate(name, content) {
    if (!/^(https?:)?\/\//.test(name)) name = `template/${name}.html`;

    const template = new DOMParser().parseFromString(
        await (await self.fetch(name)).text(),
        'text/html'
    );

    template.querySelector('article').innerHTML = content;

    return template;
}

export function contentOf(HTML) {
    if (!/<(html|head|body)>/.test(HTML)) return HTML;

    HTML = new DOMParser().parseFromString(HTML, 'text/html');

    if ((HTML = HTML.querySelector('article, main, body')))
        return HTML.innerHTML;
}
