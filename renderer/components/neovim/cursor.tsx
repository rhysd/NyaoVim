import * as React from 'react';
import {findDOMNode} from 'react-dom';
import NeoVim from '../../neovim';

interface Props {
    charUnderCursor: string;
    mode: string;
}

export default class Cursor extends React.Component<Props, {}> {
    ime_running: boolean;

    constructor(props: Props) {
        super(props);
        this.ime_running = false;
    }

    resetInput(target: HTMLInputElement) {
        const {mode, charUnderCursor} = this.props;
        if (mode === "normal" && charUnderCursor) {
            target.value = charUnderCursor;
        } else {
            target.value = '';
        }
    }

    getInput(target: HTMLInputElement) {
        console.log('getInput', JSON.stringify(target.value));
        const {mode, charUnderCursor} = this.props;
        if (mode === "normal" && charUnderCursor) {
            return target.value.slice(0, -1);
        } else {
            return target.value;
        }
    }

    inputToNeovim(input: string, event: Event) {
        console.log('Input to neovim: ' + input);
        NeoVim.client.input(input);
        event.preventDefault();
        event.stopPropagation();
        this.resetInput(event.target as HTMLInputElement);
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

        const input = this.getInput(event.target as HTMLInputElement);

        console.log('input', JSON.stringify(input));

        if (input === '') {
            console.log('onInsertNormalChar: Empty');
            return;
        }

        if (input === '<') {
            this.inputToNeovim('\\lt', event);
            return;
        }

        this.inputToNeovim(input, event);
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
    }

    render() {
        const props = {
            className: "neovim-cursor " + this.props.mode,
            autoFocus: true,
            value: undefined as string,
            ref: "body",
        };

        if (this.props.mode === "normal") {
            props.value = this.props.charUnderCursor;
        }

        return <input {...props}/>;
    }
}
