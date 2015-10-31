require 'fileutils'
include FileUtils

ROOT = __dir__.freeze
BIN = "#{ROOT}/node_modules/.bin".freeze

def cmd_exists?(cmd)
  File.exists?(cmd) && File.executable?(cmd)
end

def ensure_cmd(cmd)
  $cmd_cache ||= []
  return true if $cmd_cache.include? cmd

  paths = ENV['PATH'].split(':').uniq
  unless paths.any?{|p| cmd_exists? "#{p}/#{cmd}" }
    raise "'#{cmd}' command doesn't exist"
  else
    $cmd_cache << cmd
  end
end

file 'node_modules' do
  ensure_cmd 'npm'
  sh 'npm install'
end

file 'bower_components' do
  ensure_cmd 'bower'
  sh 'bower install'
end

file "typings" do
  ensure_cmd 'tsd'
  sh 'tsd install'
end

task :dep => %i(node_modules bower_components typings)

task :build_browser_src => %i(typings) do
  sh "#{BIN}/tsc -p #{ROOT}/browser"
end

task :build_renderer_src do
  sh "#{BIN}/tsc -p #{ROOT}/renderer"
  sh "#{BIN}/browserify -d #{ROOT}/build/renderer/main.js -o #{ROOT}/build/renderer/index.js"
end

task :build => %i(dep build_browser_src build_renderer_src)

task :run do
  sh "#{ROOT}/bin/cli.js"
end

task :default => %i(build run)

task :lint do
  Dir['browser/**/*.ts'].each do |f|
    sh "tslint #{f}"
  end
  Dir['renderer/**/*.ts', 'renderer/**/*.tsx'].each do |f|
    sh "tslint #{f}"
  end
end
