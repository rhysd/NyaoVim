import {Buffer, Window, Tabpage} from 'promised-neovim-client';
import {EventEmitter} from 'events';
import * as Action from './actions';

const ipc: ElectronRenderer.InProcess = global.require('ipc');

// Note:
// TypeScript doesn't allow recursive definition
export type RPCValue =
        Buffer |
        Window |
        Tabpage |
        number |
        boolean |
        string |
        any[] |
        {[key:string]: any};

export type RequestHandler = (method: string, args: RPCValue[], response: RPCValue) => void;
export type NotificationHandler = (method: string, args: RPCValue[]) => void;

export default class NeoVimHandler extends EventEmitter {
    constructor() {
        super();
        this.start();
        console.log('handler started!');
    }

    start() {
        ipc.removeAllListeners('neovim:request');
        ipc.removeAllListeners('neovim:notification');

        ipc.on('neovim:request', (method: string, args: RPCValue[], response: RPCValue) => {
            console.log('request: ', method, args, response);
            this.emit('request', method, args, response);
        });

        ipc.on('neovim:notification', (method: string, args: RPCValue[]) => {
            this.emit('notification');
            console.log('notification: ', method, args);
            const m: Function = (NeoVimHandler.prototype as any)[method];
            if (m) {
                m.apply(this, args);
            }
        });
    }

    redraw(args: RPCValue[]) {
        Action.redraw(args as RPCValue[][]);
    }
}

