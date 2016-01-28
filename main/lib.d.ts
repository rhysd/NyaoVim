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
