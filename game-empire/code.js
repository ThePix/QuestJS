"use strict";








const takeATurn = function() {
  msg("Time passes...")
}






/*
const word = {}
word.start = ['', '', 'b', 'c', 'ch', 'd', 'c', 'ch', 'd', 'f', 'fl', 'fr', 'g', 'l', 'm', 'n', 'p', 'pl', 'pr', 'r', 's', 'sl', 'st', 'sh', 't', 'tr', 'v', 'y']
word.middle = ['a', 'aa', 'ai', 'e', 'ea', 'ei', 'i', 'ie', 'o', 'oa', 'oe', 'ou', 'oo', 'u', 'ui', 'ue']
word.end = ['', '', 'b', 'mb', 'ck', 'ch', 'rk', 'd', 'nd', 'rd', 'gg', 'ng', 'gh', 'l', 'll', 'm', 'n', 'pp', 'mp', 'r', 'ss', 'sh', 't', 'rt', 'th']
word.syllable = function() { return random.fromArray(this.start) + random.fromArray(this.middle) + random.fromArray(this.end) }
word.word = function() {
  let s = ''
  for (let i = random.int(2,4); i > 0; i--) s += this.syllable()
  return s
}
for (let i = 0; i < 20; i++) console.log(word.word())
*/






settings.startingDialogDisabled = true;

settings.professions = [
  "Alchemist",
  "Baronet",
  "Farm hand",
  "Glass blower",
  "Merchant",
  "Priest",
  "Prostitute",
];

$(function() {
  if (settings.startingDialogDisabled) {
    const p = game.player;
    p.job = "Merchant";
    p.isFemale = true;
    p.alias = "Shaala";
    return; 
  }
  const diag = $("#dialog");
  diag.prop("title", "Who are you?");
  let s;
  s = '<p>Name: <input id="namefield" type="text" value="Zoxx" /></p>';
  s += '<p>King: <input type="radio" id="male" name="sex" value="male">&nbsp;&nbsp;&nbsp;&nbsp;';
  s += 'Queen<input type="radio" id="female" name="sex" value="female" checked></p>';
  s += '<p>Background:<select id="job">'
  for (let profession of settings.professions) {
    s += '<option value="' + profession + '">' + profession + '</option>';
  }
  s += '</select></p>';
  
  diag.html(s);
  diag.dialog({
    modal:true,
    dialogClass: "no-close",
    width: 400,
    height: 300,
    buttons: [
      {
        text: "OK",
        click: function() {
          $(this).dialog("close");
          const p = game.player;
          p.job = $("#job").val();
          p.isFemale = $("#female").is(':checked');
          p.alias = $("#namefield").val();
          if (settings.textInput) { $('#textbox').focus(); }
          console.log(p)
        }
      }
    ]
  });
});




commands.push(new Cmd('Sleep', {
  regex:/^sleep$/,
  script:function() {
    if (game.player.loc === 'royal_bedroom') {
      takeATurn()
      return world.SUCCESS
    }
    else {
      metamsg("You can only sleep in the bedroom");
      return world.FAILED
    }
  },
}));
