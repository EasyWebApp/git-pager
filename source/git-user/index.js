import { component, on } from 'web-cell';

import GitElement from 'git-element';

import template from './index.html';

@component({ template })
export default class GitUser extends GitElement {
    constructor() {
        super().buildDOM();
    }

    set token(token) {
        GitElement.token = token;

        GitElement.fetch('user').then(data => {
            this.view.render(data);

            this.trigger('signin', { token, ...data }, true);
        });
    }

    @on('submit', ':host form')
    signIn(event) {
        event.preventDefault();

        this.token = event.target.elements.token.value;
    }
}
