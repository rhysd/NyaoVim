import {join} from 'path';
import {readFileSync} from 'fs';
import extend = require('deep-extend');

export interface BrowserConfigJson {
    window_options: Electron.BrowserWindowOptions;
}

export default class BrowserConfig {
    loaded_config: BrowserConfigJson;

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
        if (typeof this.loaded_config !== 'object' || this.loaded_config === null) {
            return opt;
        }

        if (typeof this.loaded_config.window_options === 'object') {
            extend(opt, this.loaded_config.window_options);
        }

        return opt;
    }
}
