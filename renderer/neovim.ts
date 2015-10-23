import {spawn, ChildProcess} from 'child_process';
import * as NvimClient from 'promised-neovim-client';

export class NeoVim {
    neovim_process: ChildProcess;
    client: NvimClient.Nvim;
    started: boolean;

    constructor() {
        this.started = false;
    }

    start(argv: string[], cmd = 'nvim') {
        argv.push('-u', 'NONE', '-N', '--embed');
        this.neovim_process = spawn(cmd, argv);
        this.client = null;
        NvimClient.attach(this.neovim_process.stdin, this.neovim_process.stdout)
            .then(nvim => {
                this.client = nvim;
                nvim.on('request', this.onRequested.bind(this));
                nvim.on('notification', this.onNotified.bind(this));
                nvim.on('disconnect', this.onDisconnected.bind(this));
                nvim.subscribe('Gui');
            });
        this.started = true;
    }

    onRequested(method: string, args: any[], response: any) {
        console.log('requested: ', method, args, response);
    }

    onNotified(method: string, args: any[]) {
        console.log('notified: ', method, args);
        if (method === 'redraw') {
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

// FIXME: Temporary
NeoVimSinglton.start([]);

export default NeoVimSinglton;
