require 'yaml'
require_relative "UtilQtoQJS"

FILENAME = ARGV[0]


# After, do find-and-replace
# .parent -> .loc
# player -> game.player (but not player object)
# add player template to player



require "rexml/document"
include REXML
file = File.new("misc/" + FILENAME + ".xml")
doc = REXML::Document.new file


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




File.open('game-' + FILENAME + '/command-lib.js', "w") do |file|
  file << "\"use strict\";\n\n\n"
  commands.each { |o| file << o.to_js(objects) }
end

File.open('game-' + FILENAME + '/functions.js', "w") do |file|
  file << "\"use strict\";\n\n\n"
  functions.each { |o| file << o.to_js(objects) }
end



print "Done"