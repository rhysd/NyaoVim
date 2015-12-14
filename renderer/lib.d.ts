/// <reference path="../typings/tsd.d.ts" />

declare module NodeJS {
    interface Global {
        require: NodeRequireFunction;
    }
}
