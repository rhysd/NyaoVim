import * as React from 'react';
import * as ReactDom from 'react-dom';
import {Provider} from 'react-redux';
import App from './components/app';
import Store from './store';
import NeoVim from './neovim';

function calcScreenSize() {
    const ratio = window.devicePixelRatio || 1;
    const n = document.querySelector('.font-test');
    const font_height = n.clientHeight / ratio;
    const font_width = n.clientWidth / ratio;
    n.parentNode.removeChild(n);
    return {
        height: Math.floor(document.body.clientHeight / font_height),
        width: Math.floor(document.body.clientWidth / font_width),
    };
}

NeoVim.start(calcScreenSize(), []);

ReactDom.render(
    <Provider store={Store}>
        <App/>
    </Provider>,
    document.querySelector('.app')
);
