import * as React from 'react';
import {connect} from 'react-redux';
import {StateType, NeovimState} from '../reducers';
import NeovimScreen from './neovim/screen';
import TabbedHeader from './tabbed-header';

interface Props {
    curren_id?: number;
    neovim?: NeovimState;
}

class App extends React.Component<Props, {}> {
    render() {
        return (
            <div className="root">
                <div className="window">
                    <TabbedHeader />
                    <div className="window-content">
                        <NeovimScreen {...this.props.neovim}/>
                    </div>
                </div>
            </div>
        );
    }
}

function select(state: StateType) {
    return {
        current_id: state.current_id,
        neovim: state.neovims[state.current_id],
    };
}

export default connect(select)(App);
