import * as React from 'react';
import {connect} from 'react-redux';
import {StateType, NeovimState} from '../reducers';
import NeovimScreen from './neovim/screen';
import TabbedHeader from './tabbed-header';
import * as Action from '../actions';

interface Props {
    curren_id?: number;
    neovim?: NeovimState;
    dispatch?: (action: Action.Type) => void;
}

function calcScreenSize() {
    const ratio = window.devicePixelRatio || 1;
    const n = document.querySelector('.font-test');
    const font_height = n.clientHeight / ratio;
    const font_width = n.clientWidth / ratio;
    n.parentNode.removeChild(n);
    return {
        height: Math.floor((document.body.clientHeight - 30) / font_height),
        width: Math.floor(document.body.clientWidth / font_width),
    };
}

class App extends React.Component<Props, {}> {
    renderNeovim(neovim: NeovimState) {
        if (neovim) {
            return <NeovimScreen {...neovim}/>;
        } else {
            const size = calcScreenSize();
            this.props.dispatch(Action.createNeovim(
                size.height,
                size.width,
                []
            ));
            return undefined;
        }
    }

    render() {
        return (
            <div className="root">
                <div className="window">
                    <TabbedHeader />
                    <div className="window-content">
                        {this.renderNeovim(this.props.neovim)}
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
