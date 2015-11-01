import * as Immutable from 'immutable';
import assign = require('object-assign');
import * as Action from './actions';
import NeoVim, {RPCValue} from './neovim';

// TODO:
// Split NeoVim state from others by splitting reducer

interface SizeState {
    lines: number;
    columns: number;
}

interface CursorState {
    line: number;
    col: number;
}

export interface NeovimState {
    id: number;
    lines: Immutable.List<string>;
    fg_color: string;
    bg_color: string;
    size: SizeState;
    cursor: CursorState;
    mode: string;
    busy: boolean;
    [k: string]: any;
    instance: NeoVim;
}

export interface StateType {
    current_id: number;
    ids: number[];
    neovims: {
        [id: number]: NeovimState;
    }
}

const gen_id = function() {
    let id = 0;
    return function() {
        return ++id;
    }
}();

const init: StateType = {
    current_id: 0,
    ids: [],
    neovims: {},
};

function colorOf(new_color: number, fallback: string) {
    if (!new_color || new_color === -1) {
        return fallback;
    }
    return '#' + new_color.toString(16);
}

function handlePut(lines: Immutable.List<string>, cursor_line: number, cursor_col: number, chars: string[][]) {
    const prev_line = lines.get(cursor_line) || '';
    let next_line = prev_line.substring(0, cursor_col);
    if (next_line.length < cursor_col) {
        next_line += ' '.repeat(cursor_col - next_line.length);
    }
    for (const c of chars) {
        if (c.length !== 1) {
            console.log('Invalid character: ', c);
        }
        next_line += c[0];
    }
    if (cursor_col + chars.length < prev_line.length) {
        next_line += prev_line.substring(cursor_col + chars.length);
    }
    return lines.set(cursor_line, next_line);
}

function redraw(state: StateType, events: RPCValue[][]) {
    const next_state: StateType = assign({}, state);
    const nv = next_state.neovims[next_state.current_id];
    let neovim_changed = false;

    for (const e of events) {
        const name = e[0] as string;
        const args = e[1] as RPCValue[];
        switch(name) {
            case 'put':
                e.shift();
                if (e.length === 0) {
                    continue;
                }
                // Use nv.cursor.{line,col} because previous 'cursor_goto' event changed next_state's cursor position.
                nv.lines = handlePut(
                        nv.lines,
                        nv.cursor.line,
                        nv.cursor.col,
                        e as string[][]
                    );
                // TODO:
                // Make immutable CursorPos class
                nv.cursor = {
                    line: nv.cursor.line,
                    col: nv.cursor.col + e.length,
                };
                break;
            case 'cursor_goto':
                nv.cursor = {
                    line: args[0] as number,
                    col: args[1] as number,
                } as CursorState;
                break;
            case 'highlight_set':
                console.log('highlight_set is ignored', JSON.stringify(args, null, 2));
                continue;
            case 'clear':
                nv.lines = Immutable.List<string>(); // XXX: Is this correct?
                nv.cursor = {line: 0, col: 0};
                break;
            case 'eol_clear':
                nv.lines
                    = nv.lines.set(
                        nv.cursor.line,
                        nv.lines.get(
                            nv.cursor.line
                        ).substring(0, nv.cursor.col)
                    );
                break;
            case 'resize':
                nv.size = {
                    columns: args[0],
                    lines: args[1],
                } as SizeState;
                // TODO: When cursor is out of field
                break;
            case 'update_fg':
                nv.fg_color = colorOf(args[0] as number, nv.fg_color);
                break;
            case 'update_bg':
                nv.bg_color = colorOf(args[0] as number, nv.bg_color);
                break;
            case 'mode_change':
                nv.mode = args[0] as string;
                break;
            case 'busy_start':
                nv.busy = true;
                break;
            case 'busy_stop':
                nv.busy = false;
                break;
            default:
                console.log('Unhandled event: ' + name, args);
                continue;
        }

        // Note:
        // Reach here only when current NeoVim state is changed
        neovim_changed = true;
    }

    if (neovim_changed) {
        next_state.neovims[next_state.current_id] = assign({}, nv);
    }

    return next_state;
}

function create(state: StateType, a: Action.CreateNeovimActionType) {
    const nv = {
        id: gen_id(),
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
        mode: "normal", // XXX: Vim not always starts with normal mode
        busy: false,
        instance: new NeoVim(a.lines, a.columns, a.argv, a.cmd),
    };

    return {
        current_id: nv.id,
        ids: state.ids.concat([nv.id]),
        neovims: assign(state.neovims, {[nv.id]: nv}),
    } as StateType;
}

function activate(state: StateType, index: number) {
    return assign({}, state, {current_id: state.ids[index]});
}

function destroy(state: StateType, index: number) {
    const next_state = assign({}, state);
    const destroyed_id = state.ids[index];
    const destroyed_neovim = next_state.neovims[destroyed_id];
    destroyed_neovim.instance.finalize();
    delete next_state.neovims[destroyed_id];
    next_state.ids.splice(index, 1);
    if (destroyed_id === state.current_id) {
        if (next_state.length === 0) {
            next_state.current_id = 0;
        } else {
            if (index > next_state.ids.length - 1) {
                next_state.current_id = next_state.ids[next_state.ids.length - 1];
            } else {
                next_state.current_id = state.current_id;
            }
        }
    }
    return next_state;
}

export default function nyaovim(state: StateType = init, action: Action.Type): StateType {
    // XXX
    if (state.current_id === undefined) {
        console.log('Bug: current_id is undefined');
        state.current_id = state.ids[state.ids.length - 1] || 0;
    }

    switch(action.type) {
        case Action.Kind.Redraw:
            return redraw(state, (action as Action.RedrawActionType).events);
        case Action.Kind.ActivateNeovim:
            return activate(state, (action as Action.ActivateNeovimActionType).index);
        case Action.Kind.CreateNeovim:
            return create(state, (action as Action.CreateNeovimActionType));
        case Action.Kind.DestroyNeovim:
            return destroy(state, (action as Action.DestroyNeovimActionType).index);
        default:
            console.log('Unknown action: ' + action.type);
            return state;
    }
}
