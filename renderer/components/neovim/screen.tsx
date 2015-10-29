import * as React from 'react';
import Line from './line';

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
    mode?: string;
    busy?: boolean;
}

export default class Screen extends React.Component<Props, {}> {
    render() {
        const style = {
            color: this.props.fg_color,
            backgroundColor: this.props.bg_color,
        };

        const contents = this.props.lines.map((l, i) => {
            const includes_cursor = this.props.cursor.line === i;
            const props = {
                line: l || '',
                line_num: i,
                busy: this.props.busy,
                mode: this.props.mode,
                cursor_col: includes_cursor ? this.props.cursor.col : null,
                key: i,
            };
            return <Line {...props}/>;
        }).toArray();

        return (
            <div className="neovim-screen" style={style}>
                <code>
                    {contents}
                </code>
            </div>
        );
    }
}
