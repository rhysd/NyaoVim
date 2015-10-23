import * as React from 'react';
import {connect} from 'react-redux';
import {StateType} from '../reducers';

class App extends React.Component<{}, {}> {
    render() {
        return (
            <div className="root">
            </div>
        );
    }
}

function select(state: StateType) {
    return state;
}

export default connect(select)(App);
