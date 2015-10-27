import {RPCValue} from './neovim';

export enum Kind {
    Redraw
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

// TODO
// export function resizeWindow(width, height)

// Union of all action types
export type Type = RedrawActionType;
