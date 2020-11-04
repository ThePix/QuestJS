"use strict";

settings.title = "A First RPG...";
settings.author = "The Pixie"
settings.version = "1.1";
settings.thanks = ["Kyle", "Lara"];

settings.libraries.push('rpg')

settings.statusPane = false;
settings.tests = true
settings.playMode = 'dev'
settings.attackOutputLevel = 2
settings.armourScaling = 10
settings.noTalkTo = false
settings.output = function(report) {
  for (let el of report) {
    if (el.level <= settings.attackOutputLevel) {
      if (el.level === 1) {
        msg(el.t)
      }
      else {
        metamsg(el.t)
      }
    }
  }
}


// This function will be called at the start of the game, so can be used
// to introduce your game.
settings.setup = function() {
  game.player.hitpoints = 20;
  game.player.status = "You are feeling fine";
  game.player.skillsLearnt = ["Double attack", "Fireball"]

  settings.updateCustomUI()
  
}







settings.customUI = function() {
  document.writeln('<div id="rightpanel" class="side-panes side-panes-right">');
  document.writeln('<div id="rightstatus">');
  document.writeln('<table align="center">');
  document.writeln('<tr><td width="120"><b>Current weapon</b></td></tr>');
  document.writeln('<tr><td id="weapon-td"><img id="weaponImage" onclick="skillUI.chooseWeapon();"/></td></tr>');
  document.writeln('<tr><td><b>Health</b></td></tr>');
  document.writeln('<tr><td style="border: thin solid black;background:white;text-align:left;\" title="Your current hits" id="hits-td"><span id="hits-indicator" style="background-color:green;padding-right:100px;"></span></td></tr>');
  document.writeln('<tr><td><b>Spell points</b></td></tr>');
  document.writeln('<tr><td style="border: thin solid black;background:white;text-align:left;\" title="Your current PP" id="pp-td"><span id="pp-indicator" style="background-color:blue;padding-right:100px;"></span></td></tr>');
  document.writeln('<tr><td><b>Armour</b></td></tr>');
  document.writeln('<tr><td style="border: thin solid black;background:white;text-align:left;\" title="Your current armour" id="armour-td"><span id="armour-indicator" style="background-color:red;padding-right:100px;"></span></td></tr>');
  document.writeln('</table>');
  document.writeln('</div>');

  document.writeln('<div style="text-align:center"><input type="button" id="castButton" text="Cast" value="Cast" onclick="skillUI.castButtonClick()" style="width: 80px" disabled="yes"/></div>');

  document.writeln('<table align="center">');
  for (let row = 0; row < 8; row++) {
    document.writeln('  <tr>');
    for (let col = 0; col < 3; col++) {
      document.write(`    <td id="cell${row * 3 + col}" width="40"></td>`);
    }
    document.writeln('  </tr>');
  }
  document.writeln('</table>');
  document.writeln('</div>');
  
  document.writeln('<div id="choose-weapon-div" title="Select a weapon">');
  document.writeln('<select id="weapon-select"></select>');
  document.writeln('</div>');
  $(function() {
    $( "#choose-weapon-div" ).dialog({
      autoOpen: false,  
      buttons: {
        OK: function() { skillUI.chosenWeapon() }
      },
    });
  });
};  


settings.updateCustomUI = function() {
  $('#weaponImage').attr('src', settings.imagesFolder + 'icon-' + game.player.getEquippedWeapon().image + '.png');
  $('#weapon-td').prop('title', "Weapon: " + game.player.getEquippedWeapon().alias);
  
  $('#hits-indicator').css('padding-right', 120 * game.player.health / game.player.maxHealth);
  $('#hits-td').prop('title', "Hits: " + game.player.health + "/" + game.player.maxHealth);

  $('#pp-indicator').css('padding-right', 120 * game.player.pp / game.player.maxPP);
  $('#pp-td').prop('title', "Power points: " + game.player.pp + "/" + game.player.maxPP);

  $('#armour-indicator').css('padding-right', 120 * game.player.armour / game.player.maxArmour);
  $('#armour-td').prop('title', "Armour: " + game.player.armour + "/" + game.player.maxArmour);

  //console.log($('#hits-td').prop('title'));


  //console.log(game.player.skillsLearnt)
  skillUI.removeAllButtons()
  for (let skill of skills.list) {
    //console.log(skill.name)
    if (game.player.skillsLearnt.includes(skill.name)) {
      skillUI.setButton(skill)
    }
  }
  for (let key in w) {
    if (w[key].health !== undefined && w[key].maxHealth === undefined) {
      w[key].maxHealth = w[key].health;
    }
  }
};






