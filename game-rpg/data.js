"use strict";



  
createItem("me", RPG_PLAYER(), {
  loc:"practice_room",
  regex:/^(me|myself|player)$/,
  health:100,
  maxHealth:100,
  pp:40,
  maxPP:40,
  maxArmour:20,
  armour:3,
  spellCasting:5,
  offensiveBonus:3,
  examine:function(isMultiple) {
    msg(prefix(this, isMultiple) + "A " + (this.isFemale ? "chick" : "guy") + " called " + this.alias);
  },
});



createItem("knife", WEAPON("d4+2"), {
  loc:"me",
  image:"knife",
  examine:"An example of a poor weapon.",
  offensiveBonus:-2,
});

createItem("flail", WEAPON("2d10+4"), {
  loc:"me",
  image:"flail",
  examine:"An example of a good weapon.",
});

createItem("flaming_sword", WEAPON("3d6+2"), {
  //loc:"me",
  image:"sword",
  examine:"An example of a magic weapon.",
  activeEffects:["Flaming weapon"],
});


createItem("ice_amulet", WEARABLE(4, ['neck']), {
  loc:"me",
  examine:"An example of a wearable magic item; it stops ice/frost damage.",
  modifyIncomingAttack:function(attack) {
    if (this.worn && attack.element === 'frost') {
      attack.damageMultiplier = 0
      attack.primarySuccess = attack.primarySuccess.replace(/[.!]/, ", but the ice amulet protects {sb:target}, and {pv:target:take} no damage.")
    }
  }
});





createRoom("practice_room", {
  desc:'A large room with straw scattered across the floor. The only exit is west',
  west:new Exit('great_hall'),
  south:new Exit('cupboard', {
    lockedmsg:"It seems to be locked."
  }),
  exit_locked_south:true,
});




createRoom("great_hall", {
  desc:'An imposing - and rather cold - room with a high, vaulted roof, and tapestries hanging from the walls.',
  east:new Exit('practice_room'),
});

createItem("practice_room_door", LOCKED_DOOR("small_key", "great_hall", "practice_room"), {
  examine:'A very solid, wooden door.',
});

createRoom("cupboard", {
  desc:'A small cupboard.',
  north:new Exit('practice_room'),
});

createItem("small_key", KEY(), {
  examine:'A small key.',
  loc:"practice_room",
});




createItem("goblin", RPG_NPC(false), {
  loc:"practice_room",
  damage:"d8",
  health:40,
  examine:"An example of a simple monster.",
});

createItem("orc", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d10+4",
  health:60,
  examine:"An example of a simple monster.",
});

createItem("huge_shield", SHIELD(10), {
  loc:"orc",
});

createItem("snotling", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d4",
  health:20,
  examine:"An example of a simple monster.",
});

createItem("rabbit", RPG_NPC(false), {
  loc:"practice_room",
  damage:"2d4",
  health:20,
  examine:"An example of a monster you can talk to after casting the right spell, and is generally not hostile.",
  canTalkFlag:false,
  isHostile:function() { return false; },
  talkto:function() {
    if (!this.canTalk()) {
      msg("You spend a few minutes telling the rabbit about your life, but it does not seem interested. Possibly because it is rabbit.")
      return
    }
    switch (this.talktoCount) {
      case 0 : 
        msg("You say 'Hello,' to the rabbit, 'how is it going?'");
        msg("The rabbit looks at you. 'Need carrots.' It looks plaintively at it round tummy. 'Fading away bunny!");
        break;
      default: msg("You wonder what you can talk to the rabbit about."); break;
    }
  },  
});

createItem("chest", CONTAINER(true), {
  loc:"practice_room",
});

createItem("spellbook", SPELLBOOK(["Fireball", "Stoneskin", "Steelskin", "Lightning bolt", "Ice shard"]), {
  examine:"An example of a spell book, obviously.",
  loc:"practice_room",
});

createItem("helmet", WEARABLE(2, ['head']), {
  loc:"practice_room",
  examine:"An example of armour; it will add +{armour} to your armour rating.",
  armour:10,
});

createItem("chestplate", WEARABLE(2, ['chest']), {
  loc:"practice_room",
  examine:"An example of armour; it will add +{armour} to your armour rating.",
  armour:20,
});

createItem("boots", WEARABLE(2, ['feet']), {
  loc:"practice_room",
  pronouns:lang.pronouns.plural,
});

createItem("shotgun", LIMITED_USE_WEAPON("2d10+4", 1), {
  loc:"practice_room",
  ammo:1,
  examine:"An example of a limited use weapon.",
  image:"flail",
});



skills.add(new Skill("Double attack", {
  icon:"sword2",
  tooltip:"Attack one foe twice, but at -2 to the attack roll",
  modifyOutgoingAttack:function(attack) {
    attack.offensiveBonus -= 2
    attack.attackNumber = 2
  },
}))

skills.add(new Effect("Flaming weapon", {
  modifyOutgoingAttack:function(attack, source) {
    if (!source.equipped) return
    attack.element = 'fire'
  },
}))

skills.add(new Effect("Frost vulnerability", {
  modifyIncomingAttack:function(attack) {
    if (attack.element) attack.damageMultiplier *= 2
  },
}))

skills.add(new Effect("Report for testing", {
  modifyOutgoingAttack:function(attack) {
    attack.element = 'fire'
  },
  modifyIncomingAttack:function(attack) {
    if (attack.element) attack.damageMultiplier *= 2
  },
}))

