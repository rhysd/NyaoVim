![NyaoVim](resources/title-bar.png)
===================================

This is a [Neovim](https://neovim.io/) frontend built on [Electron](http://electron.atom.io/).
The Neovim editor is [composed as a Web Component](https://github.com/rhysd/neovim-component) and users
can extend the UI with reusable Web Components, HTML, CSS and JavaScript.

`:help design-not` says:

> Use Vim as a component from a shell or in an IDE.

NyaoVim is built in the same spirit.  NyaoVim contains the Neovim editor as a Web Component and extends
its UI with web technology, as in other modern editors and IDEs (e.g. [Atom](http://atom.io/),
[VS Code](https://github.com/Microsoft/vscode), [LightTable](http://lighttable.com/)).


## Goals

- **NyaoVim bundles no extended UI by default.**  It only provides the nice UI plugin architecture.
  Users can compose their favorite UI with Web Components, HTML and CSS.  It is also easy to make a NyaoVim
  distribution where useful components are bundled.
- **Do not introduce another plugin manager.**  HTML for Web Components should be bundled with Vim plugins.
  Therefore, a Vim plugin manager can handle UI components, letting us bundle JS and Vim script code.
- **Do not lose Vim's comfortability by default.**  It should be aware of performance.
- **UI component creators can use powerful APIs, packages and tools**; [Node.js APIs](https://nodejs.org/en/docs/),
  [Electron APIs](https://github.com/atom/electron/tree/master/docs/api), [Neovim msgpack-rpc APIs](https://neovim.io/doc/user/msgpack_rpc.html)),
  so many [npm packages](https://www.npmjs.com/) and [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/).
- **Cross Platform** (Linux, OS X, Windows)

Memo: 'nyao' is 'meow' in Japanese and its pronounce resembles 'neo'.
It is also an acronym for 'Not Yet Another Original'.


## App Structure

NyaoVim consists of Web Components on Electron as seen in the following figure.  At first there is
only `<neovim-editor>` and you can add/remove additional components.

![structure](https://raw.githubusercontent.com/rhysd/ss/master/NyaoVim/structure.png)


## UI Plugin Examples

UI plugins are installable as easily as regular plugins.  Each of them is written within 100~300 lines.
You can also create reusable Web Components and integrate them into NyaoVim.

- [nyaovim-markdown-preview](https://github.com/rhysd/nyaovim-markdown-preview)

![nyaovim-markdown-preview screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-markdown-preview/main.gif)

- [nyaovim-popup-tooltip](https://github.com/rhysd/nyaovim-popup-tooltip)

![nyaovim-popup-tooltip screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-popup-tooltip/main.gif)

- [nyaovim-mini-browser](https://github.com/rhysd/nyaovim-mini-browser)

![nyaovim-mini-browser screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-mini-browser/main.gif)


## Usage

### Getting Started

You can install NyaoVim as an [npm package](https://www.npmjs.com/package/nyaovim).  Currently no packaging
release is available yet.  If you use Windows and haven't installed Neovim yet, please read [first tips](docs/tips.md) first.

```sh
$ npm install -g nyaovim
```

`npm` may require `sudo` if you installed `node` pacakge via system package manager.

If you haven't installed Neovim yet, please install it following [Neovim's instructions](https://github.com/neovim/neovim/wiki/Installing-Neovim)
because NyaoVim internally uses the `nvim` command.  **Note that `nvim` v0.1.6 or later is needed.**

You can start NyaoVim with the `nyaovim` command if you install this app with npm.

```sh
$ nyaovim [files...]
```

You would see a minimal Neovim GUI editor (like gVim).  This is an Electron app and Neovim is drawn
on `<canvas>`.  You can see the DevTools of this app with the 'Developer Tools' menu item.

On first start up of NyaoVim, it creates `~/.config/nyaovim/nyaovimrc.html` for UI configuration
(`%AppData%` instead of `.config` in Windows).  Yes, you can extend and configure UI components with
HTML and CSS!

### Configure Editor Options

I guess you're now thinking 'Hmm, font is not good and too small...'. You can configure some editor
options by properties of [`<neovim-editor>` properties](https://github.com/rhysd/neovim-component#neovim-editor-properties).
For example, below configures font face and font size by `font` and `font-size` properties.  Then set
line-height to 1.5 (for example, Atom adopts 1.5 as line-height).

```html
<neovim-editor
    id="nyaovim-editor"
    argv="[[argv]]"
    font-size="14"
    font="Ricty,monospace"
    line-height="1.5"
></neovim-editor>
```

And you can also configure browser window options with `browser-config.json` (e.g. Preserving window
state, Single instance app, and so on). See [tips](docs/tips.md) for more detail.

### Install UI Plugin

For example, let's install [nyaovim-popup-tooltip](https://github.com/rhysd/nyaovim-popup-tooltip).

As described in the Goals section, a UI plugin is a normal Neovim plugin.  You can install it like
any other Neovim plugin.  If you use [vim-plug](https://github.com/junegunn/vim-plug), all you need
is adding below line to your `init.vim`.

```vim
Plug 'rhysd/nyaovim-popup-tooltip'
```

Then you need to put the popup tooltip UI on your NyaoVim interface.  Please open `~/.config/nyaovim/nyaovimrc.html`
(`%AppData%` instead of `.config` in Windows).  As described in the Goals section, a user can build
a UI with HTML and CSS with high customization.

Please add `<popup-tooltip>` tag under `<neovim-editor>` tag as below

```html
<neovim-editor id="nyaovim-editor" argv="[[argv]]"></neovim-editor>
<popup-tooltip editor="[[editor]]"></popup-tooltip>
```

`<popup-tooltip>` is a [Polymer](https://github.com/Polymer/polymer) component.  `editor="[[editor]]"`
is a data binding to pass editor instance to `<popup-tooltip>`.

After installing nyaovim-popup-tooltip as a Neovim plugin and adding UI to HTML, you're all done!
Open NyaoVim, move the cursor to any image path, and enter `gi`.  NyaoVim will load the image and show
it in a popup tooltip as below.

![nyaovim-popup-tooltip screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-popup-tooltip/main.gif)


## Documents

There is more in documentation in the [docs directory](docs).

- [How to Make UI Plugin](docs/make-ui-plugin.md)
- [Tips](docs/tips.md)
- [FAQ](docs/faq.md)
- [Runtime API](docs/runtime-api.md)
- [Browser Config](docs/browser-config.md)


## Versioning

NyaoVim is now under beta phase. Major version is fixed to 0 until it gets stable release.

Updating minor version means it contains breaking changes. And updating patch version means it contains
no breaking change, so you can update version easily.


## License

[MIT License](/LICENSE.txt).

Logo of this app is created based on [Neovim logo](https://neovim.io/) licensed under [CCA 3.0 Unported](https://creativecommons.org/licenses/by/3.0/legalcode).

> The Neovim logo by Jason Long is licensed under the Creative Commons Attribution 3.0 Unported License.

