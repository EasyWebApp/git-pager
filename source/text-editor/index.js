import { component, mapProperty, mapData, on, decodeMarkup } from 'web-cell';

import template from './index.html';

const origin_editor = Symbol('Origin editor'),
    super_editor = Symbol('Super editor');

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
        const data = this[super_editor].serialize();

        for (let key in data) return data[key].value;
    }

    @on('keyup', '[contenteditable]')
    setCount() {
        this.view.render({ count: decodeMarkup(this.value).length });
    }

    static mediaButtonOf(tag, icon, title = '') {
        const extension = new self.CustomHtml({
            get htmlToInsert() {
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

        const target = (this[origin_editor] = this.querySelector(
                'textarea, [contenteditable]'
            )),
            buttons = (this.getAttribute('buttons') || '')
                .split(/\s*,\s*/)
                .filter(Boolean);

        this[super_editor] = new self.MediumEditor(target, {
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
                image: TextEditor.mediaButtonOf('img', 'P', 'Image'),
                audio: TextEditor.mediaButtonOf('audio', 'S', 'Audio'),
                video: TextEditor.mediaButtonOf('video', 'V', 'Video'),
                iframe: TextEditor.mediaButtonOf(
                    'iframe',
                    'F',
                    'Embedded Web page'
                )
            }
        });

        this.setCount({ target });
    }
}
