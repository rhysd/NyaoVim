![NyaoVim](resources/title-bar.png)
===================================

This is a [Neovim](https://neovim.io/) frontend built on [Electron](http://electron.atom.io/).  Neovim editor is [composed as WebComponent](https://github.com/rhysd/neovim-component) and users can extend UI by reusable WebComponents, HTML, CSS and JavaScript.

**This repository is being heavily developed.  No documentation yet.**

`:help design-not` says:

> Use Vim as a component from a shell or in an IDE.

NyaoVim has the same spirit as this.  NyaoVim puts neovim editor as WebComponent and enables to extend its UI with web technology as IDE.

## Goal

- NyaoVim bundles **no extended UI** by default.  It only provides the nice UI plugin architecture.  Users should compose their favorite UI with WebComponent, HTML and CSS.
- Do not introduce another plugin manager.  HTML for WebComponent should be bundled with Vim plugin therefore Vim plugin manager can handle UI component.
- Do not lose Vim's comfortability by default.

Memo: 'nyao' is 'meow' in Japanese and an acronym for 'Non-Yet Another Original'.

## License

[MIT License](/LICENSE.txt).

Logo of this app is created based on [Neovim logo](https://neovim.io/) licensed under [CCA 3.0 Unported](https://creativecommons.org/licenses/by/3.0/legalcode).

> The Neovim logo by Jason Long is licensed under the Creative Commons Attribution 3.0 Unported License.
