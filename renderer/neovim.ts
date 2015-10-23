import * as NvimClient from 'promised-neovim-client';
import * as Action from './actions';
import Store from './store';

// Note:
// Use renderer's node.js integration to avoid using ipc for large data transfer
import * as cp from 'child_process';
const child_process: typeof cp = global.require('child_process');

export class NeoVim {
    neovim_process: cp.ChildProcess;
    client: NvimClient.Nvim;
    started: boolean;

    constructor() {
        this.started = false;
    }

    start(argv: string[], cmd = 'nvim') {
        argv.push('-u', 'NONE', '-N', '--embed');
        this.neovim_process = child_process.spawn(cmd, argv);
        this.client = null;
        NvimClient.attach(this.neovim_process.stdin, this.neovim_process.stdout)
            .then(nvim => {
                this.client = nvim;
                nvim.on('request', this.onRequested.bind(this));
                nvim.on('notification', this.onNotified.bind(this));
                nvim.on('disconnect', this.onDisconnected.bind(this));
                nvim.subscribe('Gui');
                nvim.uiAttach(80, 24, true);
                this.started = true;
            });
    }

    onRequested(method: string, args: any[], response: any) {
        console.log('requested: ', method, args, response);
    }

    onNotified(method: string, args: any[]) {
        console.log('notified: ', method, args);
        if (method === 'redraw') {
            Store.dispatch(Action.redraw(args));
        } else {
            console.log('unknown method', method);
        }
    }

    onDisconnected() {
        console.log('disconnected: ' + this.neovim_process.pid);
        this.started = false;
    }
}

const NeoVimSinglton = new NeoVim();

export default NeoVimSinglton;
