ignore /^node_modules/, /^build/, /^typings/

def build(kind, path)
  puts "\033[93m#{Time.now}: #{File.basename path}\033[0m"
  success = system "npm run build-#{kind}"
  if success
    puts "\033[92mOK\033[0m\n\n"
  else
    puts "\033[91mFAIL\033[0m\n\n"
  end
end

guard :shell do
  watch %r[^main/.+\.ts$] do |m|
    build(:main, m[0])
  end

  watch %r[^renderer/.+\.ts$] do |m|
    build(:renderer, m[0])
  end
end
