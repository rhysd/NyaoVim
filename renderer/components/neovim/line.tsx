import * as React from 'react';
import Cursor from './cursor';
import NeoVim from '../../neovim';

interface Props {
    line: string;
    line_num: number;
    busy: boolean;
    mode: string;
    cursor_col: number;
    instance: NeoVim;
    key?: number;
    [key: string]: any;
}

export default class Line extends React.Component<Props, {}> {
    shouldComponentUpdate(next_props: Props) {
        const p = this.props;
        if (next_props === p) {
            return false;
        }

        for (const k in p) {
            if (next_props[k] !== p[k]) {
                return true;
            }
        }
        return false;
    }

    render() {
        const {cursor_col, line, line_num, mode, busy, instance} = this.props;

        if (!line && cursor_col === null) {
            return <pre>{' '}</pre>;
        }

        // TODO: Consider highlight sets
        if (cursor_col === null || busy) {
            return <pre>{line}</pre>;
        }

        const line_cursor_before = line.substring(0, cursor_col);
        let char_under_cursor: string;
        let line_cursor_after: string;
        if (cursor_col >= line.length) {
            // Note: Cursor is at the end of line
            line_cursor_after = '';
        } else {
            if (mode === "insert") {
                line_cursor_after = line.substring(cursor_col);
            } else {
                char_under_cursor = line[cursor_col];
                line_cursor_after = line.substring(cursor_col + 1);
            }
        }

        return (
            <pre>
                <span>{line_cursor_before}</span>
                <Cursor charUnderCursor={char_under_cursor} mode={mode} instance={instance}/>
                <span>{line_cursor_after}</span>
            </pre>
        );
    }
}
