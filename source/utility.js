import { ObjectView, parseDOM } from 'web-cell';

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
 * @param {String} repository - For example: `userID/repo`
 * @param {String} path       - File path in `repository`
 *
 * @return {String} GitHub Pages URL of this file
 */
export function pageOf(repository, path) {
    repository = repository.split('/');

    repository[0] += '.github.io';

    return (
        '' +
        new URL(
            path,
            `https://${repository[0]}/${
                repository[0] === repository[1] ? '' : repository[1] + '/'
            }`
        )
    );
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
 * @param {String}                            selector
 * @param {Element|DocumentFragment|Document} [context=document]
 *
 * @return {?Element} Fisrt one found in order
 */
export function $order(selector, context = document) {
    for (let one of selector.split(/\s*,\s*/))
        if ((one = context.querySelector(one))) return one;
}

/**
 * @param {String|URL} URI              - Template HTML URL or GitHub content URL
 * @param {Object}     data
 * @param {String}     data.title       - Site title
 * @param {String}     data.description - Site description
 * @param {String}     data.author      - Article author
 * @param {String}     data.content     - Article HTML source code
 *
 * @return {HTMLDocument}
 */
export async function wrapTemplate(
    URI,
    { title, description, author, content }
) {
    var template = /^(https?:)\/\//.test(URI)
        ? (await self.fetch(URI)).text()
        : fileOf(URI);

    template = new DOMParser().parseFromString(await template, 'text/html');

    const heading = $order('h1, h2, h3, h4, h5, h6, header', parseDOM(content));

    if (!heading) throw SyntaxError('Articles should have a title (heading)');

    new ObjectView(template.documentElement).render({
        site: { title, description },
        article: {
            author,
            title: heading.textContent.trim(),
            content
        }
    });

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

    if ((HTML = $order('article, main, body', HTML))) return HTML.innerHTML;
}
