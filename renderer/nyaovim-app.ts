import {Neovim} from 'neovim-component';
import {remote, shell} from 'electron';

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

        window.addEventListener(
            'resize',
            () => editor.screen.resizeWithPixels(window.innerWidth, window.innerHeight) // XXX
        );
    },
});
