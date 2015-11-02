import * as React from 'react';
import {connect} from 'react-redux';
import {StateType, NeovimState} from '../reducers';
import NeovimScreen from './neovim/screen';
import TabbedHeader from './tabbed-header';
import * as Action from '../actions';

interface Props {
    current_id?: number;
    ids?: number[];
    neovim?: NeovimState;
    dispatch?: (action: Action.Type) => void;
}

class App extends React.Component<Props, {}> {
    renderNeovim(neovim: NeovimState) {
        if (neovim) {
            return <NeovimScreen {...neovim}/>;
        } else {
            this.props.dispatch(Action.createNeovim([]));
            return undefined;
        }
    }

    render() {
        const {neovim, current_id, ids, dispatch} = this.props;
        return (
            <div className="root">
                <div className="window">
                    <TabbedHeader current_id={current_id} ids={ids} dispatch={dispatch}/>
                    {this.renderNeovim(neovim)}
                </div>
            </div>
        );
    }
}

function select(state: StateType) {
    let current_id = state.current_id;

    // XXX
    if (current_id === undefined) {
        console.log('Bug: current_id is undefined!!', state);
        current_id = state.ids[state.ids.length - 1] || 0;
    }

    return {
        current_id: current_id,
        ids: state.ids,
        neovim: state.neovims[current_id],
    };
}

export default connect(select)(App);
