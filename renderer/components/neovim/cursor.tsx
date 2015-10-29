import * as React from 'react';
import {findDOMNode} from 'react-dom';
import NeoVim from '../../neovim';

interface Props {
    charUnderCursor: string;
    mode: string;
}

export default class Cursor extends React.Component<Props, {}> {
    ime_running: boolean;
    keydown_listener: (event: Event) => void;

    constructor(props: Props) {
        super(props);
        this.ime_running = false;
    }

    inputToNeovim(input: string, event: Event) {
        console.log('Input to neovim: ' + input);
        NeoVim.client.input(input);
        event.preventDefault();
        event.stopPropagation();
        const t = event.target as HTMLInputElement;
        t.value = '';
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

    // Note:
    // Assumes keydown event is always fired before input event
    onInsertControlChar(event: KeyboardEvent) {
        if (this.ime_running) {
            return;
        }

        const special_char = this.getVimSpecialChar(event.keyCode);
        if (special_char !== null) {
            this.inputToNeovim(special_char, event);
            return;
        }

        if (event.ctrlKey && event.keyCode !== 17) {
            // ctrl + something
            this.inputToNeovim(`<C-${String.fromCharCode(event.keyCode)}>`, event);

            if (event.shiftKey) {
                console.log('<C-S-x> combination is not supported yet. Fallback to <C-x>');
            }
        } else if (event.altKey && event.keyCode !== 18) {
            // alt + something
            this.inputToNeovim(`<M-${String.fromCharCode(event.keyCode)}>`, event);
        }
    }

    static convertCodeToVimChar(code: number) {
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
            case 32:  return 'Space';
            case 92:  return 'Bslash';
            case 124: return 'Bar';
            case 127: return 'Del';
            default:  return String.fromCharCode(code).toLowerCase();
        }
    }


    onNormalChar(e: KeyboardEvent) {
        console.log('onNormalChar', e);
        const c = e.keyCode;

        // TODO: handle meta key
        if ((e.shiftKey && c === 16) ||
            (e.ctrlKey && c === 17) ||
            (e.altKey && c === 18)
        ) {
            return;
        }

        let input = '';
        if (e.ctrlKey) {
            input += 'C-';
        }
        if (e.altKey) {
            input += 'A-';
        }
        if (e.shiftKey) {
            input += 'S-';
        }

        const ch = Cursor.convertCodeToVimChar(c);

        if (input === '' && ch.length === 1) {
            input = ch;
        } else {
            input = '<' + input + ch + '>';
        }

        this.inputToNeovim(input, event);
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
        if (this.props.mode === "insert") {
            const n = findDOMNode(this.refs['insert_body']);
            n.addEventListener('compositionstart', this.startComposition.bind(this));
            n.addEventListener('compositionend', this.endComposition.bind(this));
            n.addEventListener('keydown', this.onInsertControlChar.bind(this));
            n.addEventListener('input', this.onInsertNormalChar.bind(this));
        } else {
            this.keydown_listener = this.onNormalChar.bind(this)
            window.addEventListener('keydown', this.keydown_listener);
        }
    }

    componentWillUnmount() {
        if (this.keydown_listener) {
            window.removeEventListener('keydown', this.keydown_listener);
        }
    }

    render() {
        const props = {
            className: "neovim-" + this.props.mode + "-cursor",
            autoFocus: true,
            ref: this.props.mode + "_body",
        };

        if (this.props.mode === "insert") {
            return <input {...props}/>;
        } else {
            return (
                <span {...props}>
                    {this.props.charUnderCursor || ' '}
                </span>
            );
        }
    }
}
