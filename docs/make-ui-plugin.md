How to Make UI Plugin
=====================

I created [nyaovim-popup-tooltip](https://github.com/rhysd/nyaovim-popup-tooltip) as sample UI plugin.  It will help you understand how to make UI plugin.

- [Directory Structure](#structure)
- [Getting Started](#tutorial)
- [Debug Your Plugin](#debug)
- [Handle Resizing Neovim Window](#window-resize)

## <a name="structure">Directory Structure</a>

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
- `nyaovim-plugin` is a place for HTML file which contains Web Component of UI.  NyaoVim searches this directory and loads Web Components in it automatically.
- UI should be created as a custom element of WebComponents v1 in the HTML file. And you can use [Polymer v2](https://www.polymer-project.org/) framework to
  utilize data binding from `nyaovimrc.html` (mainly for user configuration).


## <a name="tutorial">Getting Started</a>

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

And you need to get an editor instance from `nayovim-app` element. It is a custom element and it contains [`<neovim-editor>`](https://github.com/rhysd/neovim-component) in it.  You can access powerful [`<neovim-editor>`'s APIs](https://github.com/rhysd/neovim-component#neovim-editor-apis) via `editor` property.

You can write JavaScript for it.

```html
<!-- In first-component.html. Append script after dom-module -->
<script>
(function() {
  const editor = document.querySelector('nyaovim-app').editor;
  console.log(editor);
})();
</script>
```

Let's change the content of `<div>` from Neovim.  You can call [Neovim msgpack-rpc APIs](https://neovim.io/doc/user/msgpack_rpc.html) through [client instance](https://github.com/rhysd/neovim-component#call-neovim-apis).
Subscribe notification from Neovim as following.

```html
<!-- In first-component.html -->
<script>
(function() {
  const editor = document.querySelector('nyaovim-app').editor;
  const client = editor.getClient();
  client.on('notification', function(method, args) {
    if (method === 'hello-world:content') {
      const elem = doument.getElementById('hello-world-elem');
      elem.innerText = args[0];
    }
  });
  client.subscribe('hello-world:content');
})();
</script>
```

If you created your component as [Polymer v2](https://github.com/Polymer/polymer) element, you can receive editor instance as `editor` property of it.

You've finished creating UI.
Note that you can also use [Electron APIs](https://github.com/atom/electron/tree/master/docs/api) and [Node.js APIs](https://nodejs.org/en/) (e.g. `require()`) here.

Next, write small Vim script code in `plugin/hello-world.vim`.  `rpcnotify()` is available to send Vim script values to component via msgpack-rpc.

```vim
" Send notification to your UI
command! -nargs=+ HelloWorld call rpcnotify(0, 'hello-world:content', <q-args>)
```

All has been done.
Put `<hello-world></hello-world>` in your `nyaovimrc.html` and start NyaoVim, then execute the command.

```vim
:HelloWorld Hello world from NyaoVim!
```

Congrats!  Now you can start to make your UI with HTML, CSS, Polymer, Electron and Node.js!  When you want to ask a question, please feel free to make an issue for question.

## <a name="debug">Debug Your Plugin</a>

If you want to debug your plugin or NyaoVim, you can start NyaoVim in debug mode with `$NODE_ENV` environment variable.

```sh
$ NODE_ENV=debug nyaovim
```

Chrome DevTools will be launched in detached window and you can debug your UI plugin like general web applications; showing console, checking DOM elements, profiling and so on.  Even if you start NyaoVim normally, you can also open Chrome DevTools by clicking menu item 'Toggle DevTools'.

## <a name="window-resize">Handle Resizing Neovim Window</a>

As [described in neovim-component document](https://github.com/rhysd/neovim-component#view-apis), when `<neovim-editor>` **may** need to resize, you **must** call `editor.screen.checkShouldResize()` in order to notify it to `<neovim-editor>`.  Please note that the notification is not needed when window is resized.  And it is OK that nothing happens to the size of `<neovim-editor>` as result.
This is needed because Neovim is rendered on `<canvas>` and it can't know the timing when itself is resized.

For example, when your component appears in window, the area of `<neovim-editor>` may change.

```javascript
function showUpSomeElementInNyaoVimWindow() {
    const e = document.getElementById('some-elem');

    // Element appears in window!  Screen might be resized by the change.
    // 'none' -> 'block'
    e.style.display = 'block';

    // You need to call this to say to <neovim-editor> that 'You may be resized.  Check it out!'.
    editor.screen.checkShouldResize();
}
```

