![NyaoVim](resources/title-bar.png)
===================================

This is a [Neovim](https://neovim.io/) frontend built on [Electron](http://electron.atom.io/).  Neovim editor is [composed as Web Component](https://github.com/rhysd/neovim-component) and users can extend UI by reusable Web Components, HTML, CSS and JavaScript.

**This repository is being heavily developed.  Everything is unstable.**

`:help design-not` says:

> Use Vim as a component from a shell or in an IDE.

NyaoVim has the same spirit as this.  NyaoVim contains Neovim editor as Web Component and enables to extend its UI with web technology as recent modern editors and IDEs (e.g. [Atom](http://atom.io/), [VS Code](https://github.com/Microsoft/vscode), [LightTable](http://lighttable.com/)).

## Goals

- **NyaoVim bundles no extended UI by default.**  It only provides the nice UI plugin architecture.  Users can compose their favorite UI with Web Components, HTML and CSS.  It is also easy to make NyaVim distribution where useful components are bundled.
- **Do not introduce another plugin manager.**  HTML for Web Component should be bundled with Vim plugin.  Therefore Vim plugin manager can handle UI components and it enables to bundle JS codes and Vim script codes.
- **Do not lose Vim's comfortability by default.**  It should be aware of performance.
- **UI component creators can use powerful APIs, packages and tools**; [Node.js APIs](https://nodejs.org/en/docs/), [Electron APIs](https://github.com/atom/electron/tree/master/docs/api), [Neovim msgpack-rpc APIs](https://neovim.io/doc/user/msgpack_rpc.html)), so many [npm packages](https://www.npmjs.com/) and [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/).
- **Cross Platform** (Linux, OS X, Windows)

Memo: 'nyao' is 'meow' in Japanese and its pronounce resembles 'neo'.  It is also an acronym for 'Not Yet Another Original'.

## App Structure

NyaoVim consists Web Components on Electron as following figure.  At first there is only `<neovim-editor>` and you can add/remove additional components.

![structure](https://raw.githubusercontent.com/rhysd/ss/master/NyaoVim/structure.png)

## UI Plugin Examples

UI plugins are easily installed to NyaoVim the same as other normal plugins.  Each of them is written within 100~300 lines.  You can create reusable Web Components and integrate it to NyaoVim.

- [nyaovim-markdown-preview](https://github.com/rhysd/nyaovim-markdown-preview)

![nyaovim-markdown-preview screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-markdown-preview/main.gif)

- [nyaovim-popup-tooltip](https://github.com/rhysd/nyaovim-popup-tooltip)

![nyaovim-popup-tooltip screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-popup-tooltip/main.gif)

- [nyaovim-mini-browser](https://github.com/rhysd/nyaovim-mini-browser)

![nyaovim-mini-browser screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-mini-browser/main.gif)


## Usage

### Getting Started

You can install NyaoVim as [npm package](https://www.npmjs.com/package/nyaovim).  Currently no packaging release is available yet.

```sh
$ npm install -g nyaovim
```

You can start NyaoVim with `nyaovim` command if you install this app with npm.

```sh
$ nyaovim [files...]
```

You would see minimal Neovim GUI editor (as normal gVim).  This is Electron app and Neovim is drawn on `<canvas>`.  You can see DevTools of this app with 'Developer Tools' menu item.

On first start up of NyaoVim, it creates `~/.config/nyaovim/nyaovimrc.html` for UI configuration (`%AppData%` instead of `.config` in Windows).  Yes, you can extend and configure UI components with HTML and CSS!

### Configure GUI Options

I guess you're now thinking 'Hmm, font is not good and too small...'. You can configure some GUI options by properties of [`<neovim-editor>` properties](https://github.com/rhysd/neovim-component#neovim-editor-properties).
For example, below configures font face and font size by `font` and `font-size` properties.

```html
<neovim-editor
    id="nyaovim-editor"
    argv$="[[argv]]"
    font-size="14"
    font="Ricty,monospace"
    line-height="1.5"
></neovim-editor>
```

### Install UI Plugin

For example, let's install [nyaovim-popup-tooltip](https://github.com/rhysd/nyaovim-popup-tooltip).

As described in Goal section, UI plugin is a normal Neovim plugin.  You can install it as other Neovim plugin.  If you use [vim-plug](https://github.com/junegunn/vim-plug), all you need is adding below line to your `init.vim`.

```vim
Plug 'rhysd/nyaovim-popup-tooltip'
```

Then you need to put popup tooltip UI to your NyaoVim interface.  Please open `~/.config/nyaovim/nyaovimrc.html` (`%AppData%` instead of `.config` in Windows).  As described in Goal section, user can put UI with HTML and CSS with high customization.

Please add `<popup-tooltip>` tag under `<neovim-editor>` tag as below

```
<neovim-editor id="nyaovim-editor" argv$="[[argv]]"></neovim-editor>
<popup-tooltip editor="[[editor]]"></popup-tooltip>
```

`<popup-tooltip>` is a [Polymer](https://github.com/Polymer/polymer) component.  `editor="[[editor]]"` is a data binding to pass editor instance to `<popup-tooltip>`.

After installing nyaovim-popup-tooltip as Neovim plugin and adding UI to HTML, all has done!  Open NyaoVim, move cursor to any image path, and enter `gi`.  NyaoVim would load image and show it in popup tooltip as below.

![nyaovim-popup-tooltip screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-popup-tooltip/main.gif)


## Documents

More documents are put in [docs directory](docs).

- [How to Make UI Plugin](docs/make-ui-plugin.md)
- [Tips](docs/tips.md)
- [FAQ](docs/faq.md)

## License

[MIT License](/LICENSE.txt).

Logo of this app is created based on [Neovim logo](https://neovim.io/) licensed under [CCA 3.0 Unported](https://creativecommons.org/licenses/by/3.0/legalcode).

> The Neovim logo by Jason Long is licensed under the Creative Commons Attribution 3.0 Unported License.
