import * as React from 'react';
import * as ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/app';
import Store from './store';
import NeoVimHandler from './neovim-handler';
const neovim_handler = new NeoVimHandler();

ReactDom.render(
    <Provider store={Store}>
        <App/>
    </Provider>,
    document.querySelector('.app')
);
