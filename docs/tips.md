Tips
====

## Installation on Windows

At first, you should install Visual C++ 2015 runtime from [official](https://www.microsoft.com/en-us/download).  Neovim requires it to run.
Following [Neovim official instruction](https://github.com/neovim/neovim/wiki/Installing-Neovim#windows), download Neovim.zip from AppVeyor build results, unzip it, and set `bin` directory to `$PATH`.  After installation, please be sure that `nvim` command works correctly from PowerShell or CMD.exe.
Now you can install NyaoVim with [npm](https://www.npmjs.com/).  Please read 'Getting Started' subsection in [README](../README.md).  Currently zip-archived app is not released yet because NyaoVim is being developed yet.

## Check Running on NyaoVim in Vim script

Before loading `.config/nvim/init.vim`, `g:nyaovim_version` is set to version string.  You can check if the Vim script code is executed on NyaoVim or not (`init.vim` or plugin code).

```vim
if exists('g:nyaovim_version')
    " Write NyaoVim specific code here
    " ...
endif
```

`g:nyaovim_version` is a string which represents the version of NyaoVim.  You can also use it to check the version of NyaoVim.

## Single Instance Application

NyaoVim can become 'Single Instance Application'.
Only one NyaoVim instance can exist in desktop.  If `nyaovim` command is secondly executed, it focuses on NyaoVim window which already exists, opens files specified with arguments in it, and simply quits.

```sh
$ nyaovim foo.c bar.c # Open NyaoVim firstly with foo.c and bar.c
$ cd ~/blah
$ nyaovim aaa.js bbb.js # Focus window which already exists, open aaa.js and bbb.js in it
```

You can make NyaoVim 'Single Instance Application' with `browser-config.json`.  Please read [the document](browser-config.md)


## Drag and Drop Files

If you drag and drop a file to NyaoVim, NyaoVim will start to edit the file with `:edit!`.

## 'Recent Files' on OS X

When you start NyaoVim, NyaoVim's application icon will appear in your OS X dock.  As other general OS X applications, 'Recent Files' item is available as dock menu.  (Please right click on an icon in dock.)
If you start to edit some file in NyaoVim (e.g. `:edit some-file`), NyaoVim registers it as 'recent file' and enable quick access with 'Recent Files' item in dock.

## 'Current File' in title bar on OS X

When a file icon is shown just left of title in title bar, you can select a file to edit via the icon.  Please try clicking the icon with command key (Cmd + LeftClick) then you will see the pull-down menu to select a directory.  After selecting directory, you can select a file in the directory to start editing.

## Don't detach the process

NyaoVim's process is detached by default when launched from command line.  If you don't want to detach the editor process, please consider to use `--no-detach` option of `nyaovim` command.  If you always want to use it.  `alias nyaovim='nyaovim --no-detach'` in bashrc or zshrc may help you.

## Load JavaScript

If you want to load some JavaScript code, you can use `<script>` tag in `nyaovimrc.html`.  Put your favorite-named JavaScript code in `nyaovim` configuration directory at first.  Then load it as below.

```html
<dom-module id="nyaovim-app">
    <!-- snip -->
</dom-module>
<script src="your-config.js"></script>
```

It ensures that the script is loaded after `<dom-module>` is loaded.

