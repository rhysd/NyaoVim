import * as React from 'react';
import {connect} from 'react-redux';
import {StateType} from '../reducers';
import NeovimScreen from './neovim/screen';
import TabbedHeader from './tabbed-header';

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

class App extends React.Component<Props, {}> {
    render() {
        return (
            <div className="root">
                <div className="window">
                    <TabbedHeader />
                    <div className="window-content">
                        <NeovimScreen {...this.props}/>
                    </div>
                </div>
            </div>
        );
    }
}

function select(state: StateType) {
    return state;
}

export default connect(select)(App);
