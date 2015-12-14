#! /usr/bin/env node
'use strict';

var argv = process.argv.slice(2);
argv.unshift(require('path').join(__dirname, '..'));
if (!process.env['NODE_ENV']) {
    process.env['NODE_ENV'] = 'production';
}
require('child_process').spawn(require('electron-prebuilt'), argv, { stdio: 'inherit' });

