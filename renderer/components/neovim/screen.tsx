import * as React from 'react';

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
            return <div key={line_num}>{line}</div>;
        }

        return (
            <div key={line_num}>
                <span>{line.substring(0, c.col)}</span>
                <input className="neovim-cursor" autoFocus/>
                <span>{line.substring(c.col)}</span>
            </div>
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
