import {join} from 'path';
import {readFileSync} from 'fs';
import extend = require('deep-extend');

export default class BrowserConfig {
    loaded_config: Electron.BrowserWindowOptions;

    constructor() {
        this.loaded_config = null;
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
        extend(opt, this.loaded_config);
        return opt;
    }
}
