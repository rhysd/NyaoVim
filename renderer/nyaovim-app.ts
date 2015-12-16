import {Neovim} from 'neovim-component';
import {remote, shell} from 'electron';

Polymer({
    is: 'nyaovim-app',

    properties: {
        argv: {
            type: Array,
            value: () => remote.process.argv.slice(2)
        }
    },

    ready: function() {
        var editor = (document.getElementById('internal-editor') as any).editor as Neovim;
        editor.on('quit', () => remote.require('app').quit());

        editor.store.on('beep', () => shell.beep());
        editor.store.on('title-changed', () => {
            document.title = editor.store.title;
        });

        window.addEventListener(
            'resize',
            () => editor.screen.resizeWithPixels(window.innerWidth, window.innerHeight)
        );
    }
});
