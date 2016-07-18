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

export default function setMenu() {
    'use strict';
    const template = [
        {
            label: 'Edit',
            submenu: [
                {
                    label: 'Undo',
                    accelerator: 'CmdOrCtrl+Z',
                    role: 'undo',
                },
                {
                    label: 'Redo',
                    accelerator: 'Shift+CmdOrCtrl+Z',
                    role: 'redo',
                },
                {
                    type: 'separator'
                },
                {
                    label: 'Cut',
                    accelerator: 'CmdOrCtrl+X',
                    role: 'cut',
                },
                {
                    label: 'Copy',
                    accelerator: 'CmdOrCtrl+C',
                    role: 'copy',
                },
                {
                    label: 'Paste',
                    accelerator: 'CmdOrCtrl+V',
                    role: 'paste',
                },
                {
                    label: 'Select All',
                    accelerator: 'CmdOrCtrl+A',
                    role: 'selectall',
                },
            ],
        },

        {
            label: 'View',
            submenu: [
                {
                    label: 'Reload',
                    accelerator: 'CmdOrCtrl+R',
                    click: (_: any, focusedWindow: Electron.BrowserWindow) => {
                        focusedWindow && focusedWindow.reload();
                    },
                },
                {
                    label: 'Toggle Full Screen',
                    accelerator: process.platform === 'darwin' ? 'Ctrl+Command+F' : 'F11',
                    click: (_: any, focusedWindow: Electron.BrowserWindow) => {
                        focusedWindow && focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
                    },
                },
                {
                    label: 'Open Developer Tools',
                    accelerator: process.platform === 'darwin' ? 'Alt+Command+I' : 'Ctrl+Shift+I',
                    click: (_: any, focusedWindow: Electron.BrowserWindow) => {
                        focusedWindow && focusedWindow.webContents.openDevTools({mode: 'detach'});
                    },
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
                    type: 'separator'
                },
                {
                    label: 'Services',
                    role: 'services',
                },
                {
                    type: 'separator'
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
                    type: 'separator'
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
                type: 'separator'
            },
            {
                label: 'Bring All to Front',
                role: 'front',
            }
        );
    }

    const menu = Menu.buildFromTemplate(template);
    Menu.setApplicationMenu(menu);
    return menu;
}
