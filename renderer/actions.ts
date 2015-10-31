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

let font_height: number;
let font_width: number;
function calcScreenSize() {
    const ratio = window.devicePixelRatio || 1;
    if (!font_height && !font_width) {
        const n = document.querySelector('.font-test');
        font_height = n.clientHeight / ratio;
        font_width = n.clientWidth / ratio;
        n.parentNode.removeChild(n);
    }
    return {
        height: Math.floor((document.body.clientHeight - 30) / font_height),
        width: Math.floor(document.body.clientWidth / font_width),
    };
}

export function createNeovim(argv: string[] = [], cmd = 'nvim', size = calcScreenSize()) {
    return {
        type: Kind.CreateNeovim,
        lines: size.height,
        columns: size.width,
        cmd,
        argv,
    };
}

// TODO
// export function resizeWindow(width, height)

// Union of all action types
export type Type = RedrawActionType | CreateNeovimActionType;
