import { component, mapProperty, mapData, View, on, indexOf } from 'web-cell';

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

    get content() {
        var select = this.$('select')[_path_.get(this).length - 1];

        select = select.children[select.selectedIndex];

        return View.instanceOf(select);
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

    setRoute(index, name) {
        _path_.get(this).splice(index - 1, Infinity, name);

        this.trigger('change', null, true);
    }

    get URI() {
        const path = _path_.get(this);

        return `repos/${path[0]}/${path[1]}/contents/${path
            .slice(2)
            .join('/')}`;
    }

    setLevel(index, list) {
        const { path } = this.view;

        splice
            .call(path, index, Infinity)
            .forEach(old => old.content[0].remove());

        path.data.splice(index, Infinity);

        path.push({ list });
    }

    @on('change', ':host select')
    async openNext({ target }, { parentNode, selectedIndex, value }) {
        const level = indexOf(parentNode) + 1;

        this.setRoute(level, value || parentNode.value);

        if (value && GitPath.typeOf(target) !== 'file')
            this.setLevel(
                level,
                await GitElement.fetch(
                    level === 1
                        ? `${selectedIndex ? 'org' : 'user'}s/${value}/repos`
                        : this.URI
                )
            );
    }
}
