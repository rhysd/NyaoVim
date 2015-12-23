if (exists('g:loaded_nyaovim_runtime') && g:loaded_nyaovim_runtime)
    finish
endif

function! s:send_current_path(method) abort
    let p = expand('%:p')
    if filereadable(p)
        call rpcnotify(0, a:method, p)
    endif
endfunction

augroup nyaovim
    autocmd!
    autocmd BufReadPost,BufNewFile * call <SID>send_current_path('nyaovim:edit-start')
augroup END

call s:send_current_path('nyaovim:edit-start')

let g:loaded_nyaovim_runtime = 1
