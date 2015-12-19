![NyaoVim](resources/title-bar.png)
===================================

This is a [Neovim](https://neovim.io/) frontend built on [Electron](http://electron.atom.io/).  Neovim editor is [composed as WebComponent](https://github.com/rhysd/neovim-component) and users can extend UI by reusable WebComponents, HTML, CSS and JavaScript.

**This repository is being heavily developed.  Everything is unstable.**

`:help design-not` says:

> Use Vim as a component from a shell or in an IDE.

NyaoVim has the same spirit as this.  NyaoVim contains Neovim editor as WebComponent and enables to extend its UI with web technology as recent modern editors and IDEs (e.g. [Atom](http://atom.io/), [VS Code](https://github.com/Microsoft/vscode), [LightTable](http://lighttable.com/)).

![structure](https://raw.githubusercontent.com/rhysd/ss/master/NyaoVim/structure.png)

## Goal

- NyaoVim bundles **no extended UI** by default.  It only provides the nice UI plugin architecture.  Users should compose their favorite UI with WebComponent, HTML and CSS.
- Do not introduce another plugin manager.  HTML for WebComponent should be bundled with Vim plugin.  Therefore Vim plugin manager can handle UI components and it enables to bundle JS codes and Vim script codes.
- Do not lose Vim's comfortability by default.
- UI component creators can use powerful APIs ([Node.js APIs](https://nodejs.org/en/docs/), [Electron APIs](https://github.com/atom/electron/tree/master/docs/api) and [Neovim msgpack-rpc APIs](https://neovim.io/doc/user/msgpack_rpc.html)), so many [npm packages](https://www.npmjs.com/) and [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/).
- Cross Platform (Linux, OS X, Windows)

Memo: 'nyao' is 'meow' in Japanese and an acronym for 'Non-Yet Another Original'.

## UI Examples

Examples [bundled in `<neovim-component>`](https://github.com/rhysd/neovim-component/tree/master/example).  Each of them is written within 100~300 lines. You can create reusable WebComponents and integrate it to NyaoVim.

- Markdown editor

![markdown example screenshot](https://raw.githubusercontent.com/rhysd/ss/master/neovim-component/markdown-example.gif)

- Image popup on cursor

![image popup example screenshot](https://raw.githubusercontent.com/rhysd/ss/master/neovim-component/popup-image-example.gif)

- Embedded mini browser

![mini browser example screenshot](https://raw.githubusercontent.com/rhysd/ss/master/neovim-component/mini-browser.gif)

## Installation

[npm package](https://www.npmjs.com/package/nyaovim) (`npm install -g nyaovim`) and package release (not yet).

## Usage

### Getting Started

You can start NyaoVim with `nyaovim` command if you install this app with npm.

```
$ nyaovim [files...]
```

You would see minimal Neovim GUI editor (as normal gVim).  This is Electron app and Neovim is drawn on `<canvas>`.  You can see DevTools of this app with 'Developer Tools' menu item.

On first start up of NyaoVim, it creates `~/.config/nyaovimrc.html` for UI configuration.  Yes, you can extend and configure UI components with HTML and CSS!

### Install UI Plugin

For example, let's install [nyaovim-popup-tooltip](https://github.com/rhysd/nyaovim-popup-tooltip).

As described in Goal section, UI plugin is a normal Neovim plugin.  You can install it as other Neovim plugin.  If you use [vim-plug](https://github.com/junegunn/vim-plug), all you need is adding below line to your `init.vim`.

```vim
Plug 'rhysd/nyaovim-popup-tooltip'
```

Then you need to put popup tooltip UI to your NyaoVim interface.  Please open `~/.config/nyaovim/nyaovimrc.html`.  As described in Goal section, user can put UI with HTML and CSS with high customization.

Please add `<popup-tooltip>` tag under `<neovim-editor>` tag as below

```
<neovim-editor id="nyaovim-editor" argv$="[[argv]]"></neovim-editor>
<popup-tooltip editor="[[editor]]"></popup-tooltip>
```

`<popup-tooltip>` is a [Polymer](https://github.com/Polymer/polymer) component.  `editor="[[editor]]"` is a data binding to pass editor instance to `<popup-tooltip>`.

After installing nyaovim-popup-tooltip as Neovim plugin and adding UI to HTML, all has done!  Open NyaoVim, move cursor to any image path, and enter `gi`.  NyaoVim would load image and show it in popup tooltip as below.

![nyaovim-popup-tooltip screenshot](https://raw.githubusercontent.com/rhysd/ss/master/nyaovim-popup-tooltip/main.gif)

### Configure Window

You can configure window by properties of [`<neovim-editor>` properties](https://github.com/rhysd/neovim-component#neovim-editor-properties).
For example, below configures font face and font size.

```html
<neovim-editor
    id="nyaovim-editor"
    argv$="[[argv]]"
    font-size="14"
    font="Ricty,monospace"
></neovim-editor>
```


## How to Make UI Plugin

I created [nyaovim-popup-tooltip](https://github.com/rhysd/nyaovim-popup-tooltip) as sample UI plugin.  It will help you understand how to make UI plugin.

NyaoVim UI plugin is a normal Neovim plugin except for `nyaovim-plugin` directory as below.

```
plugin-root-dir
├── README.md
├── autoload
├── nyaovim-plugin
└── plugin
```

- `autoload` is the same as normal Neovim plugin's autoload directory.
- `plugin` is the same as normal Neovim plugin's plugin directory.
- `nyaovim-plugin` is a place HTML file contains Web Component of UI.  NyaoVim searches this directory and loads Web Components in it automatically.

Let's make your `nyaovim-plugin/first-component.html`.

```html
<!-- In first-component.html -->
<dom-module id="hello-world">
  <template>
    <style>
      #hello-world-elem {
        position: absolute;
        top: 100px;
        left: 100px;
      }
    </style>
    <div id="hello-world-elem">Hello, World!</div>
  </template>
</dom-module>
```

And you need to get an editor instance of [`<neovim-editor>`](https://github.com/rhysd/neovim-component).  You can access powerful [`<neovim-editor>`'s APIs](https://github.com/rhysd/neovim-component#neovim-editor-apis) with the instance.

You can write JavaScript for it.

```html
<!-- In first-component.html. Appending script after dom-module -->
<script>
(function() {
  var editor = document.querySelector('neovim-editor').editor;
})();
</script>
```

Let's change the content of `<div>` from Neovim.  You can call [Neovim msgpack-rpc APIs](https://neovim.io/doc/user/msgpack_rpc.html) through [client instance](https://github.com/rhysd/neovim-component#call-neovim-apis).
Subscribe notification from Neovim as following.

```html
<!-- In first-component.html -->
<script>
(function() {
  var editor = document.querySelector('neovim-editor').editor;
  var client = editor.getClient();
  client.on('notification', function(method, args) {
    if (method === 'hello-world:content') {
      var elem = doument.getElementById('hello-world-elem');
      elem.innerText = args[0];
    }
  });
  client.subscribe('hello-world:content');
})();
</script>
```

If you created your component as [Polymer](https://github.com/Polymer/polymer) element, you can receive editor instance as `editor` property of it.

You've finished creating UI.
Note that you can also use [Electron APIs](https://github.com/atom/electron/tree/master/docs/api) and [Node.js APIs](https://nodejs.org/en/) (e.g. `require()`) here.

Next, write small Vim script code in `plugin/hello-world.vim`.  `rpcnotify()` is available to send Vim script values to component via msgpack-rpc.

```vim
" Send notfication to your UI
command! -nargs=+ HelloWorld call rpcnotify(0, 'hello-world:content', <q-args>)
```

All has been done.
Put `<hello-world></hello-world>` in your `nyaovimrc.html` and start NyaoVim, then execute the command.

```vim
:HelloWorld Hello world from NyaoVim!
```

Congrats!  Now you can start to make your UI with HTML, CSS, Polymer, Electron and Node.js!  When you want to ask a question, please feel free to make an issue for question.


## License

[MIT License](/LICENSE.txt).

Logo of this app is created based on [Neovim logo](https://neovim.io/) licensed under [CCA 3.0 Unported](https://creativecommons.org/licenses/by/3.0/legalcode).

> The Neovim logo by Jason Long is licensed under the Creative Commons Attribution 3.0 Unported License.
