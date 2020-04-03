## World Functions

These are functions for creating objexts inthe game world

### Function: ` `  ` () `  ` ` 

Use this to create a new item (as opposed to a room). It adds various defaults that apply only to template.items. The first argument should be a string - a unique name for this object, composed only of letters, numbers and underscores. It will than take any number of dictionaries that will be combined to set the properties. Generally objects should not be created during play as they will not be saved properly. Either keep the object hodden until required or clone existing objects.

### Function: ` `  ` world.createItem() `  ` ` 

Use this to create a new room (as opposed to an item). It adds various defaults that apply only to template.items The first argument should be a string - a unique name for this object, composed only of letters, numbers and underscores. It will than take any number of dictionaries that will be combined to set the properties. Generally objects should not be created during play as they will not be saved properly. Either keep the object hodden until required or clone existing objects.

### Function: ` `  ` world.cloneObject(item, loc, newName) `  ` ` 

Use this to create new template.items during play. The given item will be cloned at the given location. The `newName` isoptional, one will be generated if not supplied. If you do supply one bear inmid that every clone must have a unique name.

### Function: ` `  ` createObject(name, listOfHashes) `  ` ` 

Creates a basic object. Generally it is better to use CreateItem or CreateRoom.

## General Utility Functions

### Function: ` `  ` util.firsttime(id, first, other) `  ` ` 

