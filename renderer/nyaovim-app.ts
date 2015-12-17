import {Neovim} from 'neovim-component';
import {remote, shell} from 'electron';
import {join} from 'path';
import {readdirSync} from 'fs';

class ComponentLoader {
    initially_loaded: boolean;
    component_paths: string[];

    constructor() {
        this.initially_loaded = false;
        this.component_paths = [];
    }

    load(path: string) {
        const link = document.createElement('link') as HTMLLinkElement;
        link.rel = 'import';
        link.href = path;
        document.head.appendChild(link);
    }

    loadFromRTP(rtp_string: string) {
        const runtimepaths = rtp_string.split(',');
        for (const rtp of runtimepaths) {
            const nyaovim_dir = join(rtp, 'nyaovim-plugin');
            try {
                for (const entry of readdirSync(nyaovim_dir)) {
                    if (entry.endsWith('.html')) {
                        this.load(entry);
                        this.component_paths.push(entry);
                    }
                }
            } catch(err) {
                // 'nyaovim-plugin' doesn't exist
            }
        }
    }
}

const component_loader = new ComponentLoader();

Polymer({
    is: 'nyaovim-app',

    properties: {
        argv: {
            type: Array,
            value: function() {
                // Note: First and second arguments are related to Electron
                const a = remote.process.argv.slice(2);
                a.push('-c', 'let\ g:nyaovim_running=1');
                return a;
            },
        },
        editor: Object,
    },

    ready: function() {
        const editor = (document.getElementById('nyaovim-editor') as any).editor as Neovim;
        editor.on('quit', () => remote.require('app').quit());
        this.editor = editor;

        editor.store.on('beep', () => shell.beep());
        editor.store.on('title-changed', () => {
            document.title = editor.store.title;
        });

        editor.on('process-attached', () => {
            editor.getClient()
                  .eval('&runtimepath')
                  .then((rtp: string) => {
                      component_loader.loadFromRTP(rtp);
                      component_loader.initially_loaded = true;
                  });
        });

        window.addEventListener(
            'resize',
            () => editor.screen.resizeWithPixels(window.innerWidth, window.innerHeight) // XXX
        );
    },
});
