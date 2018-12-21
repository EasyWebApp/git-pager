import { component } from 'web-cell';

import template from './index.html';

@component({ template })
export default class TextEditor extends HTMLElement {
    constructor() {
        super().buildDOM();
    }

    slotChangedCallback() {
        for (let editor of this.querySelectorAll('[contenteditable]'))
            self.MarkdownIME.Enhance(editor);
    }
}
