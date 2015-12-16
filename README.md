![NyaoVim](resources/title-bar.png)
===================================

This is a [Neovim](https://neovim.io/) frontend built on [Electron](http://electron.atom.io/).  Neovim editor is [composed as WebComponent](https://github.com/rhysd/neovim-component) and users can extend UI by reusable WebComponents, HTML, CSS and JavaScript.

**This repository is being heavily developed.  No documentation yet.**

`:help design-not` says:

> Use Vim as a component from a shell or in an IDE.

NyaoVim has the same spirit as this.  NyaoVim contains Neovim editor as WebComponent and enables to extend its UI with web technology as recent modern editors and IDEs (e.g. [Atom](http://atom.io/), [VS Code](https://github.com/Microsoft/vscode), [LightTable](http://lighttable.com/)).

## Goal

- NyaoVim bundles **no extended UI** by default.  It only provides the nice UI plugin architecture.  Users should compose their favorite UI with WebComponent, HTML and CSS.
- Do not introduce another plugin manager.  HTML for WebComponent should be bundled with Vim plugin.  Therefore Vim plugin manager can handle UI components and it enables to bundle JS codes and Vim script codes.
- Do not lose Vim's comfortability by default.
- UI component creators can use powerful APIs ([Node.js APIs](https://nodejs.org/en/docs/), [Electron APIs](https://github.com/atom/electron/tree/master/docs/api) and [Neovim msgpack-rpc APIs](https://neovim.io/doc/user/msgpack_rpc.html)), so many [npm packages](https://www.npmjs.com/) and [Chrome DevTools](https://developers.google.com/web/tools/chrome-devtools/).

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

## License

[MIT License](/LICENSE.txt).

Logo of this app is created based on [Neovim logo](https://neovim.io/) licensed under [CCA 3.0 Unported](https://creativecommons.org/licenses/by/3.0/legalcode).

> The Neovim logo by Jason Long is licensed under the Creative Commons Attribution 3.0 Unported License.
