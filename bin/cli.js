#! /usr/bin/env node
'use strict';

var spawn = require('child_process').spawn;
var electron = require('electron-prebuilt');
var join = require('path').join;

var argv = process.argv.slice(2);
var no_detach_idx = argv.indexOf('--no-detach');
var detached
    = no_detach_idx === -1 &&
        argv.indexOf('--help') === -1 &&
        argv.indexOf('--version') === -1;
if (no_detach_idx !== -1) {
    argv.splice(no_detach_idx, 1);
}
argv.unshift(join(__dirname, '..'));

if (!process.env.NODE_ENV) {
    process.env.NODE_ENV = 'production';
}

if (detached) {
    spawn(electron, argv, {
        stdio: 'inherit',
        detached: true
    }).unref();
} else {
    spawn(electron, argv, { stdio: 'inherit' });
}

