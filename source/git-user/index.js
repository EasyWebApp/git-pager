import { component, on } from 'web-cell';

import GitElement from 'git-element';

import template from './index.html';

const session = Symbol('User session');

@component({ template })
export default class GitUser extends GitElement {
    constructor() {
        super().buildDOM();
    }

    get session() {
        return this[session];
    }

    set token(token) {
        if ((GitElement.token = token))
            GitElement.fetch('user').then(data => {
                this[session] = data;

                this.view.render(data);

                this.trigger('signin', { token, ...data }, true);
            });
    }

    @on('submit', ':host form')
    signIn(event) {
        event.preventDefault();

        this.token = event.target.elements.token.value;
    }

    @on('reset', ':host form')
    signOut() {
        this.token = null;

        this.view.clear();

        this.trigger('signout', null, true);
    }
}
