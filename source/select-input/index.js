import { component, mapProperty, mapData, on, trigger } from 'web-cell';

import template from './index.html';

@component({ template })
export default class SelectInput extends HTMLElement {
    constructor() {
        super().buildDOM();
    }

    @mapProperty
    static get observedAttributes() {
        return ['placeholder', 'disabled'];
    }

    @mapData
    attributeChangedCallback() {}

    get origin() {
        for (let element of this.children)
            if (element.tagName === 'SELECT') return element;
    }

    get value() {
        return this.$('input')[0].value;
    }

    slotChangedCallback() {
        const { origin } = this,
            proxy = this.$('datalist')[0];

        if (!origin) return;

        const input = () => (proxy.innerHTML = origin.innerHTML);

        input();

        new MutationObserver(input).observe(origin, { childList: true });
    }

    @on('change', ':host input')
    output({ target: { value } }) {
        const { origin } = this;

        origin.value = value;

        trigger(origin, 'change', null, true);
    }

    focus() {
        this.$('input')[0].focus();
    }
}
