This is a full re-write of Quest, an interactive fiction app, to pure JavaScript. An experimental game can be found [here](http://textadventures.co.uk/games/view/48pkf40on0soigganjtatq/first-steps).

Quest 5 is written in C#, with some Visual Basic, has its own scripting language, ASL, and also uses JavaScript for the UI. Players can either download a dedicated player/editor or use the web version, in the latter case the game runs on the textadventures.co.uk server. In contrast, Quest 6 is written entirely JavaScript, and runs in the player's browser. This means:

_Better for players_
* No lag between turns
* Game does not time-out
* Saved games will play in the latest version of the game

_Better for authors_
* Authors can upload games to their own web site
* Authors are learning/using JavaScript, the computer language of the internet, rather than ASL, which is exclusive to Quest 5
* Authors can change absolutely anything in the game system; everything is accessible
* Authors can create games on Linux and Mac, as well as Windows

_Better for me_
* No need to support legacy games in the app (the Quest 5 player/editor and the web player both have to support every version of Quest 5, and Quest 4 - and I think all the way back to Quest 1)

Alex had some experiments into this before he quit. QuestJS was hoped to convert a Quest .quest file to pure JavaScript. QuestKit was supposed to do pretty much the same as I am doing here. Arguably Squiffy is another attempt, being entirely JavaScript, though without a parser.


### Is there an editor?

No, but it is under development. It is in another repository [here](https://github.com/ThePix/QEdit/wiki), so go there to learn more on how that is going.

However, you do not need a dedicated editor to create games, and the Wiki includes a tutorial that will take you through how you can already create a game.


### Will it be possible to convert existing games?

Originally the answer was a definite no, however during developmenmt of the editor it became apparent that an XML file would be good to support blockly, so I have changed my position somewhat. The editor will now convert most things, but not ASL code currently.


### What does it look like?

This is what the code for Quest 6 looks like. It creates a player, two rooms and a hat.

```javascript
createItem("me", PLAYER(), { 
  loc:"lounge",
  regex:/^(me|myself|player)$/,
  examine:'Just a regular guy',
})


createRoom("lounge", {
  desc:'A small room with an [old settee:couch:sofa] and a [tv:telly].',
  east:new Exit('kitchen'),
})


createRoom("kitchen", {
  desc:"The kitchen looks clean and well-equipped.",
  afterFirstEnter:function() {
    msg("You can smell freshly baked bread!")
  },
  west:new Exit("lounge"),
})


createItem("hat", WEARABLE(), {
  examine:"It is straw boater, somewhat the worse for wear.",
  loc:"lounge",
})
```
