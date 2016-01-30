import {remote} from 'electron';

if (process.env.PATH.indexOf('/usr/local/bin') === -1) {
    // Note:
    // When app is started via clicking NyaoVim.app, $PATH is not set up.
    // XXX:
    // This is just a workaround.
    // If nvim is installed to other directory, we can't know that.
    process.env.PATH += ':/usr/local/bin';
}

const nyaovimrc_path: string = remote.getGlobal('nyaovimrc_path');
if (!nyaovimrc_path) {
    console.error('nyaovimrc is not found in renderer process');
}

const link = document.createElement('link') as HTMLLinkElement;
link.rel = 'import';
link.href = nyaovimrc_path;
document.head.appendChild(link);

