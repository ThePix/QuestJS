# Docs

<!-- TOC -->

- [Docs](#docs)
  - [World Functions](#world-functions)
    - [`createItem()`](#createitem)
    - [`createRoom()`](#createroom)
    - [`cloneObject()`](#cloneobject)
    - [`createObject()`](#createobject)
  - [General Utility Functions](#general-utility-functions)
    - [`firsttime()`](#firsttime)
  - [Random Functions](#random-functions)
    - [`randomInt()`](#randomint)
    - [`randomChance()`](#randomchance)
    - [`randomFromArray()`](#randomfromarray)
    - [`diceRoll()`](#diceroll)
  - [String Functions](#string-functions)
    - [`sentenceCase()`](#sentencecase)
    - [`spaces()`](#spaces)
    - [`prefix()`](#prefix)
    - [`formatList()`](#formatlist)
      - [Options](#options)
    - [`listProperties()`](#listproperties)
    - [`toRoman()`](#toroman)
    - [`getDateTime()`](#getdatetime)
    - [`displayMoney()`](#displaymoney)
    - [`displayNumber()`](#displaynumber)
    - [`getDir()`](#getdir)
  - [Array (List) Functions](#array-list-functions)
    - [`arraySubtract()`](#arraysubtract)
    - [`arrayCompare()`](#arraycompare)
    - [`arrayRemove()`](#arrayremove)
    - [`arrayFilterByAttribute()`](#arrayfilterbyattribute)
  - [Scope Functions](#scope-functions)
    - [`scopeReachable()`](#scopereachable)
    - [`scopeHeldBy()`](#scopeheldby)
    - [`scopeHereListed()`](#scopeherelisted)
  - [The Respond Function](#the-respond-function)
    - [`respond()`](#respond)
  - [The Text Processor Function](#the-text-processor-function)
    - [`processText()`](#processtext)
  - [Output functions](#output-functions)
    - [`msg()`](#msg)
    - [`msgDiv()`](#msgdiv)
    - [`msgList()`](#msglist)
    - [`msgTable()`](#msgtable)
    - [`msgHeading()`](#msgheading)
    - [`picture()`](#picture)
    - [`failedmsg()`](#failedmsg)
    - [`falsemsg()`](#falsemsg)
    - [`metamsg()`](#metamsg)
    - [`errormsg()`](#errormsg)
    - [`parsermsg()`](#parsermsg)
    - [`debugmsg()`](#debugmsg)
    - [`printOrRun()`](#printorrun)
    - [`typeWriter.write()`](#typewriterwrite)
    - [`clearScreen()`](#clearscreen)
    - [`wait()`](#wait)
    - [`showMenu()`](#showmenu)
  - [Language Functions](#language-functions)
    - [`lang.addDefiniteArticle()`](#langadddefinitearticle)
    - [`lang.addIndefiniteArticle()`](#langaddindefinitearticle)
    - [`lang.toWords()`](#langtowords)
    - [`lang.toOrdinal()`](#langtoordinal)
    - [`lang.conjugate()`](#langconjugate)
    - [`lang.pronounVerb()`](#langpronounverb)
    - [`lang.nounVerb()`](#langnounverb)

<!-- /TOC -->

## World Functions

These are functions for creating objexts inthe game world


### `createItem()`

Use this to create a new item (as opposed to a room). It adds various defaults that
apply only to items. The first argument should be a string - a unique name for
this object, composed only of letters, numbers and underscores. It will then
take any number of dictionaries that will be combined to set the properties.
Generally objects should not be created during play as they will not be
saved properly. Either keep the object hodden until required or clone existing objects.


### `createRoom()`

Use this to create a new room (as opposed to an item). It adds various defaults that
apply only to items The first argument should be a string - a unique name for
this object, composed only of letters, numbers and underscores. It will than
take any number of dictionaries that will be combined to set the properties.
Generally objects should not be created during play as they will not be
saved properly. Either keep the object hodden until required or clone existing objects.


### `cloneObject()`

Use this to create new items during play. The given item will be cloned at
the given location. The `newName` isoptional, one will be generated if not
supplied. If you do supply one bear inmid that every clone must have a unique name.


### `createObject()`

Creates a basic object. Generally it is better to use CreateItem or CreateRoom.


## General Utility Functions

### `firsttime()`

~~This is an attempt to mimic the firsttime functionality of Quest 5.
Unfortunately, JavaScript does not lend itself well to that!~~  
*EDIT: It does actually. Will be porpperly added.*  
If this is the first time the give `id` has been encountered, the
`first` function will be run. Otherwise the `other` function will be run, if given.

```js
firstime(342, function() {
    msg("This was the first time.")
  }, function() {
    msg("This was NOT the first time.")
  })
```


## Random Functions

### `randomInt()`

Returns a random number from 0 to n1, or n1 to n2, inclusive.


### `randomChance()`

Returns true 'percentile' times out of 100, false otherwise.


### `randomFromArray()`

Returns a random element from the array, or null if it is empty If the
second parameter is true, then the selected value is also deleted from the array,
preventing it from being selected a second time


### `diceRoll()`

Returns a random number based on the standard RPG dice notation.
For example 2d6+3 means roll two six sided dice and add three. Returns null if
the string cannot be interpreted.


## String Functions

### `sentenceCase()`

Returns the string with the first letter capitalised


### `spaces()`

Returns a string with the given number of hard spaces. Browsers collapse
multiple white spaces to just show one, so you need to use hard spaces (NBSPs) if
you want several together.


### `prefix()`

If isMultiple is true, returns the item name, otherwise nothing. This is
useful in commands that handle multiple objects, as you can have this at
the start of the response string. For example, if the player does GET BALL,
the response might be "Done". If she does GET ALL, then the response for
the ball needs to be "Ball: Done". In the command, you can
have `msg(prefix(item, isMultiple) + "Done"), and it is sorted.


### `formatList()`

Creates a string from an array. If the array element is a string, that is used,
if it is an item, its byname is used (and passed the `options` ). Items are
sorted alphabetically, based on the "name" attribute.

#### Options

- article: DEFINITE (for "the") or INDEFINITE (for "a"), defaults to none (see byname)
- sep: separator (defaults to comma)
- lastJoiner: separator for last two items (just separator if not provided); you should
  include any spaces (this allows you to have a comma and "and", which is obviously wrong,
  but some people like it)
- modified: item aliases modified (see byname) (defaults to false)
- nothing: return this if the list is empty (defaults to empty string)
- count: if this is a number, the name will be prefixed by that (instead of the article)
- doNotSort if true the list isnot sorted
- separateEnsembles:  if true, ensembles are listed as the separate items

For example:

```js
formatList(listOfOjects, {
    def: "a",
    joiner: " and"
}) // > "a hat, Mary and some boots"

formatList(list, {
    joiner: " or",
    nothing: "nowhere"
}) // > north, east or up
```

Note that you can add further options for your own game, and then write your own byname function that uses it.


### `listProperties()`

Lists the properties of the given object; useful for debugging only. To inspect an object use JSON.stringify(obj)


### `toRoman()`

Returns the given number as a string in Roman numerals.


### `getDateTime()`

Returns the game time as a string. The game time is game.elapsedTime seconds after game.startTime.


### `displayMoney()`

Returns the given number as a string formatted as money. The formatting is defined by MONEY_FORMAT.


### `displayNumber()`

Returns the given number as a string formatted as per the control string.
The control string is made up of five parts. The first is a sequence of
characters that are not digits that will be added to the start of the string,
and is optional. The second is a sequence of digits and it the number of
characters left of the decimal point; this is padded with zeros to make it
longer. The third is a single non-digit character; the decimal marker.
The fourth is a sequence of digits and it the number of characters right of the
decimal point; this is padded with zeros to make it longer. The fifth is a
sequence of characters that are not digits that will be added to the end of
the string, and is optional.


### `getDir()`

Converts the string to the standard direction name, so "down", "dn" and "d"
will all return "down". Uses the EXITS array, so language neutral.


## Array (List) Functions

### `arraySubtract()`

Returns a new array, derived by subtracting each element in b from the array a.
If b is not an array, then b itself will be removed. Unit tested.


### `arrayCompare()`

Returns true if the arrays a and b are equal. They are equal if both are
arrays, they have the same length, and each element in order is the same.
Assumes a is an array, but not b. Unit tested


### `arrayRemove()` 

Removes the element el from the array, ary. Unlike arraySubtract,
no new array is created; the original aray is modified, and nothing is returned.


### `arrayFilterByAttribute()`

Returns a new array based on ary, but including only those objects for which
the attribute attName is equal to value. To filter for objects that do not
have the attribute you can filter for the value undefined.


## Scope Functions

### `scopeReachable()`

Returns an array of objects the player can currently reach and see.


### `scopeHeldBy()`

Returns an array of objects held by the given character.


### `scopeHereListed()`

Returns an array of objects at the player's location that can be seen.


## The Respond Function

### `respond()`

Searchs the given list for a suitable response, according to the given params,
and runs that response. This is a big topic, see [here] for more.

[here](https://github.com/ThePix/QuestJS/wiki/The-respond-function)
"Link to docs"


## The Text Processor Function

### `processText()`

Returns a string in which all the text processor directives have been resolved,
using the optionasl parameters. More details [here].

[here](https://github.com/ThePix/QuestJS/wiki/The-Text-Processor)
"link to docs"


## Output functions

The idea is that you can have them display differently - or not at all - so
error messages can be displayed in red, meta-data (help., etc) is grey, and
debug messages can be turned on and off as required.

Note that not all use the text processor (so if there is an issue with
the text processor, we can use the others to report it). Also unit tests
capture output with msg and errormsg, but not debugmsg or headings.

Should all be language neutral


### `msg()`

Output a standard message, as an HTML paragraph element (P). The string will
first be passed through the text processor. Additional data can be put in the
optional params dictionary. You can specify a CSS class to use. During
unit testing, messages will be saved and tested


### `msgDiv()`

As `msg` , but handles an array of strings. Each string is put in its own
HTML paragraph, and the set is put in an HTML division (DIV).
The cssClass is applied to the division.


### `msgList()`

As `msg` , but handles an array of strings in a list. Each string is put in its own
HTML list item (LI), and the set is put in an HTML order list (OL) or unordered
list (UL), depending on the value of `ordered` .


### `msgTable()`

As `msg` , but handles an array of arrays of strings in a list. This is laid
out in an HTML table. If `headings` is present, this array of strings is used
as the column headings.


### `msgHeading()`

As `msg` , but the string is presented as an HTML heading (H1 to H6).
The level of the heading is determined by `level` , with 1 being the top, and 6
the bottom. Headings are ignored during unit testing.


### `picture()`

Output a picture, as an HTML image element (IMG). If width and height are omitted,
the size of the image is used. If height is omitted, the height will be
proportional to the given width. The file name should include the path.
For a local image, that would probably be the images folder, but it could be
the web address of an image hosted elsewhere.


### `failedmsg()`

Just the same as msg, but adds the "failed" CSS class. This allows
failed command responses to be differentiated. Returns the value FAILED,
allowing commands to give a message and give up

```js
if (notAllowed) {
    return failedmsg("That is not allowed.")
}
```

### `falsemsg()`

Just the same as msg, but adds the "failed" CSS class. This allows failed
command responses to be differentiated. Returns the value false,
allowing commands to give a message and give up

```js
    if (notAllowed) {
        return falsemsg("That is not allowed.")
    }
```


### `metamsg()`

Output a meta-message - a message to inform the player about something outside
the game world, such as hints and help messages. The string will first be
passed through the text processor. Additional data can be put in the optional
params dictionary. During unit testing, messages will be saved and tested


### `errormsg()`

Output an error message. Use for when something has gone wrong, but not when
the player types something odd - if you see this during play, there is a bug in
your game (or my code!), it is not the player to blame. During unit testing,
error messages will be saved and tested. Does not use the text processor
(as it could be an error in there!).


### `parsermsg()`

Output a message from the parser indicating the input text could not be parsed.
During unit testing, messages will be saved and tested. Does not use the text processor.


### `debugmsg()`

Output a debug message. Debug messages are ignored if DEBUG is false and are
printed normally during unit testing. You should also consider using `console.log`
when debugging; it gives a message in the console, and outputs objects and array
far better. Does not use the text processor. Does not get spoken allowed.


### `printOrRun()`


If the given attribute is a string it is printed, if it is a function it is called.
Otherwise an error is generated. It isMultiple is true, the object name is prefixed.
TODO: test array with function


### `typeWriter.write()`

To output text one character at a time, use `typewriter.write(tag, s)` .
The `tag` s the name of the HTML element to use, and will normally be 'p'.


### `clearScreen()`

Clears the screen.


### `wait()`

Stops outputting whilst waiting for the player to click.


### `showMenu()`

Use like this:

```js
showMenu('What is your favourite color?', [
  'Blue', 'Red', 'Yellow', 'Pink'
  ], function(result) {
    msg("You picked " + result + ".")
})
```


## Language Functions

### `lang.addDefiniteArticle()`

Returns "the " if appropriate for this item. If the item has
'defArticle' it returns that; if it has a proper name, returns an empty string.


### `lang.addIndefiniteArticle()`

Returns "a " or "an " if appropriate for this item. If the item has
'indefArticle' it returns that; if it has a proper name, returns an empty string.
If it starts with a vowel, it returns "an ", otherwise "a ".


### `lang.toWords()`

Returns the given number in words, so 19 would be returned as 'nineteen'.
Numbers uner -2000 and over 2000 are returned as a string of digits, so 2001 is returned as '2001'.


### `lang.toOrdinal()`

Returns the given number in words as the ordinal, so 19 would be returned as
'nineteenth'. Numbers uner -2000 and over 2000 are returned as a string of
digits with 'th' appended, so 2001 is returned as '2001th'.


### `lang.conjugate()`

Returns the verb properly conjugated for the item, so "go" with a ball would
return "goes", but "go" with the player (if using second person pronouns).


### `lang.pronounVerb()`

Returns the pronoun for the item, followed by the conjugated verb, so
"go" with a ball would return "it goes", but "go" with the player
(if using second person pronouns) would return "you go". The first letter is
capitalised if 'capitalise' is true.


### `lang.nounVerb()`

Returns the name for the item, followed by the conjugated verb, so
"go" with a ball would return "the ball goes", but "go" with  a some bees would
return "the bees go". For the player, (if using second person pronouns) would
return the pronoun "you go". The first letter is capitalised if 'capitalise' is true.
