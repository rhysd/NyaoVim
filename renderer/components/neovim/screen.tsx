import * as React from 'react';
import Line from './line';
import {NeovimState} from '../../reducers';

export default class Screen extends React.Component<NeovimState, {}> {
    render() {
        const {fg_color, bg_color, lines, cursor, busy, mode} = this.props;
        const style = {
            color: fg_color,
            backgroundColor: bg_color,
        };

        const contents = lines.map((l, i) => {
            const includes_cursor = cursor.line === i;
            const props = {
                line: l || '',
                line_num: i,
                busy: busy,
                mode: mode,
                cursor_col: includes_cursor ? cursor.col : null,
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
