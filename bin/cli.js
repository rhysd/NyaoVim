#! /usr/bin/env node
'use strict';

var spawn = require('child_process').spawn;
var electron = require('electron-prebuilt');
var join = require('path').join;

var argv = process.argv.slice(2);
argv.unshift(join(__dirname, '..'));
if (!process.env['NODE_ENV']) {
    process.env['NODE_ENV'] = 'production';
}
spawn(electron, argv, {
    stdio: 'inherit',
    detached: true
}).unref();

