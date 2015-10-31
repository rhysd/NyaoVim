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
                    <div className="window-content">
                        {this.renderNeovim(neovim)}
                    </div>
                </div>
            </div>
        );
    }
}

function select(state: StateType) {
    return {
        current_id: state.current_id,
        ids: state.ids,
        neovim: state.neovims[state.current_id],
    };
}

export default connect(select)(App);
