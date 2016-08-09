import {join} from 'path';
import {stat, writeFileSync} from 'fs';
import {app, BrowserWindow, shell} from 'electron';
import {sync as mkdirpSync} from 'mkdirp';
import setMenu from './menu';
import BrowserConfig from './browser-config';

if (process.argv.indexOf('--help') !== -1) {
    console.log(`OVERVIEW: NyaoVim; Web-enhanced Extensible Neovim Frontend

USAGE: nyaovim [options] [neovim args...]

OPTIONS:
  --no-detach : Don't detach the editor process
  --help      : Show this help
  --version   : Show versions of NyaoVim, Electron, Chrome, Node.js, and V8
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
    <neovim-editor id="nyaovim-editor" argv="[[argv]]" font="monospace"></neovim-editor>
  </template>
</dom-module>
`;
        writeFileSync(global.nyaovimrc_path, contents, 'utf8');
    });
}

function isRunFromNpmPackageOnDarwin() {
    'use strict';
    return app.getAppPath().indexOf('/NyaoVim.app/') === -1;
}

const ensure_nyaovimrc = exists(global.nyaovimrc_path).then((e: boolean) => {
    if (!e) {
        return prepareDefaultNyaovimrc();
    } else {
        // Note: This line needs because of TS7030 error
        return undefined;
    }
}).catch(err => console.error(err));

const browser_config = new BrowserConfig();
const prepare_browser_config
    = browser_config.loadFrom(global.config_dir_path)
        .catch(err => console.error(err));

function startMainWindow() {
    'use strict';

    const index_html = 'file://' + join(__dirname, '..', 'renderer', 'main.html');

    const default_config = {
        width: 800,
        height: 600,
        useContentSize: true,
        autoHideMenuBar: true,
        webPreferences: {
            blinkFeatures: 'KeyboardEventKey',
        },
    } as Electron.BrowserWindowOptions;

    const user_config = browser_config.apply(default_config);

    let win = new BrowserWindow(user_config);

    const already_exists = browser_config.configSingletonWindow(win);
    if (already_exists) {
        app.quit();
        return null;
    }

    browser_config.setupWindowState(win);

    win.once('closed', function() {
        win = null;
    });

    win.loadURL(index_html);
    if (process.env.NODE_ENV === 'debug') {
        win.webContents.openDevTools({mode: 'detach'});
    }

    return win;
}

app.once('window-all-closed', () => app.quit());
app.on('open-url', (e: Event, u: string) => {
    e.preventDefault();
    shell.openExternal(u);
});

app.once(
    'ready',
    () => {
        if (process.platform === 'darwin' && isRunFromNpmPackageOnDarwin()) {
            // XXX:
            // app.dock.setIcon() is not defined in github-electron.d.ts yet.
            (app.dock as any).setIcon(join(__dirname, '..', 'resources', 'icon', 'nyaovim-logo.png'));
        }

        Promise.all([
            ensure_nyaovimrc,
            prepare_browser_config,
        ]).then(() => {
            const w = startMainWindow();
            if (w !== null) {
                setMenu(w);
            }
        });
    }
);
