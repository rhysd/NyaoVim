import * as Immutable from 'immutable';
import assign = require('object-assign');
import * as Action from './actions';

// TODO:
// Split NeoVim state from others by splitting reducer

export interface StateType {
    lines: Immutable.List<string>;
    fg_color: string;
    bg_color: string;
    size: {
        lines: number;
        columns: number;
    }
    cursor: {
        line: number;
        col: number;
    }
}

const init: StateType = {
    lines: Immutable.List<string>(),
    fg_color: 'white',
    bg_color: 'black',
    size: {
        lines: 0,
        columns: 0,
    },
    cursor: {
        line: 0,
        col: 0,
    },
};

function colorOf(new_color: number, fallback: string) {
    if (!new_color || new_color === -1) {
        return fallback;
    }
    return '#' + new_color.toString(16);
}

function handlePut(lines: Immutable.List<string>, cursor_line: number, cursor_col: number, event: string[][]) {
    event.shift();
    const modified = lines.get(cursor_line);
    let next_line = modified.substring(cursor_col);
    for (const c in event) {
        if (c.length !== 1) {
            console.log('Invalid character: ', c);
        }
        next_line += c[0];
    }
    return lines.set(cursor_line, modified);
}

function redraw(state: StateType, events: any[][]) {
    const next_state: StateType = assign({}, state);
    for (const e of events) {
        const name = e[0];
        const args = e[1];
        switch(name) {
            case 'put':
                // Use next_state.cursor.{line,col} because previous 'cursor_goto' event changed next_state's cursor position.
                next_state.lines = handlePut(state.lines, next_state.cursor.line, next_state.cursor.col, e);
                break;
            case 'cursor_goto':
                next_state.cursor = {line: args[0], col: args[1]};
                break;
            case 'highlight_set':
                console.log('highlight_set is ignored', args);
                break;
            case 'clear':
                next_state.lines = Immutable.List<string>(); // XXX: Is this correct?
                next_state.cursor = {line: 0, col: 0};
                break;
            case 'resize':
                next_state.size = {columns: args[0], lines: args[1]};
                // TODO: When cursor is out of field
                break;
            case 'update_fg':
                next_state.fg_color = colorOf(args[0], state.fg_color);
                break;
            case 'update_bg':
                next_state.bg_color = colorOf(args[0], state.bg_color);
                break;
            default:
                console.log('Unhandled event: ' + name, args);
                break;
        }
    }
    return state;
}

export default function nyaovim(state: StateType = init, action: Action.Type) {
    console.log(action.type);
    switch(action.type) {
        case Action.Kind.Redraw:
            return redraw(state, action.events);
        default:
            console.log('Unknown action: ' + action.type);
            return state;
    }
}
