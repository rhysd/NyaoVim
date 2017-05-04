declare namespace NodeJS {
    interface Global {
        config_dir_path: string;
        nyaovimrc_path: string;
    }
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
}

