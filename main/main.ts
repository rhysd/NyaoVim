import {join} from 'path';
import {stat, writeFileSync} from 'fs';
import {app, BrowserWindow} from 'electron';
import {sync as mkdirpSync} from 'mkdirp';

const index_html = 'file://' + join(__dirname, '..', 'renderer', 'main.html');

const config_dir_name =
        process.platform !== 'darwin' ?
            app.getPath('appData') :
            process.env.XDG_CONFIG_HOME || join(process.env.HOME, '.config');

global.config_dir_path = join(config_dir_name, 'nyaovim');
global.nyaovimrc_path = join(global.config_dir_path, 'nyaovimrc.html');

function exists(path: string) {
    'use strict';
    return new Promise<boolean>(resolve => {
        stat(path, (err, stats) => {
            if (err) {
                return resolve(false);
            }
            return resolve(stats.isFile() || stats.isDirectory());
        });
    });
}

function prepareDefaultNyaovimrc() {
    'use strict';
    console.log('Generate default nyaovimrc at ' + global.nyaovimrc_path);

    return exists(global.config_dir_path).then(e => {
        if (!e) {
            mkdirpSync(global.config_dir_path);
        }
    }).then(() => {
        const contents =
`<dom-module id="nyaovim-app">
  <template>
    <style>
      /* CSS configurations here */
    </style>

    <!-- Component tags here -->
    <neovim-editor id="nyaovim-editor" argv$="[[argv]]"></neovim-editor>
  </template>
</dom-module>
`;
        writeFileSync(global.nyaovimrc_path, contents, 'utf8');
    });
}

const ensure_nyaovimrc = exists(global.nyaovimrc_path).then((e: boolean) => {
    if (!e) {
        return prepareDefaultNyaovimrc();
    }
}).catch(err => console.error(err));

function startMainWindow() {
    let win = new BrowserWindow({
        width: 800,
        height: 600,
        useContentSize: true,
    });

    win.once('closed', function() {
        win = null;
    });

    win.loadURL(index_html);
    if (process.env.NODE_ENV !== 'production') {
        win.webContents.openDevTools({detach: true});
    }
}

app.once('window-all-closed', () => app.quit());

app.once(
    'ready',
    () => ensure_nyaovimrc.then(
        () => startMainWindow()
    )
);
