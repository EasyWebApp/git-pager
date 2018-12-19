import { component, on } from 'web-cell';

import GitElement from 'git-element';

import template from './index.html';

@component({ template })
export default class GitUser extends GitElement {
    constructor() {
        super().buildDOM();
    }

    @on('submit', ':host form')
    async signIn(event) {
        event.preventDefault();

        GitElement.token = event.target.elements.token.value;

        const data = await GitElement.fetch('user');

        this.view.render(data);

        this.trigger('signin', data, true);
    }
}
