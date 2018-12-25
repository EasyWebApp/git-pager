import { component, mapProperty, mapData, on, decodeMarkup } from 'web-cell';

import template from './index.html';

const editor = Symbol('Super editor');

@component({ template, data: { count: 0 } })
export default class TextEditor extends HTMLElement {
    constructor() {
        super().buildDOM();
    }

    @mapProperty
    static get observedAttributes() {
        return ['placeholder', 'buttons'];
    }

    @mapData
    attributeChangedCallback() {}

    get value() {
        return this[editor].getContent();
    }

    set value(value) {
        this[editor].setContent(value);
    }

    get disabled() {
        return !this[editor].elements[0].contentEditable;
    }

    set disabled(value) {
        this[editor].elements[0].contentEditable = !value;
    }

    @on('keyup', '[contenteditable]')
    setCount() {
        this.view.render({ count: decodeMarkup(this.value).length });
    }

    mediaButtonOf(tag, icon, title = '') {
        const setCount = this.setCount.bind(this);

        const extension = new self.CustomHtml({
            get htmlToInsert() {
                setTimeout(setCount);

                return `<${tag} src=${getSelection().getRangeAt(0) + ''}>`;
            }
        });

        (extension.button.title = title),
        (extension.button.innerHTML = `<b>${icon}</b>`);

        return extension;
    }

    slotChangedCallback(assigned) {
        if (
            assigned.find(
                node => node.matches && node.matches('.medium-editor-element')
            )
        )
            return;

        const target = this.querySelector('textarea, [contenteditable]'),
            buttons = (this.getAttribute('buttons') || '')
                .split(/\s*,\s*/)
                .filter(Boolean);

        this[editor] = new self.MediumEditor(target, {
            placeholder: { text: this.getAttribute('placeholder') },
            imageDragging: false,
            paste: {
                cleanPastedHTML: true,
                cleanTags: [
                    'html',
                    'head',
                    'body',
                    'meta',
                    'title',
                    'style',
                    'link',
                    'script'
                ],
                cleanAttrs: ['onclick']
            },
            anchor: {
                linkValidation: true,
                targetCheckbox: true
            },
            toolbar: {
                buttons: buttons[0]
                    ? buttons
                    : [
                        'bold',
                        'italic',
                        'underline',
                        'h4',
                        'fontsize',
                        'anchor',
                        'quote',
                        'orderedlist',
                        'unorderedlist',
                        'image',
                        'audio',
                        'video',
                        'iframe',
                        'justifyLeft',
                        'justifyCenter',
                        'justifyRight',
                        'removeFormat'
                    ]
            },
            extensions: {
                image: this.mediaButtonOf('img', 'P', 'Image'),
                audio: this.mediaButtonOf('audio', 'S', 'Audio'),
                video: this.mediaButtonOf('video', 'V', 'Video'),
                iframe: this.mediaButtonOf('iframe', 'F', 'Embedded Web page')
            }
        });

        this[editor].subscribe(
            'editableInput',
            this.setCount.bind(this, { target })
        );
    }
}
