import * as React from 'react';
import * as ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/app';
import Store from './store';
import NeoVim from './neovim';

// FIXME: Temporary
NeoVim.start([]);

ReactDom.render(
    <Provider store={Store}>
        <App/>
    </Provider>,
    document.querySelector('.app')
);
