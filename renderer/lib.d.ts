/// <reference path="../typings/tsd.d.ts" />
/// <reference path="../node_modules/immutable/dist/immutable.d.ts" />

declare module NodeJS {
    interface Global {
        require(m: string): any;
    }
}

declare module ElectronRenderer {
    export class InProcess implements NodeJS.EventEmitter {
        addListener(event: string, listener: Function): InProcess;
        on(event: string, listener: Function): InProcess;
        once(event: string, listener: Function): InProcess;
        removeListener(event: string, listener: Function): InProcess;
        removeAllListeners(event?: string): InProcess;
        setMaxListeners(n: number): void;
        listeners(event: string): Function[];
        emit(event: string, ...args: any[]): boolean;
        /**
         * Send ...args to the renderer via channel in asynchronous message, the main
         * process can handle it by listening to the channel event of ipc module.
         */
        send(channel: string, ...args: any[]): void;
        /**
         * Send ...args to the renderer via channel in synchronous message, and returns
         * the result sent from main process. The main process can handle it by listening
         * to the channel event of ipc module, and returns by setting event.returnValue.
         * Note: Usually developers should never use this API, since sending synchronous
         * message would block the whole renderer process.
         * @returns The result sent from the main process.
         */
        sendSync(channel: string, ...args: any[]): string;
        /**
         * Like ipc.send but the message will be sent to the host page instead of the main process.
         * This is mainly used by the page in <webview> to communicate with host page.
         */
        sendToHost(channel: string, ...args: any[]): void;
    }

    interface Remote {
        /**
         * @returns The object returned by require(module) in the main process.
         */
        require(module: string): any;
        /**
         * @returns The BrowserWindow object which this web page belongs to.
         */
        getCurrentWindow(): GitHubElectron.BrowserWindow
        /**
         * @returns The global variable of name (e.g. global[name]) in the main process.
         */
        getGlobal(name: string): any;
        /**
         * Returns the process object in the main process. This is the same as
         * remote.getGlobal('process'), but gets cached.
         */
        process: any;
    }
}

// Temporary fix for ES6
declare interface String {
    repeat(times: number): String;
}

