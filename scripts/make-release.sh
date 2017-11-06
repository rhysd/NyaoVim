#!/bin/bash

set -e

case $OSTYPE in
    darwin*) ;;
    *)
        echo "This script is only for macOS: ${OSTYPE}"
        exit 1
    ;;
esac

function prepare-app() {
    if [ -d app ]; then
        rm -rf app
    fi
    mkdir app

    npm run build:release

    cp -R bin main renderer resources runtime package.json bower.json app/
    cd app/

    npm install --production
    npm uninstall electron
    npm prune
    ../node_modules/.bin/bower install
    cd -
}

function pack-app() {
    local version="$(./bin/cli.js --version)"
    local electron_version="$(electron --version)"
    local electron_version=${electron_version#v}

    electron-packager ./app --platform=darwin --arch=x64 "--app-copyright=copyright (c) 2017 rhysd" --app-version=$version --build-version=$version --icon=./resources/icon/icon.icns --electron-version=$electron_version --extend-info=./resources/osx_plist/file_associations.plist --app-bundle-id=io.github.rhysd.nyaovim
    electron-packager ./app --platform=linux --arch=all "--app-copyright=copyright (c) 2017 rhysd" --app-version=$version --build-version=$version --icon=./resources/icon/icon.ico --electron-version=$electron_version
    electron-packager ./app --platform=win32 --arch=all "--app-copyright=copyright (c) 2017 rhysd" --app-version=$version --build-version=$version --icon=./resources/icon/icon.ico --electron-version=$electron_version --version-string=$version
}

function make-dist() {
    if [ -d dist ]; then
        rm -rf dist
    fi
    mkdir dist
    local version="$(./bin/cli.js --version | head -n 1 | cut -d ' ' -f 3)"
    for dir in `ls -1 | grep '^NyaoVim-'`; do
        mv "$dir/LICENSE" "$dir/LICENSE.electron"
        cp -R LICENSE.txt README.md docs "$dir"
        zip --symlinks "dist/${dir}-${version}.zip" -r "$dir"
    done
    rm -rf NyaoVim-*
    open dist
}

export PATH=$(pwd)/node_modules/.bin:$PATH

prepare-app
pack-app
make-dist
