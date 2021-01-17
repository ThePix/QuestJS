require 'yaml'


# After, do find-and-replace
# .parent -> .loc
# player -> game.player (but not player object)
# add player template to player


LIST1 = "North;Northeast;East;Southeast;South;Southwest;West;NorthWest;Up;Down;In;Out".split ";"
LIST2 = "South;Southwest;West;NorthWest;North;Northeast;East;Southeast;Down;Up;Out;In".split ";"



require "rexml/document"
include REXML





JOINER = '~'

class Converter

  @@jsReplacements = [

    {:asl => '\r', :js => ''},

    {:asl => / and /, :js => ' && '},
    {:asl => / or /, :js => ' || '},
    {:asl => /\bnot /, :js => '!'},
    {:asl => / \<\> /, :js => ' !== '},
    {:asl => /do ?\(([a-zA-Z0-9_.]+), ([a-zA-Z_]+)\)/, :js => '\1[\2]()'},
    {:asl => /do ?\(([a-zA-Z0-9_.]+), ~\)/, :js => '\1[~]()'},
    {:asl => /foreach \(([a-zA-Z0-9_]+), ([a-zA-Z0-9_.()]+)\)/, :js => 'for (let \1 of \2)'},
    {:asl => /otherwise/, :js => 'else'},

    {:asl => /HasString ?\(([a-zA-Z0-9_.]+), ([a-zA-Z0-9_]+)\)/, :js => 'typeof \1[\2] === "string"'},
    {:asl => /HasInt ?\(([a-zA-Z0-9_.]+), ([a-zA-Z0-9_]+)\)/, :js => 'typeof \1[\2] === "number"'},
    {:asl => /HasBoolean ?\(([a-zA-Z0-9_.]+), ([a-zA-Z0-9_]+)\)/, :js => 'typeof \1[\2] === "boolean"'},
    {:asl => /HasScript ?\(([a-zA-Z0-9_.]+), ([a-zA-Z0-9_]+)\)/, :js => 'typeof \1[\2] === "function"'},
    {:asl => /GetBoolean ?\(([a-zA-Z0-9_.]+), ([a-zA-Z0-9_]+)\)/, :js => '\1[\2]'},
    {:asl => /HasString ?\(([a-zA-Z0-9_.]+), ~\)/, :js => 'typeof \1[~] === "string"'},
    {:asl => /HasInt ?\(([a-zA-Z0-9_.]+), ~\)/, :js => 'typeof \1[~] === "number"'},
    {:asl => /HasBoolean ?\(([a-zA-Z0-9_.]+), ~\)/, :js => 'typeof \1[~] === "boolean"'},
    {:asl => /HasScript ?\(([a-zA-Z0-9_.]+), ~\)/, :js => 'typeof \1[~] === "function"'},
    {:asl => /GetBoolean ?\(([a-zA-Z0-9_.]+), ~\)/, :js => '\1[~]'},


    {:asl => /if \(([a-zA-Z_]+)\.parent = ([a-zA-Z_]+)\)/, :js => 'if (\1.isAtLoc("\2"))'},

    {:asl => /([a-zA-Z_.]+) = \1 \+ /, :js => '\1 += '},
    {:asl => /([a-zA-Z_.]+) = \1 \- /, :js => '\1 -= '},

    {:asl => /GetDisplayAlias ?\(([a-zA-Z_.]+)\)/, :js => '\1.byname({})'},
    {:asl => /([a-zA-Z_]+)\.alias/, :js => '\1.byname({})'},

    {:asl => /ToInt ?\(([0-9a-zA-Z_."]+)\)/, :js => 'parseInt(\1)'},
    {:asl => /TypeOf ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, :js => 'typeof \1.\2'},
    {:asl => /TypeOf ?\(([0-9a-zA-Z_."]+), ~\)/, :js => 'typeof \1[~]'},
    {:asl => /TypeOf ?\(([0-9a-zA-Z_."]+)\)/, :js => 'typeof \1'},
    {:asl => /ClearScreen ?()/, :js => 'clearScreen()'},
    {:asl => /DisplayList ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, :js => 'msgList(\1, \2)'},
    {:asl => /msg ?\(([0-9a-zA-Z_."]+)\)/, :js => 'msg(\1)'},
    {:asl => /picture ?\(([0-9a-zA-Z_."]+)\)/, :js => 'picture(\1)'},

    # Lists
    {:asl => /list add ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, :js => '\1.push(\2)'},
    {:asl => /list add ?\(([0-9a-zA-Z_.]+), ~\)/, :js => '\1.push(~)'},
    {:asl => /list remove ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, :js => 'array.remove(\1, \2)'},
    {:asl => /FilterByAttribute ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, :js => '\1.filter(el => el[\2] === \3)'},
    {:asl => /FilterByNotAttribute ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, :js => '\1.filter(el => el[\2] !== \3)'},
    {:asl => /IndexOf ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, :js => '\1.indexOf(\2)'},
    {:asl => /IndexOf ?\(([0-9a-zA-Z_."]+), ~\)/, :js => '\1.indexOf(~)'},
    {:asl => /([0-9a-zA-Z_.]+) = ListCombine ?(list1, list2)/, :js => '\1 = list1.concat(list2)'},
    {:asl => /ListContains ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, :js => '\1.includes(\2)'},
    {:asl => /ListContains ?\(([0-9a-zA-Z_.]+), ~\)/, :js => '\1.includes(~)'},
    {:asl => /ListCompact/, :js => '[...new Set(array)]'},
    {:asl => /ListCount ?\(([0-9a-zA-Z_.]+)\)/, :js => '\1.length'},
    {:asl => /ListExclude ?\(([0-9a-zA-Z_.]+, [0-9a-zA-Z_.]+)/, :js => 'array.subtract(\1, \2)'},
    {:asl => /([0-9a-zA-Z_.]+) = NewList ?()/, :js => 'const \1 = []'},
    {:asl => /([0-9a-zA-Z_.]+) = NewObjectList ?()/, :js => 'const \1 = []'},
    {:asl => /([0-9a-zA-Z_.]+) = NewStringList ?()/, :js => 'const \1 = []'},
    {:asl => /([0-9a-zA-Z_.]+) = ObjectListCompact ?()/, :js => '[...new Set(array)]'},
    {:asl => /(?:[a-zA-Z]*)ListItem ?\(([0-9a-zA-Z_.]+), ([0-9]+)\)/, :js => '\1[\2]'},
    {:asl => /(?:[a-zA-Z]*)ListItem ?\(([0-9a-zA-Z_.]+), ([a-zA-Z_][0-9a-zA-Z_.]*)\)/, :js => '\1[\2]'},
    {:asl => /StringListSort ?\(([0-9a-zA-Z_."]+)\)/, :js => '\1.sort()'},

    # Dictionaries
    {:asl => /dictionary add ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, :js => '\1[\2] = \3'},
    {:asl => /dictionary add ?\(([0-9a-zA-Z_.]+), ~, ([0-9a-zA-Z_.]+)\)/, :js => '\1[~] = \2'},
    {:asl => /dictionary add ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+), ~\)/, :js => '\1[\2] = ~'},
    {:asl => /dictionary add ?\(([0-9a-zA-Z_.]+), ~, ~\)/, :js => '\1[~] = ~'},
    {:asl => /dictionary remove ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_.]+)\)/, :js => 'delete \1[\2]'},
    {:asl => /dictionary remove ?\(([0-9a-zA-Z_."]+), ~\)/, :js => 'delete \1.~'},
    {:asl => /DictionaryAdd ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, :js => '\1[\2] = \3'},
    {:asl => /DictionaryAdd ?\(([0-9a-zA-Z_.]+), ~, ([0-9a-zA-Z_.]+)\)/, :js => '\1[~] = \2'},
    {:asl => /DictionaryAdd ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+), ~\)/, :js => '\1[\2] = ~'},
    {:asl => /DictionaryAdd ?\(([0-9a-zA-Z_.]+), ~, ~\)/, :js => '\1[~] = ~'},
    {:asl => /DictionaryContains ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, :js => '\1.includes(\2)'},
    {:asl => /DictionaryContains ?\(([0-9a-zA-Z_.]+), ~\)/, :js => '\1.includes(~)'},
    {:asl => /DictionaryCount ?\(([0-9a-zA-Z_.]+)\)/, :js => 'Object.keys(\1).length'},
    {:asl => /(?:[a-zA-Z]*)DictionaryItem ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, :js => '\1[\2]'},
    {:asl => /(?:[a-zA-Z]*)DictionaryItem ?\(([0-9a-zA-Z_.]+), ~\)/, :js => '\1.~'},
    {:asl => /DictionaryRemove ?\(([0-9a-zA-Z_.]+), ([0-9a-zA-Z_.]+)\)/, :js => 'delete \1[\2]'},
    {:asl => /DictionaryRemove ?\(([0-9a-zA-Z_.]+), ~\)/, :js => 'delete \1.~'},
    {:asl => /([0-9a-zA-Z_.]+) = New(?:[a-zA-Z]*)Dictionary ?()/, :js => 'const \1 = {}'},
    {:asl => /([0-9a-zA-Z_.]+) = QuickParams ?\(~, ([0-9a-zA-Z_."]+)\)/, :js => 'const \1 = {~ => \2}'},

    # Strings
    {:asl => /CapFirst ?\(([0-9a-zA-Z_."]+)\)/, :js => 'sentenceCase(\1)'},
    {:asl => /DisplayMoney ?\(([0-9a-zA-Z_."]+)\)/, :js => 'displayMoney(\1)'},
    {:asl => /DisplayNumber ?\(([0-9a-zA-Z_."]+)\)/, :js => 'displayNumber(\1)'},
    {:asl => /EndsWith ?\(([0-9a-zA-Z_."]+), ~\)/, :js => '\1.endsWith(~)'},
    {:asl => /FormatList ?\(([0-9a-zA-Z_."]+), ~, ~, ~\)/, :js => 'formatList(\1, {sep:~, lastJoiner:~, nothing:~})'},
    {:asl => /Instr ?\(([0-9a-zA-Z_."]+), ~\)/, :js => '\1.indexOf(~)'},
    {:asl => /InstrRev ?\(([0-9a-zA-Z_."]+), ~\)/, :js => '\1.lastIndexOf(~)'},
    {:asl => /IsNumeric ?\(([0-9a-zA-Z_."]+)\)/, :js => '!Number.isNaN(\1)'},
    {:asl => /IsRegexMatch ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, :js => '\1.match(\2)'},
    {:asl => /Join ?\(([0-9a-zA-Z_."]+), ~\)/, :js => '\1.join(~)'},
    {:asl => /LCase ?\(([0-9a-zA-Z_."]+)\)/, :js => '\1.toLowerCase()'},
    {:asl => /LengthOf ?\(([0-9a-zA-Z_."]+)\)/, :js => '\1.length'},
    {:asl => /Mid ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, :js => '\1.substr(\2)'},
    {:asl => /Mid ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, :js => '\1.substr(\2, \3)'},
    {:asl => /PadString ?\(([0-9a-zA-Z_."]+), ~\)/, :js => '\1.padStart(~)'},
    {:asl => /ProcessText ?\(([0-9a-zA-Z_."]+)\)/, :js => 'processText(\1)'},
    {:asl => /Replace ?\(([0-9a-zA-Z_."]+), ~, ~\)/, :js => '\1.replace(~, ~)'},
    {:asl => /Spaces ?\(([0-9a-zA-Z_."]+)\)/, :js => 'spaces(\1)'},
    {:asl => /Split ?\(([0-9a-zA-Z_."]+), ~\)/, :js => '\1.split(~)'},
    {:asl => /StartsWith ?\(([0-9a-zA-Z_."]+), ~\)/, :js => '\1.startsWith(~)'},
    {:asl => /ToRoman ?\(([0-9a-zA-Z_."]+)\)/, :js => 'toRoman(\1)'},
    {:asl => /ToWords ?\(([0-9a-zA-Z_."]+)\)/, :js => 'toWords(\1)'},
    {:asl => /Trim ?\(([0-9a-zA-Z_."]+)\)/, :js => '\1.trim()'},
    {:asl => /UCase ?\(([0-9a-zA-Z_."]+)\)/, :js => '\1.toUpperCase()'},
    
    # Random
    {:asl => /DiceRoll ?\(([0-9a-zA-Z_."]+)\)/, :js => 'random.dice(\1)'},
    {:asl => /GetRandomInt ?\(([0-9a-zA-Z_."]+), ([0-9a-zA-Z_."]+)\)/, :js => 'random.int(\1, \2)'},
    {:asl => /PickOneObject ?\(([0-9a-zA-Z_."]+)\)/, :js => 'random.fromArray(\1)'},
    {:asl => /PickOneString ?\(([0-9a-zA-Z_."]+)\)/, :js => 'random.fromArray(\1)'},
    {:asl => /RandomChance ?\(([0-9a-zA-Z_."]+)\)/, :js => 'random.chance(\1)'},
    
    
    {:asl => /OutputText ?\(([0-9a-zA-Z_."]+)\)/, :js => 'msg(\1)'},
    {:asl => /OutputTextNoBr ?\(([0-9a-zA-Z_."]+)\)/, :js => 'msg(\1)'},
    {:asl => /OutputTextRaw ?\(([0-9a-zA-Z_."]+)\)/, :js => 'msg(\1)'},
    {:asl => /OutputTextRawNoBr ?\(([0-9a-zA-Z_."]+)\)/, :js => 'msg(\1)'},

    {:asl => /Set(Alignment|BackgroundColour|BackgroundImage|BackgroundOpacity|FontName|FontSize|ForegroundColour|WebFontName)(.*)/, :js => '// Set\1\2'},
    {:asl => /TextFX_Typewriter ?\(([a-zA-Z_."]+), ([a-zA-Z_."]+)\)/, :js => 'msg(\1)  // Was Typewriter, time=\2'},
    {:asl => /TextFX_Unscramble ?\(([a-zA-Z_."]+), ([a-zA-Z_."]+), ([a-zA-Z_."]+)\)/, :js => 'msg(\1)  // Was Unscramble, time=\2, reveal=\3'},

    {:asl => /Conjugate ?\(([0-9a-zA-Z_."]+), ~\)/, :js => 'conjugate(\1, ~)'},
    {:asl => /WriteVerb ?\(([0-9a-zA-Z_."]+), ~\)/, :js => 'nounVerb(\1, ~)'},
  ]
  
  @@tpReplacements = [
    {:asl => /\{if ([a-zA-Z0-9]+)\.([a-zA-Z0-9]+) ?>= ?/, :js => '{ifMoreThanOrEqual:\1:\2:'},
    {:asl => /\{if ([a-zA-Z0-9]+)\.([a-zA-Z0-9]+) ?> ?/, :js => '{ifMoreThan:\1:\2:'},
    {:asl => /\{if ([a-zA-Z0-9]+)\.([a-zA-Z0-9]+) ?<= ?/, :js => '{ifLessThanOrEqual:\1:\2:'},
    {:asl => /\{if ([a-zA-Z0-9]+)\.([a-zA-Z0-9]+) ?< ?/, :js => '{ifLessThan:\1:\2:'},
    {:asl => /\{if not ([a-zA-Z0-9]+)\./, :js => '{ifNot:\1:'},
    {:asl => /\{if not /, :js => '{ifNot:'},
    {:asl => /\{if ([a-zA-Z0-9]+)\./, :js => '{if:\1:'},
    #{:asl => /\{if /, :js => '{if:'},
    {:asl => /\{notfirst:/, :js => '{notOnce:'},
  ]

  def self.convert_line(s, objects = [], variables = false)
    throw "line with #{JOINER} in it: #{s}" if s.include?(JOINER)
    throw "line starts with \": #{s}" if s.start_with?('"')
    return false if s =~ /\A\s*\Z/
    ary = s.split '"'
    codes = []
    texts = []
    count = 0
    flag = false
    ary.each do |el|
      if flag
        texts[texts.length - 1] += '"' + el
        flag = el.end_with? '\\'
      elsif count % 2 == 0
        codes << el
        flag = false
      else
        texts << el
        flag = el.end_with? '\\'
      end
      count += 1 if !flag
    end
    code = codes.join JOINER

    @@jsReplacements.each do |el|
      code.sub!(el[:asl], el[:js])
    end
    
    newtexts = []
    texts.each do |s|
      @@tpReplacements.each do |el|
        s.gsub!(el[:asl], el[:js])
      end
      newtexts << s
    end
    
    objects.each do |el|
      code.sub!(el[:regex], el[:w_name])
    end
    
    if code =~ /\A\s*(else|if)/
      code.sub!(" = ", " === ")
      code.sub!(" == ", " === ")
      code.sub!(" != ", " !== ")
    end
    
    # Any new variables here?
    if (variables)
      matches = code.scan(/ ([a-zA-Z_][a-zA-Z_0-9]*) =/)
      matches.each do |match|
        if !variables.include? match[0]
          code.sub!(" #{match[0]} =", " let #{match[0]} =")
          variables << match[0]
        end
      end
    end
    
    codes = code.split JOINER
    ary = []
    codes.each_with_index do |el, i|
      ary << el
      ary << newtexts[i] if i < newtexts.length
    end
    res = ary.join('"')

    # convert obj["name"] to obj.name
    res.gsub!(/\[\"([a-z][a-zA-Z0-9_]*)\"\]/, '.\1')

    res << '"' if codes.length == newtexts.length
    return res[4..-1]
  end

  def self.convert_script(s, objects, variables = [])
    return s if s.is_a? String

    objectList = []
    objects.each do |el|
      objectList << {:regex => /\b#{el.name}\b/, :w_name => "w.#{el.name}", :name => el.name }
    end

    code = s[:asl].start_with?('<![CDATA[') ? s[:asl][9..-1] : s[:asl]
    lines = ["function() {"]
    varFlag = false
    inCase = false

    code.split("\n").each do |line|
      #p inCase
      if line.end_with? "firsttime {"
        spaces = line.length - 15
        lines << " " * spaces + "if (this.firstTimeFlag) {"
        lines << " " * spaces + "  this.firstTimeFlag = true"
      elsif line =~ /case/
        inCase = true
        lines << line.sub(/    case \((.*)\) {$/, 'case \1:')
      elsif line =~ /default/
        inCase = true
        lines << line.sub(/    default {$/, 'default:')
      elsif inCase && line =~ /^\s*}$/
      #p 'here'
        lines << line.sub('  }', 'break')
        inCase = false
      else
        s = Converter.convert_line(line, objectList, variables)
        lines << s if s
      end
    end
    lines << '  }'
    lines.join "\n"
  end

  def self.handle_element(el)
    type = el.attribute("type").to_s
    return false if !el.text
    text = el.text.start_with?('<![CDATA[') ? el.text[9..-1] : el.text
    
    if type == "script"
      return {:asl => text}
    else text
      return "\"" + text.gsub("\"", "\\\"") + "\""
    end
  end
end


class Command
  def initialize obj
    @name = obj.attribute("name").to_s.gsub(' ', '_').gsub(/\W/, '')
    el = obj.elements["pattern"]
    @pattern = el.text if el
    el = obj.elements["script"]
    @script = el.text if el
  end

  def to_js objects
    s = "\n\ncomands.unshift(new Cmd('#{@name}', {\n"
    s += "  regex:/^#{@pattern}$/,\n"
    s += "  objects:[\n"
    s += "    {ignore:true},\n"
    s += "    {scope:parser.isHere},\n"
    s += "  ],\n"
    s += "  script:"
    s += Converter.convert_script(@script, objects)
    s += "}))"
    return s
  end
end


class Function
  def initialize obj
    @name = obj.attribute("name").to_s.gsub(' ', '_').gsub(/\W/, '')
    paramStr = obj.attribute("parameters")
    @params = paramStr ? paramStr.to_s.split(', ') : []
    @script = obj.text
  end

  def to_js objects
    "\n\nconst #{@name} = function(" + @params.join(', ') + ") {" + Converter.convert_script(@script, objects, @params) + "}"
  end
end


class Obj
  attr_reader :alias, :desc, :name, :exits, :inside
  @@typelist = []

  def initialize obj
    @name = obj.attribute("name").to_s.gsub(' ', '_').gsub(/\W/, '')
    el = obj.elements["alias"]
    @alias = el.text if el
    
    @values = {}
    
    q5 = ["alias", "look", "description", "beforefirstenter", "beforeenter", "enter", "firstenter", "onexit", "implementation_notes", "max", "follow", "nomovement", "nomanipulation", "novision", "nosound", "novoice", "healedmsg", "overrides", "health", "takemsg",
    ]
    q6 = ["alias", "examine", "desc", "beforeFirstEnter", "beforeEnter", "afterEnter", "afterFirstEnter", "onExit", "notes", "max", "follow", "nomovement", "nomanipulation", "novision", "nosound", "novoice", "healedmsg", "overrides", "health", "takemsg",
    ]
    
    for i in 0..q5.count
      el = obj.elements[q5[i]]
      @values[q6[i]] = Converter.handle_element(el) if el
    end    
    
    
    
    @loc = obj.parent.attribute("name").to_s
    @scenery = obj.elements["scenery"]
    p @scenery
    
    exch = obj.elements["exchange"]
    if exch && exch.text
      exch_ary = exch.text.split "<br/>"
      @conversation = "function() {\n    msg(\""
      @conversation += exch_ary.join("\");\n    msg(\"")
      @conversation += "\");\n"
      if obj.elements["talk"] && obj.elements["talk"].text
        @conversation += obj.elements["talk"].text 
        @conversation += "\n"
      end
      @conversation += "  },\n"
    end
    
    @exits = []
    @types = []
    obj.elements.each("inherit") do |type|
      s = type.attribute("name").to_s
      @types << s #unless s.match /^editor_/
      @@typelist << s unless @@typelist.include? s
    end
    obj.elements.each("exit") do |exit|
      s = exit.attribute("alias").to_s
      to = exit.attribute("to").to_s.gsub(' ', '_').gsub(/\W/, '')

      p s
      p to
      @exits << [s, to]
    end

    print "object is '#{@name}'\n"
  end
  
  def inside
    @inside = true
  end


  
  
  def to_js objects
    s = ""
    if @types.include? "editor_room"
      s += "createRoom(\"#{@name}\","
    else
      s += "createItem(\"#{@name}\","
    end
    if @types.include?("namedmale") || @types.include?("male")
      s += " NPC(false),"
    end
    if @types.include?("namedfemale") || @types.include?("female")
      s += " NPC(true),"
    end
    if @types.include? "startingtopic"
      s += " TOPIC(true),"
    elsif @types.include? "topic"
      s += " TOPIC(false),"
    end
    if (@types.include? "editor_player")
      s += " PLAYER(),"
    end
    if (@types.include? "surface")
      s += " SURFACE(open),"
    end
    if (@types.include? "container")
      s += " CONTAINER(open),"
    end

    if (@types.include? "lastingspell")
      s += " LASTING_SPELL(),"
    end
    if (@types.include? "nonattackspell")
      s += " INSTANT_SPELL(),"
    end
    if (@types.include? "spell")
      s += " SPELL,"
    end

    if (@types.include? "weapon")
      s += " WEAPON(),"
    end

    if (@types.include? "monster")
      s += " MULTI_MONSTER(),"
    end
    if (@types.include? "monster")
      s += " MONSTER(),"
    end
    if (@types.include? "monster")
      s += " MONSTER_ATTACK(),"
    end
    
    s += " {\n"
    
    s += "  loc:\"#{@loc}\",\n" if (@loc && !@loc.empty?)
    s += "  scenery:true,\n" if (@scenery)
    s += "  pronouns:lang.pronouns.plural,\n" if (@types.include? "plural")
    @values.each do |k, v|
      s += "  #{k}:#{Converter.convert_script(v, objects)},\n" if (v)
    end
    s += "  runscript:#{Converter.convert_script(@conversation, objects)}" if (@conversation)
    @exits.each do |exit|
      s += "  #{exit[0]}:new Exit(\"#{exit[1]}\"),\n"
    end
    s += "})\n\n\n"
    s
  end
  
  def self.out
    p @@typelist
  end
end



