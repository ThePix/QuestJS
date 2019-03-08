This is an experiment in moving Quest, an interactive fiction app, to pure JavaScript. An experimental game can be found [here](http://textadventures.co.uk/games/view/48pkf40on0soigganjtatq/first-steps).

Quest 5 is written in C#, with some Visual Basic, has its own scripting language, ASL, and also uses JavaScript for the UI. For anyone playing on the web version, the game runs on the textadventures.co.uk server. An app that is entirely JavaScript would run in the player's browser. This would mean:

_Better for players_
* No lag between turns
* Game does not time-out

_Better for authors_
* Authors can upload games to their own web site
* Authors are learning/using JavaScript, the computer language of the internet, rather than ASL, which is exclusive to Quest 5.
* Authors can change absolutely anything in the game system; everything is accessible

_Better for me_
* No need to support legacy games in the app (Quest 5 and the web player both have to support every version of Quest 5, and Quest 4 (and I think all the way back to Quest 1).
* Updates are far easier to publish without legacy support

Alex had some experiments into this before he quit. QuestJS was hoped to convert a Quest .quest file to pure JavaScript. QuestKit was supposed to do pretty much the same as I am doing here. Arguably Squiffy is another attempt, being entirely JavaScript, though without a parser.

How far this will get I do not know, but right now it is possible to write a good, well-featured game (as long as you do not mind the lack of an editor).

### Will it be possible to convert existing games?

Short answer: No!

It should be possible to create an additional program that will extract data from the .aslx file to a new game file, but not scripts. As yet, there has been minimal effort towards this.

### Is there an editor?

No. This is something that will be required at some point, but I will not be addressing for a while. It could be written in a cross-platform language such as Java (though as commercial licenses will very soon require payment that is a concern) or Python (if there is a decent UI for Python), though I am currently considering using JavaScript for that too. It would not be designed to run games, you would do that in your browser, which should make it much easier.

How far it will support scripting is questionable. Writing code should be fine, writing in a GUI as in Quest 5 may or may not happen.

Alex was planning something quite different, with the editor entirely on-line, and also in javaScript. To be honest, my JavaScript is not up to that. This will be a disadvantage as it will be a bit of a barrier to new authors. If it is written in JavaScript, moving to a web server should be possible ultimately.

