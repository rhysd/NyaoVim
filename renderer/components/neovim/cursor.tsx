import * as React from 'react';
import NeoVim from '../../neovim';

interface Props {
    charUnderCursor?: string;
}

export default class NeoVimCursor extends React.Component<Props, {}> {
    ime_running: boolean;

    constructor(props: Props) {
        super(props);
        this.ime_running = false;
    }

    onInputChar(event: React.KeyboardEvent) {
        const t = event.target as HTMLInputElement;
        if (!this.ime_running) {
            console.log('Input to neovim: ', t.value);
            NeoVim.client.input(t.value);
        }
    }

    onKeyPress(event: React.KeyboardEvent) {
        console.log('key press', event);
    }

    startComposition(event: Event) {
        this.ime_running = true;
    }

    endComposition(event: Event) {
        this.ime_running = false;
    }

    componentDidMount() {
        // Note:
        // Use findDOMNode() because react.d.ts doesn't support v0.14 yet.
        const n = React.findDOMNode(this.refs['body']);
        n.addEventListener('compositionstart', this.startComposition.bind(this));
        n.addEventListener('compositionend', this.endComposition.bind(this));
    }

    render() {
        return <input
            className="neovim-cursor"
            autoFocus
            value={this.props.charUnderCursor}
            onKeyPress={this.onKeyPress.bind(this)}
            ref="body"
        />;
    }
}