const skillUI = {
  skills:[],
  selected:false,
  
  setButton:function(skill) {
    if (!skill.icon) skill.icon = skill.name.toLowerCase()
    const cell = $('#cell' + skillUI.skills.length)
    let s = '<div class="skill-container" title="' + skill.tooltip + '" >'
    s += '<img class="skill-image" src="' + settings.imagesFolder + 'icon-' + skill.icon + '.png"/>'
    if (skill.spell) s += '<img class="skill-image" src="' + settings.imagesFolder + 'flag-spell.png"/>'
    s += '</div>'
    cell.html(s)
    cell.click(skillUI.buttonClickHandler)
    cell.css("background-color", "black")
    cell.css("padding", "2px")
    cell.attr("name", skill.name)
    skillUI.skills.push(skill)
  },

  resetButtons:function() {
    //console.log('reset')
    for (let i = 0; i < skillUI.skills.length; i++) {
      $('#cell' + i).css("background-color", "black");
    }
    $('#castButton').prop('disabled', true)
    skillUI.selected = false
  },


  removeAllButtons:function() {
    for (let i = 0; i < skillUI.skills.length; i++) {
      $('#cell' + i).html("")
    }
    skillUI.skills = []
    $('#castButton').prop('disabled', true)
    skillUI.selected = false
  },

  buttonClickHandler:function(event) {
    console.log(event)
    skillUI.resetButtons()
    
    const n = parseInt(event.currentTarget.id.replace('cell', ''))
    console.log(n)
    skillUI.selected = n
    const cell = $("#cell" + n)
    cell.css("background-color", "yellow")
    const skill = skillUI.skills[n]
    if (skill.noTarget) $('#castButton').prop('disabled', false)
  },

  getSkillFromButtons:function() {
    return skillUI.selected ? skillUI.skills[skillUI.selected] : null
  },
  
  castButtonClick:function() {
    console.log("CKLOICK!!!")
    console.log("CKLOICK!!! " + skillUI.selected)
    console.log("CKLOICK!!! " + skillUI.skills)
    console.log("CKLOICK!!! " + skillUI.skills[skillUI.selected].name)
  },


  chooseWeapon:function() {
    console.log("in chooseWeapon");
    const weapons = [];
    for (let o in w) {
      if (w[o].isAtLoc(game.player, world.SCOPING) && w[o].weapon) {
        console.log(o);
        weapons.push('<option value="'+ o +'">' + w[o].listalias + '</option>');
      }
    }
    const s = weapons.join('');
    console.log(s);

    $('#weapon-select').html(s);  
    
    $("#choose-weapon-div").dialog("open");
  },

  chosenWeapon:function() {
    $("#choose-weapon-div").dialog("close");
    const selected = $("#weapon-select").val();
    console.log("in chosenWeapon: " + selected);
    w[selected].equip(false, game.player);
    world.endTurn(world.SUCCESS);
  },

}








settings.startingDialogDisabled = true;

settings.professions = [
  {name:"Farm hand", bonus:"strength"},
  {name:"Scribe", bonus:"intelligence"},
  {name:"Exotic dancer", bonus:"agility"},
  {name:"Merchant", bonus:"charisma"},
];

$(function() {
  if (settings.startingDialogDisabled) {
    const p = w.me;
    p.job = settings.professions[0];
    p.isFemale = true;
    p.fullname = "Shaala"
    settings.gui = true
    return; 
  }
  const diag = $("#dialog");
  diag.prop("title", "Who are you?");
  let s;
  s = '<p>Name: <input id="namefield" type="text" value="Zoxx" /></p>';
  s += '<p>Male: <input type="radio" id="male" name="sex" value="male">&nbsp;&nbsp;&nbsp;&nbsp;';
  s += 'Female<input type="radio" id="female" name="sex" value="female" checked></p>';
  s += '<p>Job:<select id="job">'
  for (let profession of settings.professions) {
    s += '<option value="' + profession.name + '">' + profession.name + '</option>';
  }
  s += '</select></p>'
  
  s += '<p>Classic interface: <input type="radio" id="classic" name="interface" value="classic" checked>&nbsp;&nbsp;&nbsp;&nbsp;'
  s += 'GUI<input type="radio" id="gui" name="interface" value="gui"></p>'
  
  diag.html(s);
  diag.dialog({
    modal:true,
    dialogClass: "no-close",
    width: 400,
    height: 340,
    buttons: [
      {
        text: "OK",
        click: function() {
          $(this).dialog("close");
          const p = game.player;
          const job = $("#job").val();
          p.job = settings.professions.find(function(el) { return el.name === job; });
          p.isFemale = $("#female").is(':checked');
          settings.gui = $("#gui").is(':checked');
          p.fullname = $("#namefield").val();
          if (settings.textInput) { $('#textbox').focus(); }
          console.log(p)
        }
      }
    ]
  });
});



