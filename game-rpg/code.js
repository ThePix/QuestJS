"use strict";

const RPG_NPC = function(female) {
  const res = $.extend({}, NPC(female));

  res.attack = function(isMultiple, char) {
    let skill = skills.getSkillFromButtons();
    skills.resetButtons();
    if (skill === null) skill = skills.list[0];
    msg(prefix(this, isMultiple) + nounVerb(char, "attack", true) + " " + this.byname({article:DEFINITE}) + " using " + skill.name + ".");
    return true;
  };
  
  res.getVerbs = function() {
    return [VERBS.lookat, VERBS.talkto, "Attack"];
  };
    
  return res;
}





commands.push(new Cmd('Attack', {
  npcCmd:true,
  rules:[cmdRules.isHereRule],
  regex:/^(attack) (.+)$/,
  objects:[
    {ignore:true},
    {scope:isPresent}
  ],
  default:function(item, isMultiple, char) {
    msg(prefix(this, isMultiple) + "No point attacking " + this.byname({article:DEFINITE}) + ".");
    return false;
  },
}));


