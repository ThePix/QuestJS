"use strict";

// regular expressions

lang.regex.Target = /^(?:target|t) (.+)$/
lang.regex.Attack = /^(?:attack|att) (.+)$/
lang.regex.Search = /^(?:search) (.+)$/
lang.regex.Stow = /^(?:stow|store|pack) (.+)$/
lang.regex.Retrieve = /^(?:retrieve|unpack) (.+)$/
lang.regex.RetrieveMenu = /^(?:retrieve|unpack)$/
lang.regex.Equip = /^(?:equip|brandish|draw) (.+)$/
lang.regex.Unequip = /^(?:unequip|holster|sheath|put away) (.+)$/
lang.regex.LearnSpell = /^(?:learn) (.+)$/
lang.regex.CastSpell = [
  /^(?:cast|invoke) (.+)$/,
//  /^(?:cast|invoke) (.+) on (?:me|self)$/,
]
//lang.regex.CastSpellAtAntiRegex = [
//  /^(?:cast|invoke) (.+) on (?:me|self)$/,
//]
lang.regex.CastSpellAt = /^(?:cast|invoke) (.+) (?:at|on) (.+)$/


// verbs

lang.verbs.target = "Target"
lang.verbs.stow = "Stow"


// responses

lang.notAFoe = "No point attacking {nm:item:the}."
lang.notEquippable = "{nv:item:be:true} not something you can equip."
lang.notStowable = "{nv:item:be:true} not something you can stow."
lang.notStowed = "{nv:item:be:true} is not stowed."
lang.ringTooMany = "{nv:item:can:true} not be put on; already wearing {number:count} rings."
lang.noSourceForSpell = "You do not have anything you can learn {i:{show:spell:name}} from."
lang.noSpellCalled = "There is no spell called {show:text}."
lang.doNotKnowSpell = "You do not know the spell {i:{show:spell:name}}."
lang.needTargetForSpell = "You need a target for the spell {i:{show:spell:name}}."
lang.needNoTargetForSpell = "You should not give a target for the spell {i:{show:spell:name}}."
lang.targetNotHere = "You need the target to be here for the spell {i:{show:spell:name}}."
lang.cannotLearnSpellLevel = "You cannot learn {i:{show:spell:name}}; it is too complex for you right now."
lang.cannotLearnSpellLimit = "You cannot learn {i:{show:spell:name}}; you have too many spells already memorised."
lang.cannotAttack = "{nv:target:be:true} not able to make an attack right now."

lang.msgStow = "{nv:char:stow:true} {nm:item:the} in {pa:char} pack."
lang.msgRetrieve = "{nv:char:retrieve:true} {nm:item:the} from {pa:char} pack."
lang.msgBulkRetrieve = "{nv:char:retrieve:true} {list:list:the} from {pa:char} pack."
lang.targeting = "{nv:char:target:true} {nm:target:the}."
lang.learnSpell = "You learn {i:{show:spell:name}} from {nm:item:the}."
lang.attacking = "{nv:attacker:attack:true} {nm:target:the}."
lang.primarySuccess = "A hit!"
lang.primaryFailure = "A miss!"
lang.nothingStored = 'There is nothing currently stored.'
lang.noTarget = 'No target found for attack'
lang.noWeapon = 'No weapon equipped for attack'
lang.equip = "{nv:char:draw:true} {nm:item:the}."
lang.unequip = "{nv:char:put:true} away {nm:item:the}."
lang.unequipAndEquip = "{nv:char:put:true} away {show:list}, and equip {nm:item:the}."
lang.castSpell = "{nv:attacker:cast:true} the {i:{nm:skill}} spell."
lang.castSpellFrom = "{nv:attacker:cast:true} the {i:{nm:skill}} spell from {nm:source:the}."
lang.drinkPotion = "{nv:attacker:drink:true} {nm:source:the}, casting the {i:{nm:skill}} spell."
lang.defaultEffectExpires = "The {i:{show:effect:alias}} effect on {nm:target:the} expires."
lang.damageReport = "The attack does {show:modifiedDamage} hits, {nms:target:the} health is now {show:target:health}."
lang.wayGuarded = "The way {show:exit:dir} is guarded!"
lang.summonSpellPre = "Summon"
lang.summonSpellDesc = function(spell) { return "Summons a " + spell.prototype.alias + "; it will last about " + spell.duration + " turns, unless it is destroyed before then." }
lang.spellbookIdentifyTemplate = 'A spell book, containing the spells #.'
lang.outOfAmmo = '{nv:player:can\'t:true} do that; {nv:player:be} out of ammo.'

lang.communeWithAnimalSpell = 'Commune with animal'
lang.cannotTalkToBeast = "{nv:char:spend:true} a few minutes telling {nm:item:the} about {pa:char} life, but {pv:item:do} not seem interested. Possibly because {pv:item:be} just a dumb beast."
lang.teleport = "{nv:attacker:feel:true} disorientated and the world around {sb:attacker} dissolves. A moment later, {nv:attacker:be} somewhere else."
lang.summoning_successful = "{nv:item:appear:true} before {nm:attacker:the}."

lang.deadAddendum = ' {pv:item:be:true} dead.'
lang.asleepAddendum = ' {pv:item:be:true} sleeping.'
lang.injuredAddendum = ' {pv:item:be:true} somewhat injured.'
lang.badlyInjuredAddendum = ' {pv:item:be:true} badly injured.'
lang.searchAlive = '{nv:char:think:true} searching {nm:item:the} whilst {pv:item:be} alive and awake is a bad idea.'
lang.searchNothing = '{nv:char:search:true} {nm:item:the}, but find nothing.'
lang.searchNothingMore = '{nv:char:search:true} {nm:item:the}, but find nothing more.'
lang.deathGeneral = '{nv:target:fall:true} down, dead.'
lang.deathConstruct = '{nv:target:fall:true} down; it seems to be inactive.'
lang.deathUndead = '{nv:target:fall:true} down - no longer undead, merely dead.'
lang.deathUndeadNoCorpse = '{nv:target:vanish:true}, apparently defeated.'
lang.deathElemental = '{nv:target:disipate:true}, defeated.'
lang.deathPhantom = '{nv:target:vanish:true}.'
lang.wieldingWeaponAndShield = ' {pv:item:be:true} wielding {nm:weapon:a} and {nm:shield:a}.'
lang.wieldingWeaponOnly = ' {pv:item:be:true} wielding {nm:weapon:a}.'
lang.gameOverMsg = '--- G A M E --- O V E R ---'
lang.blindedMsg = '{pv:char:can:true} see nothing...'