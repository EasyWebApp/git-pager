import { component, mapProperty, mapData, on, indexOf } from 'web-cell';

import GitElement from 'git-element';

import template from './index.html';

const splice = [].splice,
    _path_ = new WeakMap();

@component({ template })
export default class GitPath extends GitElement {
    constructor() {
        super().buildDOM();

        _path_.set(this, []);
    }

    @mapProperty
    static get observedAttributes() {
        return ['user'];
    }

    @mapData
    attributeChangedCallback() {}

    get value() {
        return _path_.get(this).join('/');
    }

    static typeOf(select) {
        return select.options[select.selectedIndex].dataset.type;
    }

    async viewChangedCallback({ user }) {
        if (!user) return;

        const orgs = await GitElement.fetch(`users/${user}/orgs`);

        this.view.render({
            path: [
                {
                    list: [{ login: user }, ...orgs]
                }
            ]
        });

        _path_.get(this).splice(0, Infinity, user);
    }

    setLevel(index, name, list) {
        const { path } = this.view;

        _path_.get(this).splice(index - 1, Infinity, name);

        this.trigger('change', null, true);

        if (!list) return;

        splice
            .call(path, index, Infinity)
            .forEach(old => old.content[0].remove());

        path.data.splice(index, Infinity);

        path.push({ list });
    }

    @on('change', ':host select')
    async openNext({ target }, { parentNode, selectedIndex, value }) {
        var level = indexOf(parentNode) + 1,
            route = _path_.get(this),
            URI;

        if (!value) return this.setLevel(level, parentNode.value);

        switch (level) {
            case 1:
                URI = `${selectedIndex ? 'orgs' : 'users'}/${value}/repos`;
                break;
            case 2:
                URI = `repos/${route[0]}/${value}/contents`;
                break;
            default: {
                if (GitPath.typeOf(target) === 'file')
                    return this.setLevel(level, value);

                URI = `repos/${route[0]}/${route[1]}/contents/${route
                    .slice(2)
                    .concat(value)
                    .join('/')}`;
            }
        }

        this.setLevel(level, value, await GitElement.fetch(URI));
    }
}