skills.add(new Skill("Sweeping attack", {
  icon:"sword3", 
  tooltip:"Attack one foe for normal damage, and any other for 4 damage; at -3 to the attack roll for reach", 
  getPrimaryTargets:rpg.getFoes,
  modifyOutgoingAttack:function(attack) {
    if (options.secondary) {
      attack.damageNumber = 0;
      attack.damageBonus = 4;
    }
    attack.offensiveBonus -= 3;
  },
}))

skills.add(new Skill("Sword of Fire", {
  icon:"sword-fire", 
  tooltip:"Attack with a flaming sword", 
  modifyOutgoingAttack:function(attack) {
    attack.element = "fire";
  },
}))

skills.add(new Skill("Ice Sword", {
  icon:"sword-ice", 
  tooltip:"Attack with a freezing blade",
  modifyOutgoingAttack:function(attack) {
    attack.element = "ice";
  },
}))

skills.add(new Spell("Fireball", {
  noTarget:true,
  damage:'2d6',
  tooltip:"A fireball that fills the room (but does not affect you!)",
  primarySuccess:"{nv:target:reel:true} from the explosion.",
  primaryFailure:"{nv:target:ignore:true} it.",
  getPrimaryTargets:rpg.getAll,
  modifyOutgoingAttack:function(attack) {
    attack.element = "fire";
    attack.msg("The room is momentarily filled with fire.", 1)
  },
}))

skills.add(new Spell("Ice shard", {
  damage:'3d6',
  icon:'ice-shard',
  tooltip:"A shard of ice pierces your foe!",
  primarySuccess:"A shard of ice jumps from {nms:attacker:the} finger to {nm:target:the}!",
  modifyOutgoingAttack:function(attack) {
    attack.element = "frost";
  },
}))

skills.add(new Spell("Psi-blast", {
  damage:'3d6',
  icon:'psi-blast',
  tooltip:"A blast of mental energy (ignores armour)",
  primarySuccess:"A blast of raw psi-energy sends {nm:target:the} reeling.",
  primaryFailure:"A blast of raw psi-energy... is barely noticed by {nm:target:the}.",
  modifyOutgoingAttack:function(attack) {
    attack.armourMultiplier = 0
  },
}))

skills.add(new Spell("Lightning bolt", {
  damage:'3d6',
  secondaryDamage:'2d6',
  icon:'lightning',
  tooltip:"A lightning bolt jumps from your out-reached hand to you foe!",
  primarySuccess:"A lightning bolt jumps from {nms:attacker:the} out-reached hand to {nm:target:the}!",
  secondarySuccess:"A smaller bolt jumps {nms:attacker:the} target to {nm:target:the}!",
  primaryFailure:"A lightning bolt jumps from {nms:attacker:the} out-reached hand to {nm:target:the}, fizzling out before it can actually do anything.",
  secondaryFailure:"A smaller bolt jumps {nms:attacker:the} target, but entirely misses {nm:target:the}!",
  getSecondaryTargets:rpg.getFoesBut,
  modifyOutgoingAttack:function(attack) {
    attack.element = "storm";
  },
  onPrimaryFailure:function(attack) {
    attack.secondaryTargets = []
  },
}))

skills.add(new Spell("Cursed armour", {
  targetEffect:function(attack, target) {
    attack.msg("{nms:target:the:true} armour is reduced.", 1)
    target.activeEffects.push("Cursed armour effect")
  },
  incompatible:[/skin effect$/],
  icon:'unarmour',
}))


skills.add(new Effect("Cursed armour effect", {
  modifyOutgoingAttack:function(attack) {
    attack.armourModifier = (attack.armourModifier > 2 ? attack.armourModifier - 2 : 0)
  },
}))

skills.add(new SpellSelf("Stoneskin", {
  targetEffect:function(attack, target) {
    attack.msg("Your skin becomes as hard as stone - and yet still just as flexible.", 1)
    target.activeEffects.push("Stoneskin effect")
  },
  incompatible:[/skin effect$/],
}))

skills.add(new Effect("Stoneskin effect", {
  modifyIncomingAttack:function(attack) {
    attack.armourModifier += 2
  },
}))

skills.add(new SpellSelf("Steelskin", {
  targetEffect:function(attack, target) {
    attack.msg("Your skin becomes as hard as steel - and yet still just as flexible.", 1)
    skills.limitDuration(target, "Steelskin effect", 3)
  },
  incompatible:[/skin effect$/],
}))
  
skills.add(new Effect("Steelskin effect", {
  modifyIncomingAttack:function(attack) {
    attack.armourModifier += 4
  },
}))

skills.add(new SpellSelf("Unlock", {
  targetEffect:function(attack) {
    const room = w[attack.attacker.loc]
    let flag = false
    for (let el of room.getExits()) {
      if (el.isLocked()) {
        attack.msg("The door to " + el.nice() + " unlocks.", 1)
        el.setLock(false)
        flag = true
      }
    }
    if (!flag) attack.msg("There are no locked doors.", 1)
  },
}))

skills.add(new Spell("Commune with animal", {
  icon:'commune',
  targetEffect:function(attack) {
    if (attack.target.canTalkFlag) {
      attack.msg("{nv:attacker:can:true} talk to {nm:target:the} for a short time (like before the spell...).", 1)
    }
    else {
      attack.target.canTalkFlag = true
      attack.target.canTalkFlagIsTemporary = true
      attack.msg("{nv:attacker:can:true} now talk to {nm:target:the} for a short time.", 1)
    }
  },
  regex:/commune/,
  duration:5,
  automaticSuccess:true,
  terminatingScript:function(target) {
    if (target.canTalkFlagIsTemporary) {
      target.canTalkFlag = false
      target.canTalkFlagIsTemporary = false
      return "The {i:Commune with animal} spell on " + lang.getName(target, {article:DEFINITE}) + " expires."
    }
    return ''
  },
}))

