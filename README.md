This is an experiment in moving Quest, an interactive fiction app, to pure JavaScript.

Quest 5 is written in C#, with some Visual Basic, has its own scripting language, ASL, and also uses JavaScript for the UI. For anyone playing on the web version, the game runs on the textadventures.co.uk server. An app that is entirely JavaScript would run in the player's browser. This would mean:

* No lag between turns
* No need to support legacy games in the app
* Authors can upload games to their own web site
* Updates are far easier to publish without legacy support

Alex had some experiments into this before he quit. QuestJS was hoped to convert a Quest .quest file to pure JavaScript. QuestKit was supposed to do pretty much the same as this. Arguably Squiffy is another attempt, being entirely JavaScript, though without a parser.

Whether this will get anywhere I do not know, but I am learning about JavaScript a lot!

### Will it be possible to convert existing games?

Short answer: No!

It should be possible to create an additional program that will extract data from the .aslx file to a new game file, but not scripts.

### Is there an editor?

No. This is something that will be required at some point, but I will not be addressing for a while. It could be written in a cross-platform language such as Java or Python (if there is a decent UI for Python). It would not be designed to run games, you would do that in your browser, which should make it much easier.

How far it will support scripting is questionable. Writing code should be fine, writing in a GUI as in Quest 5 may or may not happen.

### Language support?

Hopefully it will readily support languages other than English, though I am unsure how that will be done. The current Quest way will probably not work. Currently it is being done via constants in settings.js

### Other features?

Things that I intend to support

- TextProcessor
- Advanced world model

Things I want but as yet have no idea how

- Save/load game
- Change scripts
- UNDO and OOPS

Things that are currently low priority, but probably relatively easy to do yourself

- Timers
- Images, videos, sounds

Things that are currently low priority

- Hyperlinks
- Map
- Walkthrough







Components
----------

### User Interface

This is where I started, and is pretty much done. There are no status attributes, but that is trivial to add. The panes are on the left, but can be flipped to the right in CSS. It originally used AngularJS, but I ran into promblems, and was using it for so little, it was easier to remove it. It does use JQuery.

page.html
style.css
io.js

The panes can be switch or removed, the inventories modified, the compass turned off and the command line turned off in the settings file (see below). You can scroll back though your previous commands. Shift-arrow will move you in the compass direction.


### World Model

The world model is a set of objects that define some default behaviour in world.js. The world itself is an array of objects of those classes. Objects can override functions in the class to give unique behavior.

Currently objects are references by their name attributes, which are strings. It may be this wants to be changed to be more Quest-like so the ojects are named.

data.js
world.js

Requires alternative names.


### Parser

Having had a quick read around, I can find no better way to parse player input than searching through an array of commands and testing regexs. JavaScript supports regexs exactly as Quest does (as far as I can tell), so these can be copied straight across. Translating patterns is not straight forward. For example, "get #object#;take #object#" needs to become /^(get|take) (?<object>.*)$/. Tricking if you have multiple objects.

parser.js

Unlike Quest 5, the parser in context sensitive, and will try to guess what you mean based on the objects present. The parser will get all the commands with a matching Regex, then try and match objects, and score each from that, and will go with the highest scoring. You can add a score to a command to make it higher (or lower) priority.

### Editor

No progress as yet. It may not be done in JavaScript (how do I save from JS?).

### General functions

util.js


### Settings

The user can make changes here to modify how the game looks ad plays. Currently allows the panes to be on the right, left or off; the inventories to be set up, the compass rose to be turned off and labels given. Also a setup function where the title and introduction can be defined, as well as other stuff.

settings.js
