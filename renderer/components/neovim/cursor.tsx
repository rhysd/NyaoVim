import * as React from 'react';
import {findDOMNode} from 'react-dom';
import NeoVim from '../../neovim';

interface Props {
    charUnderCursor?: string;
}

export default class NeoVimCursor extends React.Component<Props, {}> {
    ime_running: boolean;
    control_char: boolean;

    constructor(props: Props) {
        super(props);
        this.ime_running = false;
        this.control_char = false;
    }

    getVimSpecialChar(code: number) {
        switch(code) {
            case 0:   return '<Nul>';
            case 8:   return '<BS>';
            case 9:   return '<Tab>';
            case 10:  return '<NL>';
            case 13:  return '<CR>';
            case 27:  return '<Esc>';
            case 32:  return '<Space>';
            case 92:  return '<Bslash>';
            case 124: return '<Bar>';
            case 127: return '<Del>';
            default:  return null;
        }
    }

    onNormalChar(event: KeyboardEvent) {
        if (this.ime_running || this.control_char) {
            return;
        }

        event.preventDefault();
        const t = event.target as HTMLInputElement;

        if (t.value === '<') {
            console.log('Input to neovim: \\lt');
            NeoVim.client.input('\\lt');
            return;
        }

        console.log('Input to neovim: ', t.value);
        NeoVim.client.input(t.value);
    }

    // Note:
    // Assumes keydown event is always fired before input event
    onControlChar(event: KeyboardEvent) {
        if (this.ime_running) {
            return;
        }

        const special_char = this.getVimSpecialChar(event.keyCode);
        if (special_char !== null) {
            this.control_char = true;
            console.log('Input to neovim: ' + special_char);
            NeoVim.client.input(special_char);
            event.preventDefault();
            return;
        }

        if (event.ctrlKey && event.keyCode !== 17) {
            this.control_char = true;
            // ctrl + something
            const c = `<C-${String.fromCharCode(event.keyCode)}>`;
            console.log('Input to neovim: ' + c);
            NeoVim.client.input(c);
            event.preventDefault();

            if (event.shiftKey) {
                console.log('<C-S-x> combination is not supported yet. Fallback to <C-x>');
            }
        } else if (event.altKey && event.keyCode !== 18) {
            this.control_char = true;
            // alt + something
            const c = `<M-${String.fromCharCode(event.keyCode)}>`;
            console.log('Input to neovim: ' + c);
            NeoVim.client.input(c);
            event.preventDefault();
        }
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
        n.addEventListener('keydown', this.onControlChar.bind(this));
        n.addEventListener('input', this.onNormalChar.bind(this));
    }

    render() {
        return <input
            className="neovim-cursor"
            autoFocus
            value={this.props.charUnderCursor}
            ref="body"
        />;
    }
}
