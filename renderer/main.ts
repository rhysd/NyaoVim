import {remote} from 'electron';
const nyaovimrc_path: string = remote.getGlobal('nyaovimrc_path');
if (!nyaovimrc_path) {
    console.error('nyaovimrc is not found in renderer process');
}

const link = document.createElement('link') as HTMLLinkElement;
link.rel = 'import';
link.href = nyaovimrc_path;
document.head.appendChild(link);

// TODO: Import all component html files here
