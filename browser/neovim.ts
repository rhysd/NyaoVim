import * as NvimClient from 'promised-neovim-client';
import {spawn, ChildProcess} from 'child_process';

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

export default class NeoVim {
    neovim_process: ChildProcess;
    client: NvimClient.Nvim;
    started: boolean;
    constructor(public window: GitHubElectron.BrowserWindow, argv: string[], cmd = 'nvim') {
        this.started = false;
        this.start(argv, cmd);
    }

    start(argv: string[], cmd = 'nvim') {
        this.started = false;
        argv.push('--embed');
        this.neovim_process = spawn(cmd, argv, {});
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
            }).catch(err => console.log(err));
    }

    onRequested(method: string, args: RPCValue[], response: RPCValue) {
        this.window.webContents.send('neovim:request', method, args, response);
    }

    onNotified(method: string, args: RPCValue[]) {
        console.log('[browser] Notification!', method);
        this.window.webContents.send('neovim:notification', method, args);
    }

    onDisconnected() {
        console.log('disconnected: ' + this.neovim_process.pid);
        this.started = false;
    }
}

