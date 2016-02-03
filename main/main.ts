import {join} from 'path';
import {stat, writeFileSync} from 'fs';
import {app, BrowserWindow, shell} from 'electron';
import {sync as mkdirpSync} from 'mkdirp';
import setMenu from './menu';

if (process.argv.indexOf('--help') !== -1) {
    console.log(`OVERVIEW: NyaoVim; Web-enhanced Extensible Neovim Frontend

USAGE: nyaovim [options] [neovim args...]

OPTIONS:
  --help    Show this help
  --version Show versions of NyaoVim, Electron, Chrome, Node.js, and V8
`);
    app.quit();
}

if (process.argv.indexOf('--version') !== -1) {
    const vs: {[n: string]: string} = process.versions as any;
    const versions = ['electron', 'chrome', 'node', 'v8'].map((n: string) => `  ${n} : ${vs[n]}`).join('\n');
    console.log(`${app.getName()} version ${app.getVersion()}
${versions}
`);
    app.quit();
}

// TODO:
// Enable this application to make single instance by app.makeSingleInstance().
// It should be controlled by window-config.json .

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
    <neovim-editor id="nyaovim-editor" argv$="[[argv]]" font="monospace"></neovim-editor>
  </template>
</dom-module>
`;
        writeFileSync(global.nyaovimrc_path, contents, 'utf8');
    });
}

function isRunFromNpmPackage() {
    'use strict';
    return app.getAppPath().indexOf('/NyaoVim.app/') === -1;
}

const ensure_nyaovimrc = exists(global.nyaovimrc_path).then((e: boolean) => {
    if (!e) {
        return prepareDefaultNyaovimrc();
    }
}).catch(err => console.error(err));

function startMainWindow() {
    'use strict';

    const index_html = 'file://' + join(__dirname, '..', 'renderer', 'main.html');

    let win = new BrowserWindow({
        width: 800,
        height: 600,
        useContentSize: true,
        webPreferences: {
            blinkFeatures: 'KeyboardEventKey'
        } as any, // XXX: because 'blink feature is not added to d.ts yet.'
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
app.on('open-url', (e: Event, u: string) => {
    e.preventDefault();
    shell.openExternal(u);
});

app.once(
    'ready',
    () => {
        if (process.platform === 'darwin' && isRunFromNpmPackage()) {
            // XXX:
            // app.dock.setIcon() is not defined in github-electron.d.ts yet.
            (app.dock as any).setIcon(join(__dirname, '..', 'resources', 'icon', 'nyaovim-logo.png'));
        }

        ensure_nyaovimrc.then(
            () => startMainWindow()
        );

        setMenu();
    }
);
