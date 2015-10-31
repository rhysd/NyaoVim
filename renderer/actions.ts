import {RPCValue} from './neovim';

export enum Kind {
    Redraw,
    CreateNeovim,
};

export interface RedrawActionType {
    type: Kind;
    events: RPCValue[][];
}

export function redraw(events: RPCValue[][]) {
    return {
        type: Kind.Redraw,
        events
    };
}

export interface CreateNeovimActionType {
    type: Kind;
    lines: number;
    columns: number;
    cmd: string;
    argv: string[];
}

export function createNeovim(lines: number, columns: number, argv: string[], cmd = 'nvim') {
    return {
        type: Kind.CreateNeovim,
        lines,
        columns,
        cmd,
        argv,
    };
}

// TODO
// export function resizeWindow(width, height)

// Union of all action types
export type Type = RedrawActionType | CreateNeovimActionType;
