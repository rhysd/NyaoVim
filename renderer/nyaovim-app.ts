import {Neovim} from 'neovim-component';
import {remote, shell} from 'electron';

Polymer({
    is: 'nyaovim-app',

    properties: {
        argv: {
            type: Array,
            value: () => remote.process.argv.slice(2),
        },
    },

    ready: function() {
        const editor = (document.getElementById('nyaovim-editor') as any).editor as Neovim;
        const plugin_manager = document.getElementById('nyaovim-plugin-manager') as any;
        plugin_manager.editor = editor;
        editor.on('quit', () => remote.require('app').quit());

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
