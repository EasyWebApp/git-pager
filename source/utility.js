import { ObjectView, parseDOM, $ } from 'web-cell';

import GitElement from 'git-element';

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

function parseHTML(code) {
    return new DOMParser().parseFromString(code, 'text/html');
}

async function renderTemplate(URI, data) {
    var document = /^(https?:)\/\//.test(URI)
        ? (await self.fetch(URI)).text()
        : GitElement.fileOf(URI);

    document = parseHTML(await document);

    new ObjectView(document.documentElement).render(data);

    return document;
}

async function siblingOf(repo, path) {
    const { items } = await GitElement.search(
        '',
        {
            repo,
            path: path.split('/')[0],
            in: 'file',
            extension: path.split('.').slice(-1)[0]
        },
        'indexed'
    );

    for (let i = 0; items[i]; i++)
        if (items[i].path === path)
            return {
                previous: (items[i - 1] || '').path,
                next: (items[i + 1] || '').path
            };
}

/**
 * @param {String|URL} URI              - Template HTML URL or GitHub content URL
 * @param {String}     repo             - `userID/repo`
 * @param {Object}     data
 * @param {String}     data.title       - Site title
 * @param {String}     data.description - Site description
 * @param {String}     data.author      - Article author
 * @param {String}     data.path        - File path
 * @param {String}     data.content     - Article HTML source code
 *
 * @return {HTMLDocument}
 */
export async function buildArticle(
    URI,
    repo,
    { title, description, author, path, content }
) {
    const fragment = parseDOM(content);

    const heading = $order('h1, h2, h3, h4, h5, h6, header', fragment);

    if (!heading) throw SyntaxError('Articles should have a title (heading)');

    var summary;

    for (let one of $('p:not(:empty)', fragment))
        if ((one = one.textContent.trim())) {
            summary = one;
            break;
        }

    return await renderTemplate(URI, {
        site: { title, description },
        article: {
            author,
            title: heading.textContent.trim(),
            description: summary,
            content,
            ...(await siblingOf(repo, path))
        }
    });
}

export async function buildIndex(URI, repo, path, data) {
    var { items } = await GitElement.search(
        '',
        {
            repo,
            path,
            in: 'file',
            extension: 'html'
        },
        'indexed',
        '',
        10
    );

    items = items.map(async file => {
        const document = parseHTML(await GitElement.fileOf(file.url));

        const { title } = document,
            description = document.querySelector('meta[name="description"]');

        return {
            title,
            description: (description || '').content,
            ...file
        };
    });

    return await renderTemplate(URI, {
        article: await Promise.all(items),
        ...data
    });
}

/**
 * @param {GitPath} file
 * @param {String}  raw
 * @param {String}  message
 */
export async function saveFile({ contentURI, content }, raw, message) {
    const data = await GitElement.fetch(contentURI, 'PUT', {
        message,
        content: GitElement.encodeBase64(raw),
        sha: content.sha
    });

    content.render(data.content);
}

/**
 * @param {String} HTML - HTML source code
 *
 * @return {String} HTML source code of Article content
 */
export function contentOf(HTML) {
    if (!/<(html|head|body)[\s\S]*?>/.test(HTML)) return HTML;

    if ((HTML = $order('article, main, body', parseHTML(HTML))))
        return HTML.innerHTML;
}
