if (process.env.PATH.indexOf('/usr/local/bin') === -1 && process.platform !== 'win32') {
    // Note:
    // This solves the problem that $PATH is not set up when app is
    // started via clicking NyaoVim.app.
    //
    // XXX:
    // This is just a workaround.
    // If nvim is installed to other directory, we can't know that.
    process.env.PATH += ':/usr/local/bin';
}

// Note:
// import {remote} from 'electron'; causes an error because both main.js and nyaovim-app.js are
// loaded with <script> tag in main.html. Both script imports 'electron' package. import statement
// is compiled into const electron_1 = require('electron') and the 'electron_1' variable duplicates.
// It results in a duplicate variable error.

/* tslint:disable:no-var-requires */
const nyaovimrc_path: string = require('electron').remote.getGlobal('nyaovimrc_path');
/* tslint:enable:no-var-requires */

if (!nyaovimrc_path) {
    console.error('nyaovimrc is not found in renderer process');
}

const link = document.createElement('link') as HTMLLinkElement;
link.rel = 'import';
link.href = nyaovimrc_path;
document.head.appendChild(link);

