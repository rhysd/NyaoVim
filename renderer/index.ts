import {Neovim} from 'neovim-component';
const {remote, shell} = global.require('electron');

const editor = (document.getElementById('nyaovim') as any).editor as Neovim;

editor.on('process-attached', () => {
    if (remote.process.argv.length > 2) {
        editor.setArgv(remote.process.argv.slice(2)); // It is better to use 'argv' property.
    }
});
editor.on('quit', () => remote.require('app').quit());

editor.store.on('beep', () => shell.beep());
editor.store.on('title-changed', () => {
    document.title = editor.store.title;
});
editor.store.on('icon-changed', () => {
    const icon = editor.store.icon_path;
    if (icon === '') {
        return;
    }
    if (process.platform === 'darwin') {
        remote.getCurrentWindow().setRepresentedFilename(icon);
    }
});

window.addEventListener(
    'resize',
    () => editor.screen.resizeWithPixels(window.innerWidth, window.innerHeight)
);
