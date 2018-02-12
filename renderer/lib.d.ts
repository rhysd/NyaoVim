/// <reference path="../bower_components/polymer/types/polymer-element.d.ts" />

declare namespace NodeJS {
    interface Global {
        require: NodeRequireFunction;
    }
}

interface String {
    endsWith(search: string, position?: number): boolean;
}
