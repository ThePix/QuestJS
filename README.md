This is an experiment in moving Quest, an interactive fiction app, to pure JavaScript.

Quest 5 is written in C#, with some Visual Basic, has its own scripting language, ASL, and also uses JavaScript for the UI, with the game saved in XML. For anyone playing on the web version, the game runs on the textadventures.co.uk server. In contrast, this would be an app that is entirely JavaScript and would run in the player's browser. This would mean:

* No lag between turns
* No time-out f the player in inactive 30 minutes
* No need to support legacy games in the app
* Authors can upload games to their own web site
* Updates are far easier to publish without legacy support

Alex had some experiments into this before he quit. QuestJS was hoped to convert a Quest .quest file to pure JavaScript. QuestKit was supposed to do pretty much the same as this. Arguably Squiffy is another attempt, being entirely JavaScript, though without a parser.


### What is the current status?

As of 23/Dec/18, you can create a decent playable game. The only big omission is the inability to save.


### Will it be possible to convert existing games?

Short answer: No!

It should be possible to create an additional program that will extract data from the .aslx file to a new game file, but not scripts.


### Is there an editor?

No. This is something that will be required at some point, but I will not be addressing for a while. It could be written in a cross-platform language such as Java or Python (if there is a decent UI for Python). It would not be designed to run games, you would do that in your browser, which should make it much easier.

How far it will support scripting is questionable. Writing code should be fine, writing in a GUI as in Quest 5 may or may not happen.
