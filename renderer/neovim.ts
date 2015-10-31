import * as NvimClient from 'promised-neovim-client';
import * as Action from './actions';
import Store from './store';

// Note:
// Use renderer's node.js integration to avoid using ipc for large data transfer
import * as cp from 'child_process';
const child_process: typeof cp = global.require('child_process');

const attach = (global.require('promised-neovim-client') as typeof NvimClient).attach;

// Note:
// TypeScript doesn't allow recursive definition
export type RPCValue =
        NvimClient.Buffer |
        NvimClient.Window |
        NvimClient.Tabpage |
        number |
        boolean |
        string |
        any[] |
        {[key:string]: any};

interface Size {
    height: number;
    width: number;
}

export default class NeoVim {
    neovim_process: cp.ChildProcess;
    client: NvimClient.Nvim;
    started: boolean;

    constructor(lines: number, columns: number, argv: string[], cmd: string) {
        this.started = false;
        argv.push('--embed');
        this.neovim_process = child_process.spawn(cmd, argv, {stdio: ['pipe', 'pipe', process.stderr]});
        this.client = null;
        attach(this.neovim_process.stdin, this.neovim_process.stdout)
            .then(nvim => {
                this.client = nvim;
                nvim.on('request', this.onRequested.bind(this));
                nvim.on('notification', this.onNotified.bind(this));
                nvim.on('disconnect', this.onDisconnected.bind(this));
                nvim.uiAttach(columns, lines, true);
                this.started = true;
                console.log(`nvim attached: ${this.neovim_process.pid} ${lines}x${columns} ${JSON.stringify(argv)}`);
            }).catch(err => console.log(err));
    }

    onRequested(method: string, args: RPCValue[], response: RPCValue) {
        console.log('requested: ', method, args, response);
    }

    onNotified(method: string, args: RPCValue[]) {
        if (method === 'redraw') {
            Store.dispatch(Action.redraw(args as RPCValue[][]));
        } else {
            console.log('unknown method', method, args);
        }
    }

    onDisconnected() {
        console.log('disconnected: ' + this.neovim_process.pid);
        // TODO:
        // Uncomment below line to close window on quit.
        // I don't do yet for debug.
        // global.require('remote').getCurrentWindow().close();
        this.started = false;
    }
}

