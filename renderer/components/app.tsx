import * as React from 'react';
import {connect} from 'react-redux';
import {StateType} from '../reducers';
import NeovimScreen from './neovim-screen';

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

class App extends React.Component<Props, {}> {
    render() {
        return (
            <div className="root">
                <NeovimScreen {...this.props}>
                </NeovimScreen>
            </div>
        );
    }
}

function select(state: StateType) {
    return state;
}

export default connect(select)(App);
