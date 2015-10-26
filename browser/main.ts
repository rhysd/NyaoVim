import * as path from 'path';
import * as app from 'app';
import * as BrowserWindow from 'browser-window';

const index_html = 'file://' + path.join(__dirname, '..', '..', 'index.html');

app.on('ready', () => {
    let win = new BrowserWindow({
        width: 1000,
        height: 800,
    });

    win.on('closed', () => {
        win = null;
        app.quit();
    });

    win.loadUrl(index_html);
});
