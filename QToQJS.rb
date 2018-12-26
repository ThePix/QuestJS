require 'yaml'

LIST1 = "North;Northeast;East;Southeast;South;Southwest;West;NorthWest;Up;Down;In;Out".split ";"
LIST2 = "South;Southwest;West;NorthWest;North;Northeast;East;Southeast;Down;Up;Out;In".split ";"



require "rexml/document"
include REXML
file = File.new("rpg.aslx")
doc = REXML::Document.new file

game = doc.elements.to_a("asl/game").first
#p "Game name is '#{game}'"
#p "Game name is '#{game.class}'"
game_name = game.attribute("name").to_s

p "Game name is '#{game_name}'"




class Command
  def initialize obj
    @name = obj.attribute("name").to_s.gsub(' ', '_').gsub(/\W/, '')
    el = obj.elements["pattern"]
    @pattern = el.text if el
    el = obj.elements["script"]
    @script = el.text if el
    
  end
end


doc.elements.each("//command") do |com|
  Command.new com
 # do stuff
end



class Obj
  attr_reader :alias, :desc, :name, :exits, :inside
  @@typelist = []

  def initialize obj
    @name = obj.attribute("name").to_s.gsub(' ', '_').gsub(/\W/, '')
    el = obj.elements["alias"]
    @alias = el.text if el
    
    el = obj.elements["description"]
    @desc = el.text if el
    
    el = obj.elements["look"]
    @examine = el.text if el
    
    @loc = obj.parent.attribute("name").to_s
    
    @exits = []
    @types = []
    obj.elements.each("inherit") do |type|
      s = type.attribute("name").to_s
      @types << s #unless s.match /^editor_/
      @@typelist << s unless @@typelist.include? s
    end

    print "object is '#{@name}'\n"
    print "    parent: '#{@loc}'\n"
    print "    alias: '#{@alias}'\n"
    print "    look: '#{@examine}'\n"
    print "    description: '#{@desc}'\n"
    print "    types are '#{types.join ', '}'\n"


    end
  
  def inside
    @inside = true
  end

  def to_s
    s = "  <object name=\"#{@name}\">\n"
    s += "    <inherit name=\"editor_room\" />\n"
    s += "    <alias>#{@alias}</alias>\n"
    s += "    <description><![CDATA["
    s += @desc
    s += "]]></description>\n"
    s += "    <inside />\n" if @inside
    @exits.each { |exit| s += exit.to_s }
    s += "  </object>\n"
    s
  end

  
  
  def to_js
    s = ""
    if (@types.include? "editor_room")
      s += "  createRoom(\"#{@name}\", [{\n"
    else
      s += "  createItem(\"#{@name}\", [{\n"
    end
    if (@types.include? "namedmale" || @types.include? "male")
      s += "    NPC_OBJECT(false),\n"
    end
    if (@types.include? "namedfemale" || @types.include? "female")
      s += "    NPC_OBJECT(true),\n"
    end
    if (@types.include? "startingtopic" || @types.include? "topic")
      s += "    TOPIC,\n"
    end
    if (@types.include? "monster")
      s += "    MONSTER,\n"
    end
    
    s += "    desc:\"#{@alias}\",\n"
    s += "    alias:\"#{@alias}\" inside:\"#{@inside}\",\n"
    @exits.each { |exit| s += exit.to_js }
    s += "  }]);\n\n"
    s
  end
  
  def self.out
    p @@typelist
  end
end



doc.elements.each("//object") do |obj|
  Obj.new obj
 # do stuff
end


Obj.out

=begin

class Exit
  attr_reader :to, :dir
  
  def initialize dir, to
    @to = to
    @dir = dir
  end
  
  def to_s
    s = "    <exit alias=\"#{dir.downcase}\" to=\"#{to.name}\">\n"
    s += "      <inherit name=\"#{dir.downcase}direction\" />\n"
    s += "    </exit>\n"
    s
  end

  def to_js
    "    #{@dir.downcase}:\"#{@to.name}\",\n"
  end
end  



def find list, name
  l = list.select { |e| e.alias == name }
  raise "Not found #{name}" if l.length == 0
  raise "Found multiple #{name}" if l.length > 1
  l[0]
end

def create_exit dir, from, to
  from.exits << Exit.new(dir, to)
  to.exits << Exit.new(reverse(dir), from)
end


def reverse dir
  n = LIST1.index dir
  raise "Direction not found #{dir}" unless n
  LIST2[n]
end    



data = YAML.load_file("town.yml")
list = []
data.each do |h| 
  # p h
  room = Room.new h['Name'], h['Desc']
  h.delete 'Name'
  h.delete 'Desc'
  if h['Inside']
    room.inside
    h.delete 'Inside'
  end
  # p h
  h.each { |k, v| create_exit k, room, find(list, v) }
  list << room
end



File.open("quest.js", "w") do |file|
  list.each do |room|
    file << room.to_js
  end
end

=end

print "Done"