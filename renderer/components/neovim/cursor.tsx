import * as React from 'react';
import {findDOMNode} from 'react-dom';
import NeoVim from '../../neovim';

interface Props {
    charUnderCursor: string;
    mode: string;
    instance: NeoVim;
}

export default class Cursor extends React.Component<Props, {}> {
    ime_running: boolean;

    constructor(props: Props) {
        super(props);
        this.ime_running = false;
    }

    inputToNeovim(input: string, event: Event) {
        console.log('Input to neovim: ' + input);
        this.props.instance.client.input(input);
        event.preventDefault();
        event.stopPropagation();
        const t = event.target as HTMLInputElement;
        t.value = '';
    }

    getVimSpecialChar(code: number) {
        switch(code) {
            case 0:   return 'Nul';
            case 8:   return 'BS';
            case 9:   return 'Tab';
            case 10:  return 'NL';
            case 13:  return 'CR';
            case 27:  return 'Esc';
            case 32:  return 'Space';
            case 35:  return 'End';
            case 36:  return 'Home';
            case 37:  return 'Left';
            case 38:  return 'Up';
            case 39:  return 'Right';
            case 40:  return 'Down';
            case 46:  return 'Del';
            case 92:  return 'Bslash';
            case 124: return 'Bar';
            case 127: return 'Del';
            default:  return null;
        }
    }

    onInsertNormalChar(event: KeyboardEvent) {
        if (this.ime_running) {
            return;
        }

        const t = event.target as HTMLInputElement;
        if (t.value === '') {
            console.log('onInsertNormalChar: Empty');
            return;
        }

        if (t.value === '<') {
            this.inputToNeovim('\\lt', event);
            return;
        }

        this.inputToNeovim(t.value, event);
    }

    static shouldHandleModifier(event: KeyboardEvent) {
        return event.ctrlKey && event.keyCode !== 17 ||
               event.altKey && event.keyCode !== 18;
    }

    // Note:
    // Assumes keydown event is always fired before input event
    onInsertControlChar(event: KeyboardEvent) {
        if (this.ime_running) {
            return;
        }

        const special_char = this.getVimSpecialChar(event.keyCode);
        if (!Cursor.shouldHandleModifier(event) && !special_char) {
            return;
        }

        let vim_input = '<';
        if (event.ctrlKey) {
            vim_input += 'C-';
        }
        if (event.altKey) {
            vim_input += 'A-';
        }
        vim_input += (special_char || String.fromCharCode(event.keyCode)) + '>';
        this.inputToNeovim(vim_input, event);
    }

    focusInput() {
        const n = findDOMNode(this.refs['body']) as HTMLInputElement;
        n.focus();
    }

    startComposition(event: Event) {
        console.log('start composition');
        this.ime_running = true;
    }

    endComposition(event: Event) {
        console.log('end composition');
        this.ime_running = false;
    }

    componentDidMount() {
        // Note:
        // Use findDOMNode() because react.d.ts doesn't support v0.14 yet.
        const n = findDOMNode(this.refs['body']);
        n.addEventListener('compositionstart', this.startComposition.bind(this));
        n.addEventListener('compositionend', this.endComposition.bind(this));
        n.addEventListener('keydown', this.onInsertControlChar.bind(this));
        n.addEventListener('input', this.onInsertNormalChar.bind(this));
        n.addEventListener('blur', e => e.preventDefault());
    }

    componentDidUpdate() {
        const n = findDOMNode(this.refs['body']);
        n.focus();
    }

    render() {
        const props = {
            className: "neovim-cursor",
            autoFocus: true,
            ref: "body",
        };

        if (this.props.mode === 'normal') {
            return (
                <span className="block-cursor" onClick={this.focusInput.bind(this)}>
                    {this.props.charUnderCursor || ' '}<input {...props}/>
                </span>
            );
        } else {
            return <input {...props}/>;
        }
    }
}
