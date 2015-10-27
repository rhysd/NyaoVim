import * as path from 'path';
import * as app from 'app';
import * as BrowserWindow from 'browser-window';

const index_html = 'file://' + path.join(__dirname, '..', '..', 'index.html');

app.on('ready', () => {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
    });

    win.on('closed', () => {
        win = null;
        app.quit();
    });

    win.openDevTools({detach: true});

    win.loadUrl(index_html);
});
