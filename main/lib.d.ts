/// <reference path="../typings/main.d.ts" />

declare module NodeJS {
    interface Global {
        config_dir_path: string;
        nyaovimrc_path: string;
    }
}

interface NodeModule {
    paths: string[];
}

declare module 'deep-extend' {
    function deepExtend<T, U>(target: T, source: U): T & U;
    function deepExtend<T, U, V>(target: T, source1: U, source2: V): T & U & V;
    function deepExtend<T, U, V, W>(target: T, source1: U, source2: V, source3: W): T & U & V & W;
    function deepExtend(target: any, ...sources: any[]): any;
    export = deepExtend;
}

declare namespace ElectronWindowState {
    interface WindowState {
        x: number;
        y: number;
        width: number;
        height: number;
        isMaximized: boolean;
        isFullScreen: boolean;
        manage(win: Electron.BrowserWindow): void;
        saveState(win: Electron.BrowserWindow): void;
    }
    interface WindowStateKeeperOptions {
        defaultWidth?: number;
        defaultHeight?: number;
        path?: string;
        file?: string;
        maximize?: boolean;
        fullScreen?: boolean;
    }
}

declare module 'electron-window-state' {
    function windowStateKeeper(opts: ElectronWindowState.WindowStateKeeperOptions): ElectronWindowState.WindowState;
    export = windowStateKeeper;
}
