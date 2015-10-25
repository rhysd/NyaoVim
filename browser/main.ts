import * as path from 'path';
import * as app from 'app';
import * as BrowserWindow from 'browser-window';
import NeoVim from './neovim';

const index_html = 'file://' + path.join(__dirname, '..', '..', 'index.html');
let neovim: NeoVim = null;

app.on('ready', () => {
    let win = new BrowserWindow({
        width: 1000,
        height: 800,
    });
    neovim = new NeoVim(win, []);

    win.on('closed', () => {
        win = null;
        app.quit();
    });

    win.loadUrl(index_html);
});
