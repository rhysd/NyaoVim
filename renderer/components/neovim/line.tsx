import * as React from 'react';
import Cursor from './cursor';

interface Props {
    line: string;
    line_num: number;
    busy: boolean;
    mode: string;
    cursor: {
        line: number;
        col: number;
    }
    key?: number;
}

export default class Line extends React.Component<Props, {}> {
    render() {
        const {cursor, line, line_num, mode, busy} = this.props;

        if (!line && line_num !== cursor.line) {
            return <pre>{' '}</pre>;
        }

        // TODO: Consider highlight sets
        if (line_num !== cursor.line || busy) {
            return <pre>{line}</pre>;
        }

        const line_cursor_before = line.substring(0, cursor.col);
        let char_under_cursor: string;
        let line_cursor_after: string;
        if (cursor.col >= line.length) {
            // Note: Cursor is at the end of line
            line_cursor_after = '';
        } else {
            if (mode === "insert") {
                line_cursor_after = line.substring(cursor.col);
            } else {
                char_under_cursor = line[cursor.col];
                line_cursor_after = line.substring(cursor.col + 1);
            }
        }

        return (
            <pre>
                <span>{line_cursor_before}</span>
                <Cursor charUnderCursor={char_under_cursor} mode={mode}/>
                <span>{line_cursor_after}</span>
            </pre>
        );
    }
}
