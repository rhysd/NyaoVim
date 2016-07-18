import {join} from 'path';
import {readFileSync} from 'fs';
import {app} from 'electron';
import extend = require('deep-extend');
import windowStateKeeper = require('electron-window-state');

export interface BrowserConfigJson {
    remember_window_state: boolean;
    window_options: Electron.BrowserWindowOptions;
    single_instance: boolean;
}

export default class BrowserConfig {
    loaded_config: BrowserConfigJson;
    window_state: ElectronWindowState.WindowState;

    constructor() {
        this.loaded_config = null;
        this.window_state = null;
    }

    loadFrom(config_dir: string) {
        return new Promise<void>(resolve => {
            try {
                const config_file = join(config_dir, 'browser-config.json');
                const content = readFileSync(config_file, 'utf8');
                this.loaded_config = JSON.parse(content);
            } catch (e) {
                // Do nothing
            }
            resolve();
        });
    }

    apply(opt: Electron.BrowserWindowOptions): Electron.BrowserWindowOptions {
        if (typeof this.loaded_config !== 'object' || this.loaded_config === null) {
            return opt;
        }

        if (typeof this.loaded_config.window_options === 'object') {
            extend(opt, this.loaded_config.window_options);
        }

        if (this.loaded_config.remember_window_state) {
            const s = windowStateKeeper({
                defaultWidth: 1000,
                defaultHeight: 800,
                path: global.config_dir_path,
            });
            if (typeof s.x === 'number') {
                opt.x = s.x;
            }
            if (typeof s.y === 'number') {
                opt.y = s.y;
            }
            opt.width = s.width;
            opt.height = s.height;
            if (typeof s.isFullScreen === 'boolean') {
                opt.fullscreen = s.isFullScreen;
            }

            this.window_state = s;
        }

        return opt;
    }

    setupWindowState(win: Electron.BrowserWindow) {
        if (this.window_state === null) {
            return null;
        }
        win.on('resize', () => {
            this.window_state.saveState(win);
        });

        if (this.window_state.isMaximized) {
            win.maximize();
        }
        return this.window_state;
    }

    configSingletonWindow(win: Electron.BrowserWindow) {
        if (this.loaded_config === null || !this.loaded_config.single_instance) {
            return false;
        }
        return app.makeSingleInstance((argv, cwd) => {
            if (win.isMinimized()) {
                win.restore();
            }
            win.focus();

            // Note: Omit Electron binary and NyaoVim directory
            const args = argv.slice(2);
            if (args.length !== 0) {
                win.webContents.send('nyaovim:exec-commands', [
                    'cd ' + cwd,
                    'args ' + args.join(' '),
                ]);
            }
            return true;
        });
    }
}
