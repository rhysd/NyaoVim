FAQ
===

## Trouble

### Q. I can't input to NyaoVim (OS X)

Are you using tmux and started NyaoVim in tmux?  In the case, you need to use [reattach-to-user-namespace](https://github.com/ChrisJohnsen/tmux-MacOSX-pasteboard) utility.


### Q. White screen is shown at start up

After NyaoVim shows white screen, could you please input enter key.  I think NyaoVim will restore screen.  Then please check `:message`.  I think some errors are reported.
This problem occurs because Neovim frontend can't handle error output before showing UI.  Neovim 0.2 will resolve this.

### Q. Swap file doesn't work

NyaoVim disables swapfile because Neovim frontend can't handle swap file message on start up.  The reason is the same as above question, so Neovim 0.2 will resolve this.

### Q. Error alert is shown at starting NyaoVim

Please ensure that `nvim` command exists in `$PATH` environment variable.  If you started NyaoVim via non-npm package (e.g. NyaoVim.app), `$PATH` is not set up as started in shell.  Please `$PATH` in NyaoVim directly as below.

1. Start NyaoVim
2. Open Chrome DevTools from menu item 'Open DevTools'
3. Enter `process.env.PATH` to console

If you don't want to add `nvim`'s directory path to `$PATH`, please specify the absolute path to `nvim` in `<neovim-editor>` element as below.

```html
<neovim-editor
    id="nyaovim-editor"
    argv$="[[argv]]"
    nvim-cmd="/custom/path/to/nvim"
></neovim-editor>
```