This is an attempt to mimic the util.firsttime functionality of Quest 5. Unfortunately, JavaScript does not lend itself well to that! If this is the first time the give `id` has been encountered, the `first` function will be run. Otherwise the `other` function will be run, if given.

    firstime(342, function() {
      msg("This was the first time.")
    }, function() {
      msg("This was NOT the first time.")
    }, function() {

## Random Functions

### Function: ` `  ` randomInt(n1, n2) `  ` ` 

Returns a random number from 0 to n1, or n1 to n2, inclusive.

### Function: ` `  ` util.randomChance(percentile) `  ` ` 

Returns true 'percentile' times out of 100, false otherwise.

### Function: ` `  ` util.randomFromArray(arr, deleteEntry) `  ` ` 

Returns a random element from the array, or null if it is empty If the second parameter is true, then the selected value is also deleted from the array, preventing it from being selected a second time

### Function: ` `  ` util.diceRoll(dice) `  ` ` 

Returns a random number based on the standard RPG dice notation. For example 2d6+3 means roll two six sided dice and add three. Returns null if the string cannot be interpreted.

## String Functions

### Function: ` `  ` util.sentenCecase(str) `  ` ` 

Returns the string with the first letter capitalised

### Function: ` `  ` util.spaces(n) `  ` ` 

Returns a string with the given number of hard util.spaces. Browsers collapse multiple white util.spaces to just show one, so you need to use hard util.spaces (NBSPs) if you want several together.

### Function: ` `  ` util.util.prefix(item, isMultiple) `  ` ` 

If isMultiple is true, returns the item name, otherwise nothing. This is useful in commands that handle multiple objects, as you can have this at the start of the response string. For example, if the player does GET BALL, the response might be "Done". If she does GET ALL, then the response for the ball needs to be "Ball: Done". In the command, you can have `msg(util.util.prefix(item, isMultiple) + "Done"), and it is sorted.

### Function: ` `  ` util.formatList(itemArray, options) `  ` ` 

Creates a string from an array. If the array element is a string, that is used, if it is an item, its byname is used (and passed the `options` ). Items are sorted alphabetically, based on the "name" attribute.

Options:

* article:    util. DEFINITE (for "the") or util. INDEFINITE (for "a"), defaults to none (see byname)
* sep:        separator (defaults to comma)
* lastJoiner: separator for last two template.items (just separator if not provided); you should include any util.spaces (this allows you to have a comma and "and", which is obviously wrong, but some people like it)
* modified:   item aliases modified (see byname) (defaults to false)
* nothing:    return this if the list is empty (defaults to empty string)
* count:      if this is a number, the name will be prefixed by that (instead of the article)
* doNotSort   if true the list isnot sorted
* separateEnsembles:  if true, ensembles are listed as the separate template.items

For example:

``` 
util.formatList(listOfOjects, {def:"a", joiner:" and"}) -> "a hat, Mary and some boots"

util.formatList(list, {joiner:" or", nothing:"nowhere"); -> north, east or up
```

Note that you can add further options for your own game, and then write your own byname function that uses it.

### Function: ` `  ` util.listProperties(obj) `  ` ` 

Lists the properties of the given object; useful for debugging only. To inspect an object use JSON.stringify(obj)

### Function: ` `  ` util.toRoman(number) `  ` ` 

Returns the given number as a string in Roman numerals.

### Function: ` `  ` util.getDateTime() `  ` ` 

Returns the game time as a string. The game time is game.elapsedTime seconds after game.startTime.

### Function: ` `  ` util.util.displayMoney(n) `  ` ` 

Returns the given number as a string formatted as money. The formatting is defined by MONEY_FORMAT.

### Function: ` `  ` util.displayNumber(n, control) `  ` ` 

Returns the given number as a string formatted as per the control string. The control string is made up of five parts. The first is a sequence of characters that are not digits that will be added to the start of the string, and is optional. The second is a sequence of digits and it the number of characters left of the decimal point; this is padded with zeros to make it longer. The third is a single non-digit character; the decimal marker. The fourth is a sequence of digits and it the number of characters right of the decimal point; this is padded with zeros to make it longer. The fifth is a sequence of characters that are not digits that will be added to the end of the string, and is optional.

### Function: ` `  ` util.getDir(s) `  ` ` 

Converts the string to the standard direction name, so "down", "dn" and "d" will all return "down". Uses the EXITS array, so language neutral.

## Array (List) Functions

### Function: ` `  ` util.arraySubtract(a, b) `  ` ` 

Returns a new array, derived by subtracting each element in b from the array a. If b is not an array, then b itself will be removed. Unit util.tested.

### Function: ` `  ` util.arrayCompare(a, b) `  ` ` 

Returns true if the arrays a and b are equal. They are equal if both are arrays, they have the same length, and each element in order is the same. Assumes a is an array, but not b. Unit util.tested

### Function: ` `  ` util.arrayRemove(ary, el) `  ` ` 

Removes the element el from the array, ary. Unlike util.arraySubtract, no new array is created; the original aray is modified, and nothing is returned.

### Function: ` `  ` util.arrayFilterByAttribute(ary, attName, value) `  ` ` 

Returns a new array based on ary, but including only those objects for which the attribute attName is equal to value. To filter for objects that do not have the attribute you can filter for the value undefined.

## Scope Functions

### Function: ` `  ` util.scopeReachable() `  ` ` 

Returns an array of objects the player can currently reach and see.

### Function: ` `  ` util.scopeHeldBy(chr) `  ` ` 

Returns an array of objects held by the given character.

### Function: ` `  ` util.scopeHereListed() `  ` ` 

Returns an array of objects at the player's location that can be seen.

## The Respond Function

### Function: ` `  ` util.respond(params, list, func) `  ` ` 

Searchs the given list for a suitable response, according to the given params, and runs that response. This is a big topic, see [here](https://github.com/ThePix/QuestJS/wiki/The-util.respond-function) for more.

## The Text Processor Function

### Function: ` `  ` text.processText(str, params) `  ` ` 

Returns a string in which all the text processor directives have been resolved, using the optionasl parameters. More details [here(https://github.com/ThePix/QuestJS/wiki/The-Text-Processor).

##Output functions

The idea is that you can have them util.display differently - or not at all - so error messages can be util.displayed in red, meta-data (help., etc) is grey, and debug messages can be turned on and off as required.

Note that not all use the text processor (so if there is an issue with the text processor, we can use the others to report it). Also unit util.tests capture output with msg and io.errormsg, but not debugmsg or headings.

Should all be language neutral

### Function: ` `  ` msg(s, params, cssClass) `  ` ` 

Output a standard message, as an HTML paragraph element (P). The string will first be passed through the text processor. Additional data can be put in the optional params dictionary. You can specify a CSS class to use. During unit util.testing, messages will be saved and util.tested

### Function: ` `  ` msgDiv(arr, params, cssClass) `  ` ` 

As `msg` , but handles an array of strings. Each string is put in its own HTML paragraph, and the set is put in an HTML division (DIV). The cssClass is applied to the division.

### Function: ` `  ` msgList(arr, ordered, params) `  ` ` 

As `msg` , but handles an array of strings in a list. Each string is put in its own HTML list item (LI), and the set is put in an HTML order list (OL) or unordered list (UL), depending on the value of `ordered` .

### Function: ` `  ` msgTable(arr, headings, params) `  ` ` 

As `msg` , but handles an array of arrays of strings in a list. This is laid out in an HTML table. If `headings` is present, this array of strings is used as the column headings.

### Function: ` `  ` msgHeading(s, level, params) `  ` ` 

As `msg` , but the string is presented as an HTML heading (H1 to H6). The level of the heading is determined by `level` , with 1 being the top, and 6 the bottom. Headings are ignored during unit util.testing.

### Function: ` `  ` picture(filename, width, height) `  ` ` 

Output a picture, as an HTML image element (IMG). If width and height are omitted, the size of the image is used. If height is omitted, the height will be proportional to the given width. The file name should include the path. For a local image, that would probably be the images folder, but it could be the web address of an image hosted elsewhere.

### Function: ` `  ` io.failedmsg(s, params) `  ` ` 

Just the same as msg, but adds the "failed" CSS class. This allows failed command responses to be differentiated. Returns the value util. FAILED, allowing commands to give a message and give up

    if (notAllowed) return io.failedmsg("That is not allowed.")

### Function: ` `  ` falsemsg(s, params) `  ` ` 

Just the same as msg, but adds the "failed" CSS class. This allows failed command responses to be differentiated. Returns the value false, allowing commands to give a message and give up

    if (notAllowed) return falsemsg("That is not allowed.")

### Function: ` `  ` io.metamsg(s, params) `  ` ` 

Output a meta-message - a message to inform the player about something outside the game world, such as hints and help messages. The string will first be passed through the text processor. Additional data can be put in the optional params dictionary. During unit util.testing, messages will be saved and util.tested

### Function: ` `  ` io.errormsg(s) `  ` ` 

Output an error message. Use for when something has gone wrong, but not when the player types something odd - if you see this during play, there is a bug in your game (or my code!), it is not the player to blame. During unit util.testing, error messages will be saved and util.tested. Does not use the text processor (as it could be an error in there!).

### Function: ` `  ` parsermsg(s) `  ` ` 

Output a message from the parser indicating the input text could not be parsed. During unit util.testing, messages will be saved and util.tested. Does not use the text processor.

### Function: ` `  ` debugmsg(s) `  ` ` 

Output a debug message. Debug messages are ignored if DEBUG is false and are printed normally during unit util.testing. You should also consider using `console.log` when debugging; it gives a message in the console, and outputs objects and array far better. Does not use the text processor. Does not get spoken allowed.

### Function: ` `  ` io.printOrRun(char, item, attname, options) `  ` ` 

If the given attribute is a string it is printed, if it is a function it is called. Otherwise an error is generated. If isMultiple is true, the object name is prefixed. TODO: util.test array with function

### Function: ` `  ` typeWriter.write(tag, s) `  ` ` 

To output text one character at a time, use `typewriter.write(tag, s)` . The `tag` s the name of the HTML element to use, and will normally be 'p'.

### Function: ` `  ` clearScreen() `  ` ` 

Clears the screen.

### Function: ` `  ` wait(fn) `  ` ` 

Stops outputting whilst waiting for the player to click.

### Function: ` `  ` io.showMenu(title, options, fn) `  ` ` 

Use like this:

     io.showMenu('What is your favourite color?', ['Blue', 'Red', 'Yellow', 'Pink'], function(result) {
       msg("You picked " + result + ".");
     });

## Language Functions

### Function: ` `  ` lang.addDefiniteArticle(item) `  ` ` 

Returns "the " if appropriate for this item. If the item has 'defArticle' it returns that; if it has a proper name, returns an empty string.

### Function: ` `  ` lang.addIndefiniteArticle(item) `  ` ` 

Returns "a " or "an " if appropriate for this item. If the item has 'indefArticle' it returns that; if it has a proper name, returns an empty string. If it starts with a vowel, it returns "an ", otherwise "a ".

### Function: ` `  ` lang.toWords(number) `  ` ` 

Returns the given number in words, so 19 would be returned as 'nineteen'. Numbers uner -2000 and over 2000 are returned as a string of digits, so 2001 is returned as '2001'.

### Function: ` `  ` lang.toOrdinal(number) `  ` ` 

Returns the given number in words as the ordinal, so 19 would be returned as 'nineteenth'. Numbers uner -2000 and over 2000 are returned as a string of digits with 'th' appended, so 2001 is returned as '2001th'.

### Function: ` `  ` lang.conjugate(item, verb) `  ` ` 

Returns the verb properly conjugated for the item, so "go" with a ball would return "goes", but "go" with the player (if using second person pronouns).

### Function: ` `  ` lang.pronounVerb(item, verb, capitalise) `  ` ` 

Returns the pronoun for the item, followed by the conjugated verb, so "go" with a ball would return "it goes", but "go" with the player (if using second person pronouns) would return "you go". The first letter is capitalised if 'capitalise' is true.

### Function: ` `  ` lang.nounVerb(item, verb, capitalise) `  ` ` 

Returns the name for the item, followed by the conjugated verb, so "go" with a ball would return "the ball goes", but "go" with  a some bees would return "the bees go". For the player, (if using second person pronouns) would return the pronoun "you go". The first letter is capitalised if 'capitalise' is true.
