"use strict";

// regular expressions

lang.regex.Attack = /^(?:attack|att) (.+)$/
lang.regex.Search = /^(?:search) (.+)$/
lang.regex.Equip = /^(?:equip|brandish|draw) (.+)$/
lang.regex.Unequip = /^(?:unequip|holster|sheath|put away) (.+)$/
lang.regex.LearnSpell = /^(?:learn) (.+)$/
lang.regex.CastSpell = /^(?:cast|invoke) (.+)$/
lang.regex.CastSpellAt = /^(?:cast|invoke) (.+) (?:at|on) (.+)$/



// responses

lang.attacking = "{nv:attacker:attack:true} {nm:target:the}."
lang.primarySuccess = "A hit!"
lang.primaryFailure = "A miss!"
lang.noTarget = 'No target found for attack'
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
lang.deathGeneral = '{nv:target:fall:true} down, dead.'
lang.deathConstruct = '{nv:target:fall:true} down; it seems to be inactive.'
lang.deathUndead = '{nv:target:fall:true} down - no longer undead, merely dead.'
lang.deathUndeadNoCorpse = '{nv:target:vanish:true}, apparently defeated.'
lang.deathElemental = '{nv:target:disipate:true}, defeated.'
lang.deathPhantom = '{nv:target:vanish:true}.'
