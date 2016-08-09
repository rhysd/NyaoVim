import {Menu, app} from 'electron';
import {join} from 'path';
import openAboutWindow from 'about-window';

function startAboutWindow() {
    'use strict';
    openAboutWindow({
        icon_path: join(__dirname, '..', 'resources', 'icon', 'nyaovim-logo.png'),
        copyright: 'Copyright (c) 2015 rhysd',
    });
}

export default function setMenu(win: Electron.BrowserWindow) {
    'use strict';
    const template = [
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    click: () => {
                        win.webContents.send('nyaovim:exec-commands', ['undo']);
                    },
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    click: () => {
                        win.webContents.send('nyaovim:exec-commands', ['redo']);
                    },
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    click: () => {
                        win.webContents.send('nyaovim:cut');
                    },
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    click: () => {
                        win.webContents.send('nyaovim:copy');
                    },
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    click: () => {
                        win.webContents.send('nyaovim:paste');
                    },
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    click: () => {
                        win.webContents.send('nyaovim:select-all');
                    },
                },
            ],
        },

        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: () => win.reload(),
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
                    click: () => win.setFullScreen(!win.isFullScreen()),
                },
                {
                    label: 'Open Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click: () => win.webContents.openDevTools({mode: 'detach'}),
                },
            ],
        },

        {
            label: 'Window',
            role: 'window',
            submenu: [
                {
                    label: 'Minimize',
                    accelerator: 'CmdOrCtrl+M',
                    role: 'minimize',
                },
                {
                    label: 'Close',
                    accelerator: 'CmdOrCtrl+W',
                    role: 'close',
                },
            ],
        },

        {
            label: 'Help',
            role: 'help',
            submenu: [
                {
                    label: 'About NyaoVim',
                    click: () => startAboutWindow(),
                },
            ],
        },
    ] as Electron.MenuItemOptions[];

    if (process.platform === 'darwin') {
        template.unshift({
            label: 'NyaoVim',
            submenu: [
                {
                    label: 'About NyaoVim',
                    click: () => startAboutWindow(),
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Services',
                    role: 'services',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Hide NyaoVim',
                    accelerator: 'Command+H',
                    role: 'hide',
                },
                {
                    label: 'Hide Others',
                    accelerator: 'Command+Shift+H',
                    role: 'hideothers',
                },
                {
                    label: 'Show All',
                    role: 'unhide',
                },
                {
                    type: 'separator',
                },
                {
                    label: 'Quit',
                    accelerator: 'Command+Q',
                    click: () => { app.quit(); },
                },
            ],
        } as Electron.MenuItemOptions);

        (template[3].submenu as Electron.MenuItemOptions[]).push(
            {
                type: 'separator',
            },
            {
                label: 'Bring All to Front',
                role: 'front',
            },
        );
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    return menu;
}
