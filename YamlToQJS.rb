require 'yaml'

LIST1 = "North;Northeast;East;Southeast;South;Southwest;West;NorthWest;Up;Down;In;Out".split ";"
LIST2 = "South;Southwest;West;NorthWest;North;Northeast;East;Southeast;Down;Up;Out;In".split ";"


class Room
  attr_reader :alias, :desc, :name, :exits, :inside

  def initialize name, desc
    @alias = name
    @desc = desc
    @name = name.gsub(' ', '_').gsub(/\W/, '').downcase
    # p @alias
    @exits = []
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
    s = "  createRoom(\"#{@name}\", [{\n"
    s += "    desc:\"#{@alias}\",\n"
    s += "    alias:\"#{@alias}\" inside:\"#{@inside}\",\n"
    @exits.each { |exit| s += exit.to_js }
    s += "  }]);\n\n"
    s
  end
end

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

print "Done"