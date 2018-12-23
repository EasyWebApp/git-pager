import GitElement from 'git-element';

/**
 * @param {String|URL} URI - GitHub content URL
 *
 * @return {String} File content
 */
export async function fileOf(URI) {
    return self.atob((await GitElement.fetch(URI)).content);
}

/**
 * @param {String|URL} URI - File path
 *
 * @return {Boolean}
 */
export function isGitMarkdown(URI) {
    return (
        /\.(md|markdown)/i.test(URI) ||
        /^(ReadMe|Contributing|License)\.?/.test(URI)
    );
}

/**
 * @param {String|URL} name    - Inset template name or GitHub content URL
 * @param {String}     content - HTML source code
 *
 * @return {HTMLDocument}
 */
export async function wrapTemplate(name, content) {
    var template = name.includes('/')
        ? fileOf(name)
        : (await self.fetch(`template/${name}.html`)).text();

    template = new DOMParser().parseFromString(await template, 'text/html');

    template.querySelector('article').innerHTML = content;

    return template;
}

/**
 * @param {String} HTML - HTML source code
 *
 * @return {String} HTML source code of Article content
 */
export function contentOf(HTML) {
    if (!/<(html|head|body)[\s\S]*?>/.test(HTML)) return HTML;

    HTML = new DOMParser().parseFromString(HTML, 'text/html');

    if ((HTML = HTML.querySelector('article, main, body')))
        return HTML.innerHTML;
}
