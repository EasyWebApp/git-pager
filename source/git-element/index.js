import { request } from 'web-cell';

export default class GitElement extends HTMLElement {
    constructor() {
        super();
    }

    static fetch(URI, method, body, header) {
        return request(new URL(URI, 'https://api.github.com'), method, body, {
            Authorization: 'token ' + this.token,
            ...header
        });
    }

    static encodeBase64(raw) {
        return self.btoa(
            encodeURIComponent(raw).replace(/%([0-9A-F]{2})/g, (_, p1) =>
                String.fromCharCode('0x' + p1)
            )
        );
    }

    static decodeBase64(raw) {
        return decodeURIComponent(
            self
                .atob(raw)
                .split('')
                .map(
                    char =>
                        '%' + ('00' + char.charCodeAt(0).toString(16)).slice(-2)
                )
                .join('')
        );
    }

    /**
     * @param {String|URL} URI - GitHub content URL
     *
     * @return {String} File content
     */
    static async fileOf(URI) {
        return this.decodeBase64((await this.fetch(URI)).content);
    }

    /**
     * @param {String} repository - For example: `userID/repo`
     * @param {String} path       - File path in `repository`
     *
     * @return {String} GitHub Pages URL of this file
     */
    static pageOf(repository, path) {
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
    static isGitMarkdown(URI) {
        return (
            /\.(md|markdown)/i.test(URI) ||
            /^(ReadMe|Contributing|License)\.?/.test(URI)
        );
    }

    /**
     * @param {String} [keyWord='']
     * @param {Object} [condition]    - https://developer.github.com/v3/search/#parameters-2
     * @param {String} [sort]
     * @param {String} [order]
     * @param {Number} [per_page=100]
     *
     * @return {Promise<Object>}
     */
    static search(keyWord, condition, sort, order, per_page = 100) {
        keyWord = [keyWord];

        for (let key in condition) keyWord.push(`${key}:${condition[key]}`);

        return this.fetch(
            `search/code?${new URLSearchParams({
                q: keyWord.join(' '),
                sort,
                order,
                per_page
            })}`
        );
    }
}
