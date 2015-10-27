import * as React from 'react';
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

    onNormalChar(event: React.KeyboardEvent) {
        if (this.ime_running || this.control_char) {
            return;
        }

        const t = event.target as HTMLInputElement;
        if (!this.ime_running) {
            console.log('Input to neovim: ', t.value);
            NeoVim.client.input(t.value);
        }
    }

    // Note:
    // Assumes keydown event is always fired before input event
    onControlChar(event: KeyboardEvent) {
        if (this.ime_running) {
            return;
        }

        if (event.keyCode === 0x1b) {
            this.control_char = true;
            console.log('Input to neovim: <Esc>');
            NeoVim.client.input('<Esc>');
            return;
        }

        if (event.ctrlKey && event.keyCode !== 17) {
            this.control_char = true;
            // ctrl + something
            const c = `<C-${String.fromCharCode(event.keyCode)}>`;
            console.log('Input to neovim: ' + c);
            NeoVim.client.input(c);

            if (event.shiftKey) {
                console.log('<C-S-x> combination is not supported yet. Fallback to <C-x>');
            }
            return;
        }

        if (event.altKey && event.keyCode !== 18) {
            this.control_char = true;
            // alt + something
            const c = `<M-${String.fromCharCode(event.keyCode)}>`;
            console.log('Input to neovim: ' + c);
            NeoVim.client.input(c);
            return;
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
        const n = React.findDOMNode(this.refs['body']);
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
