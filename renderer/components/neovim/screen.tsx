import * as React from 'react';
import Cursor from './cursor';

interface Props {
    lines?: Immutable.List<string>;
    fg_color?: string;
    bg_color?: string;
    size?: {
        lines: number;
        columns: number;
    }
    cursor?: {
        line: number;
        col: number;
    }
}

export default class NeovimScreen extends React.Component<Props, {}> {
    renderLine(line: string, line_num: number) {
        if (!line) {
            return <br key={line_num}/>;
        }

        // TODO: Consider highlight sets
        const c = this.props.cursor;
        if (line_num !== c.line) {
            return <pre key={line_num}>{line}</pre>;
        }

        const line_cursor_before = line.substring(0, c.col);
        let char_under_cursor: string;
        let line_cursor_after: string;
        if (c.col >= line.length) {
            // Note: Cursor is at the end of line
            line_cursor_after = '';
        } else {
            char_under_cursor = line[c.col];
            line_cursor_after = line.substring(c.col + 1);
        }

        return (
            <pre key={line_num}>
                <span>{line_cursor_before}</span>
                <Cursor charUnderCursor={char_under_cursor}/>
                <span>{line_cursor_after}</span>
            </pre>
        );
    }

    renderContents(lines: Immutable.List<string>) {
        return lines.map((l, i) => this.renderLine(l, i)).toArray();
    }

    render() {
        const style = {
            color: this.props.fg_color,
            backgroundColor: this.props.bg_color,
        };
        return (
            <div className="neovim-screen" style={style}>
                <code>
                    {this.renderContents(this.props.lines)}
                </code>
            </div>
        );
    }
}
