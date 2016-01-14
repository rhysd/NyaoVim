function! nyaovim#load_nyaovim_plugin(runtimepath) abort
    call rpcnotify(0, 'nyaovim:load-plugin-dir', a:runtimepath)
endfunction

function! nyaovim#load_nyaovim_plugin_direct(html_path) abort
    if a:html_path !~# '\.html$'
        throw 'nyaovim: Invalid file name.  HTML file is expected.'
    endif
    call rpcnotify(0, 'nyaovim:load-path', a:html_path)
endfunction

function nyaovim#require_javascript_file(script_path) abort
    if !filereadable(a:script_path)
        throw 'nyaovim: Specified JavaScript code doesn''t exist: ' . a:script_path
    endif
    call rpcnotify(0, 'nyaovim:require-script-file', a:script_path);
endfunction

function! nyaovim#call_javascript_function(func_name, args) abort
    call rpcnotify(0, 'nyaovim:call-global-function', a:func_name, a:args)
endfunction
