import { component, mapProperty, mapData } from 'web-cell';

import template from './index.html';

import list from './index.json';

@component({ template, data: { list } })
export default class PageTemplate extends HTMLElement {
    constructor() {
        super().buildDOM();
    }

    @mapProperty
    static get observedAttributes() {
        return ['type', 'user'];
    }

    @mapData
    attributeChangedCallback() {}

    get value() {
        return (
            this.$('git-path')[0].contentURI ||
            new URL(
                `template/${this.$('select')[0].value}/${this.type}.html`,
                self.location
            )
        );
    }
}
