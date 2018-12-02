This is an experiment in moving Quest, an interactive fiction app, to pure JavaScript.

Quest 5 is written in C#, with some Visual Basic, has its own scripting language, ASL, and also uses JavaScript for the UI. For anyone playing on the web version, the game runs on the textadventures.co.uk server. An app that is entirely JavaScript would run in the player's browser. This would mean:

* No lag between turns
* No need to support legacy games in the app
* Authors can upload games to their own web site

Alex had some experiments into this before he quit. QuestJS was hoped to convert a Quest .quest file to pure JavaScript. QuestKit was pretty much the same objective as this. Arguably Squiffy is another, being entirely JavaScript, though without a parser.

Whether this will get anywhere I do not know, but I am learning about JavaScript a lot!

## Will it be possible to convert existing games?

Short answer: No!

It should be possible to create an additional program that will extract data from the .aslx file to a new game file, but not scripts.


Components
----------

## User Interface

This is where I started, and is pretty much done. There are no status attributes, but that is trivial to add. The panes are on the left, but can be flipped to the right in CSS. It originally used AngularJS, but I ran into promblems, and was using it for so little, it was easier to remove it. It does use JQuery.

page.html
style.css
io.js


## World Model

The world model is a set of objects that define some default behaviour. The world itself is an array of objects of those classes. Objects can override functions in the class to give unique behavior.

Currently objects are references by their name attributes, which are strings. It may be this wants to be changed to be more Quest-like so the ojects are named.

data.js


## Parser

Having had a quick read around, I can find no better way to parse player input than searching through an array of commands and testing regexs. JavaScript supports regexs exactly as Quest does (as far as I can tell), so these can be copied straight across. Translating patterns is not straight forward. For example, "get #object#;take #object#" needs to become /^(get|take) (?<object>.*)$/. Tricking if you have multiple objects.
  
This is in a very early state.

parser.js


## Editor

No progress as yet. It may not be done in JavaScript (how do I save from JS?).

## General functions

util.js
