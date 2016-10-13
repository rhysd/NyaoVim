import {NeovimElement} from 'neovim-component';
import {remote, shell, ipcRenderer as ipc} from 'electron';
import {join, basename} from 'path';
import {readdirSync} from 'fs';
import {Nvim, RPCValue} from 'promised-neovim-client';

class ComponentLoader {
    initially_loaded: boolean;
    component_paths: string[];
    nyaovim_plugin_paths: string[];

    constructor() {
        this.initially_loaded = false;
        this.component_paths = [];
    }

    loadComponent(path: string) {
        const link = document.createElement('link') as HTMLLinkElement;
        link.rel = 'import';
        link.href = path;
        document.head.appendChild(link);
        this.component_paths.push(path);
    }

    loadPluginDir(dir: string) {
        const nyaovim_plugin_dir = join(dir, 'nyaovim-plugin');
        try {
            for (const entry of readdirSync(nyaovim_plugin_dir)) {
                if (entry.endsWith('.html')) {
                    this.loadComponent(join(nyaovim_plugin_dir, entry));
                }
            }
            this.nyaovim_plugin_paths.push(dir);
        } catch (err) {
            // 'nyaovim-plugin' doesn't exist
        }
    }

    loadFromRTP(runtimepaths: string[]) {
        for (const rtp of runtimepaths) {
            this.loadPluginDir(rtp);
        }
    }
}

class RuntimeApi {
    private client: Nvim;

    constructor(private definitions: {[name: string]: Function}) {
        this.client = null;
    }

    subscribe(client: Nvim) {
        client.on('notification', this.call.bind(this));
        for (const name in this.definitions) {
            client.subscribe(name);
        }
        this.client = client;
    }

    unsubscribe() {
        if (this.client) {
            for (const name in this.definitions) {
                this.client.unsubscribe(name);
            }
        }
    }

    call(func_name: string, args: RPCValue[]) {
        const func = this.definitions[func_name];
        if (!func) {
            return null;
        }
        console.log('call(): ', func_name, args);
        return func.apply(func, args);
    }
}

const component_loader = new ComponentLoader();
const ThisBrowserWindow = remote.getCurrentWindow();
const runtime_api = new RuntimeApi({
    'nyaovim:load-path': (html_path: string) => {
        component_loader.loadComponent(html_path);
    },
    'nyaovim:load-plugin-dir': (dir_path: string) => {
        component_loader.loadPluginDir(dir_path);
    },
    'nyaovim:edit-start': (file_path: string) => {
        ThisBrowserWindow.setRepresentedFilename(file_path);
        remote.app.addRecentDocument(file_path);
    },
    'nyaovim:require-script-file': (script_path: string) => {
        require(script_path);
    },
    'nyaovim:call-global-function': (func_name: string, args: RPCValue[]) => {
        const func = (window as any)[func_name];
        if (func /*&& func is Function*/) {
            func.apply(window, args);
        }
    },
    'nyaovim:open-devtools': (mode: 'right' | 'bottom' | 'undocked' | 'detach') => {
        const contents = remote.getCurrentWebContents();
        contents.openDevTools({mode});
    },
    'nyaovim:execute-javascript': (code: string) => {
        if (typeof code !== 'string') {
            console.error('nyaovim:execute-javascript: Not a string', code);
            return;
        }
        try {
            /* tslint:disable */
            eval(code);
            /* tslint:enable */
        } catch (e) {
            console.error('While executing javascript:', e);
        }
    },
});

