ignore /^node_modules/, /^build/, /^typings/

guard :shell do
  watch %r[^browser/.+\.ts$] do |m|
    puts "#{Time.now}: #{m[0]}"
    system 'rake build_browser_src'
  end

  watch %r[^renderer/.+\.tsx?$] do |m|
    puts "#{Time.now}: #{m[0]}"
    system 'rake build_renderer_src'
  end
end
