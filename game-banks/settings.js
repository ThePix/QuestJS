"use strict";

settings.title = "The Voyages of The Joseph Banks"
settings.author = "The Pixie"
settings.version = "0.1"
settings.thanks = ["Kyle", "Lara"]

// UI options
settings.divider = "div4.png"

settings.customExits = 'exits'
settings.files = ["code", "data", "npcs"]
settings.noTalkTo = "You can talk to an NPC using either {color:red:ASK [name] ABOUT [topic]} or {color:red:TELL [name] ABOUT [topic]}."
settings.noAskTell = false
settings.givePlayerAskTellMsg = false
settings.splitLinesOn = "|"

settings.dateTime.start = new Date('April 14, 2387 09:43:00')
settings.roomTemplate = [
  "%",
  "{objectsHere:You can see {objects} here.}",
]

settings.status = [
  function() { return "<td colspan=\"2\" align=\"center\">" + getDateTime() + "</td>"; },
  function() { return "<td width=\"100px\"><b><i>Bonus:</i></b></td><td width=\"30px\" align=\"right\"><b>$" + game.player.bonus + "k</b></td>"; },
  function() { return "<td colspan=\"2\" align=\"center\"> </td>"; },
  function() { return "<td><i>You:</i></td><td align=\"right\">" + game.player.status + "%</td>"; },
  function() { return "<td><i>Ship:</i></td><td align=\"right\">" + w.Xsansi.status + "%</td>"; },
  function() { return "<td><i>Ha-yoon:</i></td><td align=\"right\">" + displayStatus(w.Ha_yoon) + "</td>"; },
  function() { return "<td><i>Kyle:</i></td><td align=\"right\">" + displayStatus(w.Kyle) + "</td>"; },
  function() { return "<td><i>Ostap:</i></td><td align=\"right\">" + displayStatus(w.Ostap) + "</td>"; },
  function() { return "<td><i>Aada:</i></td><td align=\"right\">" + displayStatus(w.Aada) + "</td>"; },
];



function displayStatus(obj) {
  if (typeof obj.status === "string") return obj.status;
  return obj.status + "%";
}

// Change the name values to alter how items are displayed
// You can add (or remove) inventories too
settings.inventories = [
//  {name:'Items Held', alt:'itemsHeld', test:util.isHeldNotWorn, getLoc:function() { return game.player.name; } },
//  {name:'Items Here', alt:'itemsHere', test:util.isHere, getLoc:function() { return game.player.loc; } },
];




const ooc_intro = "<p>You are on a mission to survey planets around five stars, the captain of a crew of five (including yourself). There is also a computer system, Xsansi (you can also use \"AI\" or \"computer\"), that you can talk to anywhere on the ship. </p><p>Your objective is to maximise your bonus. Collecting data will give a bonus, but geo-data about planets suitable for mining and bio-data about planets suitable for colonisation will give higher bonuses. Evidence of alien intelligence will be especially rewarding!</p><p>You have just arrived at your first destination after years in a \"stasis\" pod in suspended animation. ASK AI ABOUT MISSION or CREW might be a good place to start, once you have created your character. Later you want to try OSTAP, LAUNCH PROBE or ASK AADA ABOUT PLANET.";



// This function will be called at the start of the game, so can be used
// to introduce your game.
settings.setup = function() {

  //parser.parse("spoken");
  //  parser.parse("l");
   
  //showStartDiag();
 
  //console.log(getDateTime());
  
  //for(let key in w) {
  //  debugmsg(key);
  //}
  arrival();  
  
}


















settings.startingDialogDisabled = true
const professions = [
  {name:"Engineer", bonus:"mech"},
  {name:"Scientist", bonus:"science"},
  {name:"Medical officer", bonus:"medicine"},
  {name:"Soldier", bonus:"combat"},
  {name:"Computer specialist", bonus:"computers"},
  {name:"Dancer", bonus:"agility"},
  {name:"Advertising exec", bonus:"deceit"},
  {name:"Urban poet", bonus:"deceit"},
];

const backgrounds = [
  {name:"Bored dilettante", bonus:"mech"},
  {name:"Wannabe explorer", bonus:"science"},
  {name:"Fame-seeker", bonus:"medicine"},
  {name:"Debtor", bonus:"combat"},
  {name:"Criminal escaping justice", bonus:"computers"},
];


$(function() {
  if (settings.startingDialogDisabled) {
    w.me.job = professions[0].name;
    w.me.jobBonus = professions[0].bonus;
    w.me.isFemale = true;
    w.me.fullname = "Shaala";
    return; 
  }
  const diag = $("#dialog");
  diag.prop("title", "Who are you?");
  let s = ooc_intro;
  s += '<p>Name: <input id="namefield" type="text" value="Ariel" /></p>';
  s += '<p>Male: <input type="radio" id="male" name="sex" value="male">&nbsp;&nbsp;&nbsp;&nbsp;';
  s += 'Female<input type="radio" id="female" name="sex" value="female" checked></p>';
  s += '<p>Profession: <select id="job">'
  for (let i = 0; i < professions.length; i++) {
    s += '<option value="' + professions[i].name + '">' + professions[i].name + '</option>';
  }
  s += '</select></p>';
  //s += '<p>Background: <select id="background">'
  //for (let i = 0; i < backgrounds.length; i++) {
  //  s += '<option value="' + backgrounds[i].name + '">' + backgrounds[i].name + '</option>';
  //}
  s += '</select></p>';
  
  diag.html(s);
  diag.dialog({
    modal:true,
    dialogClass: "no-close",
    width: 560,
    height: 550,
    buttons: [
      {
        text: "OK",
        click: function() {
          $(this).dialog("close");
          let p = game.player;
          const jobName = $("#job").val();
          const job = professions.find(function(el) { return el.name === jobName; });
          w.me.job = job.name;
          w.me.jobBonus = job.bonus;
          //w.me.background = backgrounds.find(function(el) { return el.name === background; });
          w.me.isFemale = $("#female").is(':checked');
          w.me.fullname = $("#namefield").val();
          if (settings.textInput) { $('#textbox').focus(); }
        }
      }
    ]
  });
  setTimeout(function() { 
    $('#namefield').focus();
  }, 10);
});


