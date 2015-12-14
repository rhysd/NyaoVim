import {join} from 'path';
import {app, BrowserWindow} from 'electron';

const index_html = 'file://' + join(__dirname, '..', '..', 'index.html');

app.on('ready', function() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        useContentSize: true,
    });

    win.on('closed', function() {
        win = null;
        app.quit();
    });

    win.loadURL(index_html);
    if (process.env.NODE_ENV !== 'production') {
        win.webContents.openDevTools({detach: true});
    }
});
