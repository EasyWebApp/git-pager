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
}
