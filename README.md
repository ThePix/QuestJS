# QuestJS

This is an experiment in moving Quest, an interactive fiction app, to pure JavaScript. An experimental game can be found [here](http://textadventures.co.uk/games/view/48pkf40on0soigganjtatq/first-steps).

Quest 5 is written in C#, with some Visual Basic, has its own scripting language, ASL, and also uses JavaScript for the UI. For anyone playing on the web version, the game runs on the textadventures.co.uk server. An app that is entirely JavaScript would run in the player's browser. This would mean:

### Better for players

* No lag between turns
* Game does not time-out

### Better for authors

* Authors can upload games to their own web site
* Authors are learning/using JavaScript, the computer language of the internet, rather than ASL, which is exclusive to Quest 5.
* Authors can change absolutely anything in the game system; everything is accessible
* Authors can create games on Linus and Mac, m as well as Windows

### Better for me

* No need to support legacy games in the app (Quest 5 and the web player both have to support every version of Quest 5, and Quest 4 (and I think all the way back to Quest 1).
* Updates are far easier to publish without legacy support

Alex had some experiments into this before he quit. QuestJS was hoped to convert a Quest .quest file to pure JavaScript. QuestKit was supposed to do pretty much the same as I am doing here. Arguably Squiffy is another attempt, being entirely JavaScript, though without a parser.

How far this will get I do not know, but right now it is possible to write a good, well-featured game (as long as you do not mind the lack of an editor).

### Is there an editor?

No, but it is under development. It is in another repository [here](https://github.com/ThePix/QEdit/wiki), so go there to learnm more on how that is going.

### Will it be possible to convert existing games?

Originally the answer was a definite no, however during developmenmt of the editor it became apparent that an XML file would be good to support blockly, so I have changed my position somewhat. The editor will now convert most things, but not ASL code currently.
