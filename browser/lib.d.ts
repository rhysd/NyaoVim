/// <reference path="../typings/tsd.d.ts" />
import NeoVim from './neovim';

declare module NodeJS {
    interface Global {
        neovim: NeoVim;
    }
}

