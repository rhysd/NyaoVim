import {join} from 'path';
import {writeFileSync} from 'fs';
import {Application} from 'spectron';
import * as electron from 'electron-prebuilt';

export default class NyaoVim extends Application {
    constructor(debug: boolean = false) {
        super({
            path: electron,
            args: [join(__dirname, '..', '..')],
            env: Object.assign({}, process.env, {
                NODE_ENV: debug ? 'debug' : 'production',
                NYAOVIM_E2E_TEST_RUNNING: 'true',
            }),
        });
    }

    getRendererProcessLogs() {
        return this.client.getRenderProcessLogs().then(
            logs => logs.map(l => `[${l.level}]: ${l.message}`)
        );
    }

    getMainProcessLogs() {
        return this.client.getMainProcessLogs();
    }

    getLogsJson() {
        return Promise.all([
            this.getRendererProcessLogs(),
            this.getMainProcessLogs(),
        ]).then(([ml, rl]) => {
            const obj = {
                main: ml,
                renderer: rl,
            };
            return JSON.stringify(obj, null, 2);
        });
    }

    dumpLogsTo(file_name: string, dir?: string) {
        this.getLogsJson().then(
            json => writeFileSync(join(dir || '.', file_name), json, 'utf8')
        );
    }
}
