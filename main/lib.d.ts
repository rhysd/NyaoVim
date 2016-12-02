/// <reference path="../typings/index.d.ts" />

declare namespace NodeJS {
    interface Global {
        config_dir_path: string;
        nyaovimrc_path: string;
    }
}

interface NodeModule {
    paths: string[];
}

