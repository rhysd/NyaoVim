function! nyaovim#load_nyaovim_plugin(runtimepath) abort
    call rpcnotify(0, 'nyaovim:load-plugin-dir', a:runtimepath)
endfunction

function! nyaovim#load_nyaovim_plugin_direct(html_path) abort
    if a:html_path !~# '\.html$'
        throw 'nyaovim: Invalid file name.  HTML file is expected.'
    endif
    call rpcnotify(0, 'nyaovim:load-path', a:html_path)
endfunction
