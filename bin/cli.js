#! /usr/bin/env node

'use strict';

var child_process = require('child_process');
var electron = require('electron-prebuilt');
var join = require('path').join;

var argv = process.argv;

var detach_idx = argv.indexOf('--detach');
var detached = detach_idx !== -1;
if (detached) {
    argv.splice(detach_idx, 1);
}

argv.unshift(join(__dirname, '..'));

if (detached) {
    child_process.spawn(electron, argv, {
        stdio: 'ignore',
        detached: true
    }).unref();
} else {
    child_process.spawn(electron, argv, {
        stdio: 'inherit'
    });
}
