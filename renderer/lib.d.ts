/// <reference path="../typings/tsd.d.ts" />

declare module NodeJS {
    interface Global {
        require: NodeRequireFunction;
    }
}

interface String {
    endsWith(search: string, position?: number): boolean;
}