/*



const dialogeOptions = {
  para0Opts:[
    "a tiny village",
    "a provincial town",
    "the slums",
    "the merchant's quarter"
  ],

  para1Opts:[
    "loving the outdoors",
    "appreciating the finer things in life",
    "always hungry",
    "isolated from children of your own age"
  ],

  para2Opts:[
    "introspective",
    "precocious",
    "attractive",
    "curious",
  ],

  para3Opts:[
    "boy",
    "girl"
  ],

  para4Opts:[
    "getting into trouble",
    "with your nose in a book",
    "stealing things",
    "getting into fights",
    "arguing with the local priest"
  ],

  para5Opts:[
    "potion brewing",
    "crystal magic",
    "shadow magic",
    "nature magic"
  ],

  para6Opts:[
    "raven black",
    "dark brown",
    "brunette",
    "dark blond",
    "blond",
    "platinum blond",
    "ginger",
    "electric blue",
    "shocking pink",
  ],

para7Opts:[
  "brown",
  "green",
  "hazel",
  "blue",
  "aquamarine"
],

para8Opts:[
  "blue",
  "green",
  "orange",
],
};



var paraOpts = [];

var paraPositions = [];


var wizardMale = true;

function scrollWizard() {
  wizardMale = !wizardMale;
  $('#wizardname').html(wizardMale ? 'Master Shalazin' :  'Mistress Shalazin');
  $('#wizardwitch').html(wizardMale ? 'wizard' :  'witch');
  $('#wizardhe').html(wizardMale ? 'he' :  'she');
}

function scrollPara(element) {
  var paraNumber = parseInt(element.id.replace('para', ''));
  if (isNaN(paraNumber)) { return; }
  var para = $('#para' + paraNumber);
  if (typeof paraPositions[paraNumber] !== 'number') {
    var list = dialogeOptions['para' + paraNumber + 'Opts'];
    paraOpts[paraNumber] = list;
    paraPositions[paraNumber] = random.int(list.length - 1);
  }
  paraPositions[paraNumber]++;
  if (paraPositions[paraNumber] >= paraOpts[paraNumber].length) {
    paraPositions[paraNumber] = 0;
  }
  para.html(paraOpts[paraNumber][paraPositions[paraNumber]]);
}    

function setValues() {
  game.player.alias = $('#name_input').val();
  game.player.isFemale = !wizardMale;
  game.player.background = $('#para4').html();
  game.player.magic = $('#para5').html();
  game.player.hairColour = $('#para6').html();
  game.player.eyeColour = $('#para7').html();
  game.player.spellColour = $('#para8').html();
  msg(game.player.alias);
  msg($("#diag-inner").text());
}


$(document).ready(function () {
      $('.scrolling').each(function() {
        scrollPara(this);
      });
      that = $("#dialog_window_1");
      $('#dialog_window_1').dialog({
         height: 400,
         width: 640,
         buttons: {
            "Done": function() { setValues();}
        }
      });
      $("button[title='Close']")[0].style.world. = 'none';
});

function scrollWizard() {
  wizardMale = !wizardMale;
  $('#wizardname').html(wizardMale ? 'Master Shalazin' :  'Mistress Shalazin');
  $('#wizardwitch').html(wizardMale ? 'wizard' :  'witch');
  $('#wizardhe').html(wizardMale ? 'he' :  'she');
}

function showStartDiag() {

  var diag = $("#dialog");
  diag.prop("title", "Who are you?");
  var s;
  s = 'Name: <input type="text" id="name_input" value="Skybird"/><br/><br/>';
  s += '<div id="diag-inner">Born in <span id="para0" class="scrolling" onclick="scrollPara(this)"></span>, you grew up <span id="para1" class="scrolling" onclick="scrollPara(this)"></span>. ';
  s += 'You were a <span id="para2" class="scrolling" onclick="scrollPara(this)"></span> <span id="para3" class="scrolling" onclick="scrollPara(this)"></span>, ';
  s += 'always <span id="para4" class="scrolling" onclick="scrollPara(this)"></span>.';
  s += 'At the age of seven, you caught the eye of <span id="wizardname" class="scrolling" onclick="scrollWizard();">Master Shalazin</span>, ';
  s += 'a <span id="wizardwitch">wizard</span> ';
  s += 'who specialises in <span id="para5" class="scrolling" onclick="scrollPara(this)"></span>. ';
  s += 'Perhaps <span id="wizardhe">he</span> recognised potential in you, or just a pair of hands willing to work for next to nothing; may be just liked your ';
  s += '<span id="para6" class="scrolling" onclick="scrollPara(this)"></span> hair and <span id="para7" class="scrolling" onclick="scrollPara(this)"></span> eyes. ';
  s += 'Either way, you slowly learnt the basics of magic, and have recently learnt how to turn yourself <span id="para8" class="scrolling" onclick="scrollPara(this)"></span>. ';
  s += 'Perhaps more importantly, you have also learnt how to turn yourself back.</div>';

  diag.html(s);
  $('.scrolling').each(function() {
    scrollPara(this);
  });
  diag.dialog({
    modal:true,
    dialogClass: "no-close",
    width: 600,
    height: 600,
    buttons: [
      {
        text: "OK",
        click: function() {
          $(this).dialog("close");
          setValues(this);
          if (settings.textInput) { $('#textbox').focus(); }
        }
      }
    ]
  });

}
*/