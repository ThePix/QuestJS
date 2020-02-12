"use strict";

// About your game
const TITLE = "Your new game";
const AUTHOR = "Your name here"
const VERSION = "0.1";
const THANKS = [];


// The side panes
const PANES = 'Left';             //Can be set to Left, Right or None (setting PANES to None will more than double the speed of your game!)
const COMPASS = true;             // Set to true to have a compass display
const DIVIDER = "div.png";        // Image used to divide the panes at the side; set to false if not used
const STATUS_PANE = "Status";     // Title of the panel; set to false to turn off
const STATUS_WIDTH_LEFT = 120;    // How wide the left column is in the status pane
const STATUS_WIDTH_RIGHT = 40;    // How wide the right column is in the status pane
const STATUS = [
  function() { return "<td>Health points:</td><td>" + game.player.hitpoints + "</td>"; },
];
const INVENTORIES = [
  {name:'Items Held', alt:'itemsHeld', test:util.isHeldNotWorn, getLoc:function() { return game.player.name; } },
  {name:'Items Worn', alt:'itemsWorn', test:util.isWorn, getLoc:function() { return game.player.name; } },
  {name:'Items Here', alt:'itemsHere', test:util.isHere, getLoc:function() { return game.player.loc; } },
];


// Other UI settings
const ROOM_HEADINGS = true;       // Print the room name as a title when the player enters a room
const DROPDOWN_FOR_CONV = true;   // Dynamic (TALK TO) conversations will present as a drop-down if true, hyperlinks otherwise
const TEXT_INPUT = true;          // Allow the player to type commands
const CURSOR = ">";               // The cursor, obviously
const CMD_ECHO = true;            // Commands are printed to the screen
const TYPEWRITER = true;          // Text is displayed one character at a time, with a delay of TYPEWRITER_DELAY millisecond between each
const TYPEWRITER_DELAY = 25       // and a delay of TYPEWRITER_DELAY_LINE milliseconds at the end of a line
const TYPEWRITER_DELAY_LINE = 100;
const ROOM_TEMPLATE = [
  "%",
  "{objectsHere:You can see {objects} here.}",
  "{exitsHere:You can go {exits}.}",
];


// Files
const LANG_FILENAME = "lang-en.js";  // Set to the language file of your choice
const CUSTOM_EXITS = false;          // Set to true to use custom exits, in exits.js
const FILES = ["code", "data"];      // Additional files to load


// Conversations settings
const NO_TALK_TO = "TALK TO is not a feature in this game.";
const NO_ASK_TELL = "ASK/TELL ABOUT is not a feature in this game.";
const TURNS_QUESTIONS_LAST_TURN = 5;
const GIVE_PLAYER_SAY_MSG = true;
const GIVE_PLAYER_ASK_TELL_MSG = true;


// Other game play settings
const FAILS_COUNT_AS_TURNS = false;
const LOOK_COUNTS_AS_TURN = false;
const NPC_REACTIONS_AWAYS = false;
const INTRO = "This is my first Quest 6 game.";
const SAVE_DISABLED = false;  // When save is disabled, objects can be created during game play


// Date and time settings
const SECONDS_PER_TURN = 60;
const DATE_TIME_START = new Date('February 14, 2019 09:43:00');
const DATE_TIME_LOCALE = 'en-GB';
const DATE_TIME_OPTIONS = {
  year:"numeric",
  month:"short",
  day:"2-digit",
  hour:"2-digit",
  minute:"2-digit",
};


// Other settings
const SPLIT_LINES_ON = "<br>";           // Strings sent to msg will be broken into separate lines
const CONVERT_NUMBERS_IN_PARSER = false; // The parser will convert "two" to 2" in player input (can slow down the game)
const DEBUG = true;                      // set to false when releasing to disable debugging commands
const MAX_UNDO = 10;







