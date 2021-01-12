require 'yaml'
require_relative "UtilQtoQJS"

FILENAME = ARGV[0]


# After, do find-and-replace
# .parent -> .loc
# player -> game.player (but not player object)
# add player template to player



require "rexml/document"
include REXML
file = File.new("../misc/" + FILENAME + ".aslx")
doc = REXML::Document.new file

if FILENAME.end_with? '.aslx'
  game = doc.elements.to_a("asl/game").first
  #p "Game name is '#{game}'"
  #p "Game name is '#{game.class}'"
  game_name = game.attribute("name").to_s
  p "Game name is '#{game_name}'"
end
  




objects = []
doc.elements.each("//object") do |obj|
  objects << Obj.new(obj)
end
p "Found #{objects.length} objects"

commands = []
doc.elements.each("//command") do |obj|
  commands << Command.new(obj)
end
p "Found #{commands.length} commands"

functions = []
doc.elements.each("//function") do |obj|
  functions << Function.new(obj)
end
p "Found #{functions.length} functions"



File.open('../game-' + FILENAME + '/data.js', "w") do |file|
  file << "\"use strict\"\n\n\n"
  objects.each { |o| file << o.to_js(objects) }
end

File.open('../game-' + FILENAME + '/commands.js', "w") do |file|
  file << "\"use strict\"\n\n\n"
  commands.each { |o| file << o.to_js(objects) }
end

File.open('../game-' + FILENAME + '/code.js', "w") do |file|
  file << "\"use strict\"\n\n\n"
  functions.each { |o| file << o.to_js(objects) }
end



print "Done"