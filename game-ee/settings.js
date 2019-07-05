"use strict";

const TITLE = "Enery Effect";
const AUTHOR = "The Pixie"
const VERSION = "1.0";
const THANKS = [];

// UI options
const PANES = 'Left';  //Can be set to Left, Right or None.
// Setting PANES to None will more than double the speed of your game!
const COMPASS = true;
const DIVIDER = "div.png";

const STATUS_PANE = false;  // Set to false to turn off
const STATUS_WIDTH_LEFT = 120; // How wide the columns are in the status pane
const STATUS_WIDTH_RIGHT = 40;

const USE_DROPDOWN_FOR_CONV = true;

const FAILS_COUNT_AS_TURNS = false;
const LOOK_COUNTS_AS_TURN = false;

const TEXT_INPUT = true;
const CURSOR = ">";
const CMD_ECHO = true;               // echo commands to the screen
const CONVERT_NUMBERS_IN_PARSER = false;


const LANG_FILENAME = "lang-en.js";  // set to the language file of your choice
const DEBUG = true;                  // set to false when releasing
const CUSTOM_EXITS = false;          // set to true to use custom exits, in exits.js
const FILES = ["code", "data"];
const MAX_UNDO = 10;
const ROOM_HEADINGS = true;
const NO_TALK_TO = "TALK TO is not a feature in this game.";
const NO_ASK_TELL = "ASK/TELL ABOUT is not a feature in this game.";

const PARSER_DEBUG = false;      // If true, will report the data the parser outputs
const SPLIT_LINES_ON = "<br>";   // Strings sent to msg will be broken into separate lines

const SECONDS_PER_TURN = 60;
const DATE_TIME_LOCALE = 'en-GB';
const DATE_TIME_START = new Date('February 14, 2019 09:43:00');
const DATE_TIME_OPTIONS = {
  year:"numeric",
  month:"short",
  day:"2-digit",
  hour:"2-digit",
  minute:"2-digit",
};

const ROOM_TEMPLATE = [
  "%",
  "You can see {objects} here.",
  "You can go {exits}.",
];

const STATUS = [
  "hitpoints",
  function() { return "<td>Spell points:</td><td>3</td>"; },
  function() { return "<td>Health points:</td><td>" + game.player.hitpoints + "</td>"; },
  function() { return '<td colspan="2">' + game.player.status + "</td>"; },
];


// Change the name values to alter how items are displayed
// You can add (or remove) inventories too
const INVENTORIES = [
  {name:'Items Held', alt:'itemsHeld', test:isHeldNotWorn, getLoc:function() { return game.player.name; } },
  {name:'Items Worn', alt:'itemsWorn', test:isWorn, getLoc:function() { return game.player.name; } },
  {name:'Items Here', alt:'itemsHere', test:isHere, getLoc:function() { return game.player.loc; } },
];











