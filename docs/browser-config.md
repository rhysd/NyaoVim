Broser Config
=============

NyaoVim is rendered in browser window using [Electron](https://github.com/atom/electron).  You can configure editor options with properties of `<neovim-editor>` component, but cannot configure the browser window options.  This is because the browser window options must be specified before window opened.  **Please note that `browser-config.json` may be deprecated after Neovim 0.2 because of the change of Neovim frontend architecture**

You can configure browser window options using `browser-config.json` in `~/.config/nyaovim/`.  It does not exist by default and you need to create it at first.

```sh
$ echo "{\n  "window_options": {}\n}" > ~/.config/nyaovim/browser-config.json
```

`browser-config.json` contains one object.  The object optionally contains below key/value entries.

- **window_options** : The value is [options of `BrowserWindow` class of Electron](https://github.com/atom/electron/blob/master/docs/api/browser-window.md#new-browserwindowoptions).  You can configure many options here; `width`, `height`, `fullscreen`, `webPreferences`, and so on.

Below is an example:

```json
{
  "window_options": {
    "width": 1200,
    "height": 960,
    "fullscreen": true,
    "alwaysOnTop": true,
    "webPreferences": {
      "webgl": false,
      "plugins": true
    }
  }
}
```


