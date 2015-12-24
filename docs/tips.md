Tips
====

## Check Running on NyaoVim in Vim script

Before loading `.config/nvim/init.vim`, `g:nyaovim_running` is set to `1`.  You can check it if the Vim script code is executed on NyaoVim or not (`init.vim` or plugin code).

```vim
if get(g:, 'nyaovim_running', 0)
    " Write NyaoVim specific code here
    " ...
endif
```

## Drag and Drop Files

If you drag and drop a file to NyaoVim, NyaoVim will start to edit the file with `:edit!`.

## 'Recent Files' on OS X

When you start NyaoVim, NyaoVim's application icon will appear in your OS X dock.  As other general OS X applications, 'Recent Files' item is available as dock menu.  (Please right click on an icon in dock.)
If you start to edit some file in NyaoVim (e.g. `:edit some-file`), NyaoVim registers it as 'recent file' and enable quick access with 'Recent Files' item in dock.

## 'Current File' in title bar on OS X

When a file icon is shown just left of title in title bar, you can select a file to edit via the icon.  Please try clicking the icon with command key (Cmd + LeftClick) then you will see the pull-down menu to select a directory.  After selecting directory, you can select a file in the directory to start editing.
