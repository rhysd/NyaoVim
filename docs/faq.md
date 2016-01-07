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
