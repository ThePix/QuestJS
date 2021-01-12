#GEMS_PATH="C:\Ruby25-x64\lib\ruby\gems\2.5.0"


require "rubygems"
gem "test-unit", "3.3.6"
require "test/unit"
 
require_relative "UtilQtoQJS"


class TestSimpleNumber < Test::Unit::TestCase
#=begin
  def test_simple_convert_line
    assert_equal(false, Converter.convert_line("   \t   \n \t"))
    assert_equal('Some text "in quotes" more text', Converter.convert_line('    Some text "in quotes" more text'))
    assert_equal('Some text "in quotes"', Converter.convert_line('    Some text "in quotes"'))
    assert_equal('Some text "in quotes with quote\"" more text', Converter.convert_line('    Some text "in quotes with quote\"" more text'))
    assert_equal('Some text "" more text', Converter.convert_line('    Some text "" more text'))
    assert_equal('Some text "in quotes with quote\" twice \"" more text', Converter.convert_line('    Some text "in quotes with quote\" twice \"" more text'))
  end

  def test_convert_line_split
    assert_equal('str.split(".")', Converter.convert_line('    Split (str, ".")'))
  end
#=end
  def test_convert_line_has1
    assert_equal('typeof myVar.flag === "boolean"', Converter.convert_line('    HasBoolean (myVar, "flag")'))
    assert_equal('typeof myVar.name === "string"', Converter.convert_line('    HasString (myVar, "name")'))
  end

#=begin
  def test_convert_line_has2
    assert_equal('typeof myVar[flag] === "boolean"', Converter.convert_line('    HasBoolean (myVar, flag)'))
    assert_equal('typeof myVar[name] === "string"', Converter.convert_line('    HasString (myVar, name)'))
  end

  def test_convert_line_list_item
    assert_equal('myVar[5]', Converter.convert_line('    ListItem (myVar, 5)'))
    assert_equal('myVar[name]', Converter.convert_line('    ObjectListItem (myVar, name)'))
  end

  def test_convert_foreach
    assert_equal('for (let s of ary)', Converter.convert_line('    foreach (s, ary)'))
    assert_equal('for (let e2 of ScopeExits())', Converter.convert_line('    foreach (e2, ScopeExits())'))
  end

  def test_convert_line_boolean_operators
    assert_equal('here && !now "not here or there" || here', Converter.convert_line('    here and not now "not here or there" or here'))
  end

  def test_convert_line_dictionary_add
    assert_equal('myDict[myVar] = value', Converter.convert_line('    dictionary add (myDict, myVar, value)'))
    assert_equal('myDict.myVar = value', Converter.convert_line('    dictionary add (myDict, "myVar", value)'))
    assert_equal('myDict[myVar] = "value"', Converter.convert_line('    dictionary add (myDict, myVar, "value")'))
    assert_equal('myDict.myVar = "value"', Converter.convert_line('    dictionary add (myDict, "myVar", "value")'))
  end

  def test_convert_line_addition_assignment
    assert_equal('var += 5', Converter.convert_line('    var = var + 5'))
  end

  def test_convert_line_object_names
    assert_equal('w.house.name = "The big house"', Converter.convert_line('    house.name = "The big house"', [{:regex => /\bhouse\b/, :w_name => 'w.house'}]))
    assert_equal('whitehouse.name = "The big house"', Converter.convert_line('    whitehouse.name = "The big house"', [{:regex => /\bhouse\b/, :w_name => 'w.house'}]))
  end

  def test_convert_line_variables
    variables = []
    assert_equal('let myvar = 5', Converter.convert_line('    myvar = 5', {}, variables))
    assert_equal('myvar = 5', Converter.convert_line('    myvar = 5', {}, variables))
  end

  def test_convert_line_text_processor
    variables = []
    assert_equal('let myvar = "You see a {if:player:flag:bear}."', Converter.convert_line('    myvar = "You see a {if player.flag:bear}."', {}, variables))
    assert_equal('myvar = "You see a {ifNot:player:flag:bear}."', Converter.convert_line('    myvar = "You see a {if not player.flag:bear}."', {}, variables))
    assert_equal('myvar = "You see a {ifLessThan:player:flag:6:bear}."', Converter.convert_line('    myvar = "You see a {if player.flag < 6:bear}."', {}, variables))
    assert_equal('myvar = "You see a {ifMoreThanOrEqual:player:flag:8:bear}."', Converter.convert_line('    myvar = "You see a {if player.flag >= 8:bear}."', {}, variables))
  end

  def test_convert_script
    script = <<-END
      if (not GetBoolean(game, "notarealturn")) {
        game.turncount = game.turncount + 1
        if (kitchen_zone.active) {
          KitchenTurns
        }
      }
      game.notarealturn = false
    END
    variables = []
    res = Converter.convert_script({:asl => script}, [])
    assert_equal(156, res.length)
  end

  def test_convert_script_with_objects
    script = <<-END
      if (not GetBoolean(game, "notarealturn")) {
        game.turncount = game.turncount + 1
        if (kitchen_zone.active) {
          KitchenTurns
        }
      }
      game.notarealturn = false
    END
    variables = []
    res = Converter.convert_script({:asl => script}, [ObjWithName.new('kitchen_zone')])
    assert_equal(158, res.length)
  end
#=end
  def test_convert_script_with_switch
    script = <<-END
      if (not GetBoolean(game, "notarealturn")) {
        game.turncount = game.turncount + 1
        switch (kitchen_zone.active) {
          case (0) {
            dostuff()
          }
          case (1) {
            dootherstuff()
          }
          default {
            dod = dod +6
          }
        }
      }
      game.notarealturn = false
    END
    variables = []
    res = Converter.convert_script({:asl => script}, [ObjWithName.new('kitchen_zone')])
    #print res
    assert_equal(294, res.length)
  end
#=end
end


class ObjWithName
  attr_reader :name

  def initialize name
    @name = name
  end
end

