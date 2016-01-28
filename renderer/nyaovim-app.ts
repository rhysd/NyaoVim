import {NeovimElement} from 'neovim-component';
import {remote, shell} from 'electron';
import {join} from 'path';
import {readdirSync} from 'fs';
import {Nvim, RPCValue} from 'promised-neovim-client';

const app = remote.require('app');

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
    'nyaovim:load-path': function(html_path: string) {
        component_loader.loadComponent(html_path);
    },
    'nyaovim:load-plugin-dir': function(dir_path: string) {
        component_loader.loadPluginDir(dir_path);
    },
    'nyaovim:edit-start': function(file_path: string) {
        ThisBrowserWindow.setRepresentedFilename(file_path);
        app.addRecentDocument(file_path);
    },
    'nyaovim:require-script-file': function(script_path: string) {
        require(script_path);
    },
    'nyaovim:call-global-function': function(func_name: string, args: RPCValue[]) {
        const func = (window as any)[func_name];
        if (func /*&& func is Function*/) {
            func.apply(window, args);
        }
    },
});

Polymer({
    is: 'nyaovim-app',

    properties: {
        argv: {
            type: Array,
            value: function() {
                // Note: First and second arguments are related to Electron
                const a = remote.process.argv.slice(2);
                a.push(
                    '--cmd', `let\ g:nyaovim_version="${app.getVersion()}"`,
                    '--cmd', `set\ rtp+=${join(__dirname, '..', 'runtime').replace(' ', '\ ')}`
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

            app.on('open-file', (e: Event, p: string) => {
                e.preventDefault();
                client.command('edit! ' + p);
            });
        });

        element.addEventListener('dragover', e => e.preventDefault());

        window.addEventListener('keydown', e => {
            if (e.keyCode === 0x1b && !editor.store.focused) {
                // Note: Global shortcut to make focus back to screen
                editor.focus();
            }
        });
    },

    // TODO: Remove all listeners on detached
});
