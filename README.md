# ![NyaoVim](resources/title-bar.png)

This is a [Neovim](https://neovim.io/) frontend built on [Electron](http://electron.atom.io/).
The Neovim editor is [composed as a Web Component](https://github.com/rhysd/neovim-component)
and users can extend the UI through reusable Web Components, HTML, CSS and JavaScript.

**This repository is being heavily developed. Everything is unstable.**

`:help design-not` says:

> Use Vim as a component from a shell or in an IDE.

NyaoVim has the same spirit as this. NyaoVim contains the Neovim editor as a
Web Component and enables the extension of its UI with web technologies in a similar
manner to recent modern editors and IDEs (e.g. [Atom](http://atom.io/), [VS Code](https://github.com/Microsoft/vscode), [LightTable](http://lighttable.com/)).

## Goals

- **NyaoVim bundles no extended UI by default.**
  It only provides a nice UI plugin architecture.
  Users can compose their favorite UI with Web Components, HTML, and CSS.
  It is also easy to make a NyaoVim distribution where useful components are bundled.

- **Do not introduce another plugin manager.**
  HTML for a Web Component should be bundled with the Vim plugin.
  Therefore, the Vim plugin manager can handle UI components. It also enables
  the bundling of Javascript and VimL.

- **Do not lose Vim's comfortability by default.**
  It should be aware of performance.

- **UI component creators can use powerful APIs, packages and tools**;
  [Node.js APIs](https://nodejs.org/en/docs/), [Electron APIs](https://github.com/atom/electron/tree/master/docs/api),
  [Neovim msgpack-rpc APIs](https://neovim.io/doc/user/msgpack_rpc.html)),
  so many [npm packages](https://www.npmjs.com/), and [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/).

- **Cross Platform** (Linux, OS X, Windows)

Memo: 'nyao' is 'meow' in Japanese and its pronunciation resembles 'neo'.
It's also an acronym for 'Not Yet Another Original'.

## App Structure

NyaoVim consists of Web Components on top of Electron, as shown in the following figure.
At first there is only the `<neovim-editor>` and you can add/remove additional components.

![structure](https://raw.githubusercontent.com/rhysd/ss/master/NyaoVim/structure.png)

## UI Plugin Examples

UI plugins are easily installed to NyaoVim in the same way as normal plugins.
Each of them is between 100~300 lines in length.
You can create reusable Web Components and integrate them into NyaoVim.

- [nyaovim-markdown-preview](https://github.com/rhysd/nyaovim-markdown-preview)

![nyaovim-markdown-preview screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-markdown-preview/main.gif)

- [nyaovim-popup-tooltip](https://github.com/rhysd/nyaovim-popup-tooltip)

![nyaovim-popup-tooltip screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-popup-tooltip/main.gif)

- [nyaovim-mini-browser](https://github.com/rhysd/nyaovim-mini-browser)

![nyaovim-mini-browser screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-mini-browser/main.gif)

## Usage

### Getting Started

You can install NyaoVim as an [npm package](https://www.npmjs.com/package/nyaovim).
Currently no packaging release is available yet.
If you use Windows and haven't installed Neovim yet, please read [tips](docs/tips.md) first.

```sh
$ npm install -g nyaovim
```

If you haven't installed Neovim yet, please install it following [Neovim's instaruction](https://github.com/neovim/neovim/wiki/Installing-Neovim) because NyaoVim uses the `nvim` command internally.

You can start NyaoVim with the `nyaovim` command if you install this app via npm.

```sh
$ nyaovim [files...]
```

After entering the command, you will see a minimal Neovim GUI editor (similar to normal gVim).
This is an Electron app and Neovim is drawn on the `<canvas>`.
You can use the DevTools of this app with the 'Developer Tools' menu item.

On first start up of NyaoVim, `~/.config/nyaovim/nyaovimrc.html` is created for UI configuration (`%AppData%` instead of `.config` in Windows).
Yes, you can extend and configure UI components with HTML and CSS!

### Configure Editor Options

I guess you're now thinking, 'Hmm, font is not good and too small...'.
You can configure some editor options through the [`<neovim-editor>` properties](https://github.com/rhysd/neovim-component#neovim-editor-properties).
For example, below configures font face and font size by the `font` and `font-size` properties.
Then set line-height to 1.5 (for example, Atom adopts 1.5 as line-height).

```html
<neovim-editor
    id="nyaovim-editor"
    argv="[[argv]]"
    font-size="14"
    font="Ricty,monospace"
    line-height="1.5"
></neovim-editor>
```

And you can also configure browser window options with `browser-config.json`
(e.g. Preserving window state, Single instance app, and so on).
See [tips](docs/tips.md) for more details.

### Install UI Plugin

For example, let's install [nyaovim-popup-tooltip](https://github.com/rhysd/nyaovim-popup-tooltip).

As described in the [Goal section](#goals), a UI plugin is a normal Neovim plugin.
You can install it in the same way as any other Neovim plugin.
If you use [vim-plug](https://github.com/junegunn/vim-plug),
add the following line to your `init.vim`.

```vim
Plug 'rhysd/nyaovim-popup-tooltip'
```

Then you need to add the popup tooltip UI to your NyaoVim interface.
Please open `~/.config/nyaovim/nyaovimrc.html` (`%AppData%` instead of `.config` in Windows).
As described in the [Goal section](#goals), users can customize the UI with HTML and CSS.

Please add the `<popup-tooltip>` tag under the `<neovim-editor>` tag as shown below

```html
<neovim-editor id="nyaovim-editor" argv$="[[argv]]"></neovim-editor>
<popup-tooltip editor="[[editor]]"></popup-tooltip>
```

`<popup-tooltip>` is a [Polymer](https://github.com/Polymer/polymer) component.
`editor="[[editor]]"` is a data binding to pass the editor instance to `<popup-tooltip>`.

After installing nyaovim-popup-tooltip as a Neovim plugin and adding the UI to the HTML, the setup is complete!
Open NyaoVim, move the cursor to any image path, and enter `gi`.
NyaoVim will load the image and display it in a popup tooltip as shown below.

![nyaovim-popup-tooltip screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-popup-tooltip/main.gif)

## Documents

More documents are in the [docs directory](docs).

- [How to Make UI Plugin](docs/make-ui-plugin.md)
- [Tips](docs/tips.md)
- [FAQ](docs/faq.md)
- [Runtime API](docs/runtime-api.md)
- [Browser Config](docs/browser-config.md)

## License

[MIT License](/LICENSE.txt).

The logo of this app was created based on the [Neovim logo](https://neovim.io/), licensed under [CCA 3.0 Unported](https://creativecommons.org/licenses/by/3.0/legalcode).

> The Neovim logo by Jason Long is licensed under the Creative Commons Attribution 3.0 Unported License.
