// Union of all action types

export enum Kind {
    Redraw
};

export interface RedrawActionType {
    type: Kind;
    events: any[][];
}

export function redraw(events: any[][]) {
    return {
        type: Kind.Redraw,
        events
    };
}

export type Type = RedrawActionType;
