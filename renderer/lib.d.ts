/// <reference path="../typings/browser.d.ts" />

declare module NodeJS {
    interface Global {
        require: NodeRequireFunction;
    }
}

interface String {
    endsWith(search: string, position?: number): boolean;
}

