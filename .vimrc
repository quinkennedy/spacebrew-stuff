set tabstop=2
set softtabstop=2
set shiftwidth=2
set expandtab
set colorcolumn=80
highlight colorcolumn ctermbg=darkgray
set nocompatible
filetype off
set rtp+=~/.vim/bundle/Vundle.vim
call vundle#begin()
Plugin 'VundleVim/Vundle.vim'
Plugin 'Valloric/YouCompleteMe'
Plugin 'rdnetto/YCM-Generator'
call vundle#end()
filetype plugin indent on
nnoremap <F4> :!node_modules/eslint/bin/eslint.js "%:p"<cr>
nnoremap <F5> :!npm test<cr>
nnoremap <F6> :!node_modules/mocha/bin/mocha "%:p"<cr>