function prepareIpc(client: Nvim) {
    'use strict';

    ipc.on('nyaovim:exec-commands', (_: Electron.IpcRendererEvent, cmds: string[]) => {
        console.log('ipc: nyaovim:exec-commands', cmds);
        for (const c of cmds) {
            client.command(c);
        }
    });

    ipc.on('nyaovim:copy', () => {
        // get current vim mode
        client.eval('mode()').then((value: string) => {
            if (value.length === 0) {
                return;
            }
            const ch = value[0];
            const code = value.charCodeAt(0);
            if (ch === 'v'       // visual mode
                || ch === 'V'    // visual line mode
                || code === 22   // visual block mode. 22 is returned by ':echo char2nr("\<C-v>")'
                ) {
                client.input('"+y');
            }
        });
    });

    ipc.on('nyaovim:select-all', () => {
        // get current vim mode.
        client.eval('mode()').then((value: string) => {
            if (value.length === 0) {
                return;
            }

            const command = value[0] === 'n' ? 'ggVG' : '<Esc>ggVG';
            client.input(command);
        });
    });

    ipc.on('nyaovim:cut', () => {
        // get current vim mode
        client.eval('mode()').then((value: string) => {
            if (value.length === 0) {
                return;
            }

            const ch = value[0];
            const num = value.charCodeAt(0);
            if (ch === 'v'  // visual mode
                || ch === 'V' // visual line mode
                || num === 22 // visual block mode
                ) {
                client.input('"+x');
            }
        });
    });

    ipc.on('nyaovim:paste', () => {
        // get current vim mode
        client.eval('mode()').then((value: string) => {
            if (value.length === 0) {
                return;
            }

            let command: string;

            const ch = value[0];
            const code = value.charCodeAt(0);
            if (ch === 'v') {
                // visual mode
                // deleting the highlighted area
                // to prevent vim from copying the area to the pasteboard
                command = '"_d"+P';
            } else if (ch === 'V') {
                // visual line mode
                command = '"_d"+p';
            } else if (code === 22 || ch === 'n') {
                // visual block mode
                // the "_d trick doesn't work here
                // because the visual selection will disappear after "_d command
                // or normal mode
                command = '"+p';
            } else if (ch === 'i') {
                // insert mode
                // gp will move cursor to the last of pasted content
                command = '<C-o>"+gp';
            } else if (ch === 'c') {
                    // command line mode
                command = '<C-r>+';
            }

            if (command) {
                client.input(command);
            }
        });
    });
}

Polymer({
    is: 'nyaovim-app',

    properties: {
        argv: {
            type: Array,
            value: function() {
                let electron_argc =  1; // the first argument of standalone distribution is the application path
                if (remote.process.argv.length > 1
                    && 'electron' === basename(remote.process.argv[0]).toLowerCase()) {
                    // Note: First and second arguments are related to Electron
                    // the second argument of Electron is the script name (main.js)
                    electron_argc = 2;
                }

                // Note:
                // First and second arguments are related to Electron
                // XXX:
                // Spectron additionally passes many specific arguments to process and 'nvim' process
                // will fail because of them.  As a workaround, we stupidly ignore arguments on E2E tests.
                const a = process.env.NYAOVIM_E2E_TEST_RUNNING ? [] : remote.process.argv.slice(electron_argc);
                a.push(
                    '--cmd', `let\ g:nyaovim_version="${remote.app.getVersion()}"`,
                    '--cmd', `set\ rtp+=${join(__dirname, '..', 'runtime').replace(' ', '\ ')}`,
                );
                // XXX:
                // Swap files are disabled because it shows message window on start up but frontend can't detect it.
                a.push('-n');
                return a;
            },
        },
        editor: Object,
    },

    ready: function() {
        const element = document.getElementById('nyaovim-editor') as NeovimElement;
        const editor = element.editor;
        editor.on('error', (err: Error) => alert(err.message));
        editor.on('quit', () => ThisBrowserWindow.close());
        this.editor = editor;

        editor.store.on('beep', () => shell.beep());
        editor.store.on('title-changed', () => {
            document.title = editor.store.title;
        });

        editor.on('process-attached', () => {
            const client = editor.getClient();

            client.listRuntimePaths()
                  .then((rtp: string[]) => {
                      component_loader.loadFromRTP(rtp);
                      component_loader.initially_loaded = true;
                  });

            runtime_api.subscribe(client);

            element.addEventListener('drop', e => {
                e.preventDefault();
                const f = e.dataTransfer.files[0];
                if (f) {
                    client.command('edit! ' + f.path);
                }
            });

            remote.app.on('open-file', (e: Event, p: string) => {
                e.preventDefault();
                client.command('edit! ' + p);
            });

            prepareIpc(client);
        });

        element.addEventListener('dragover', e => e.preventDefault());

        window.addEventListener('keydown', e => {
            if (e.keyCode === 0x1b && !editor.store.focused) {
                // Note: Global shortcut to make focus back to screen
                editor.focus();
            }
        });
    },

    // TODO: Remove all listeners when detached
});
