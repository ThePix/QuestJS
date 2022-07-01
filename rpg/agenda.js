"use strict"




/*
Handle NPC actions through the agenda system

"hostile" attribute is true when in combat, or searching to be in combat. I suggest it starts false, and is only set to true by the RPG system when the player attacks or when triggered by the guard system

Use isHostile(target) to see if the NPC wants to attack that target

Use "allegiance" to see if they are on the same team, "friend" or "foe" by default, but foes could put put in specific teams to have them (potentially) fight against each other). This could be set during game time. It is probably a bad idea to change it for the player, say if he pretends to be a goblin, as spells affecting foes will affect his actual friends, and not the goblins, whicgh is probably not what you want.

There are a number of agenda options available allowing aNPC to wait and attack (turn hostile) at some trigger

guardRoom:room:attackMode
guardExit:room:exit:attackMode
guardItem:item:attackMode
guardPatrol:route
guardWalkTo:distination

There are various options you can set on the NPC to refine how it behaves

NPC's "foeTrackingMode" can be 
follow: DEFAULT able to follow the player an adjoining location
obstruct:, prevent the player leaving the location (unless evaded)
static: cannot leave location
track: able to find the player in any location
teleport: able to follow the player to any location


NPC's "foeTrackingSpeed" can be 
medium: DEFAULT take a turn to move to the next location
slow: take two turns to move
fast: able to move and attack in that same turn

NPC's "guardActionMode" can be
preventAndAttack: DEFAULT stop the play, and attack
prevent: stop the player doing it, but no attack
allowAndAttack: for item only, allow it to taken (opened/destroyed/whatever), but then attack
allowWaitAttack: for item only, allow it to taken (opened/destroyed/whatever), but attack next turn


can access msg attributes on NPC in responses

automatically save location (and route) in agenda action, so we can return


The first time a "guard" agenda item is used, the system will save its details in "agendaOriginalSettings". If the NPC goes off to do something else, you can have it return to the start of its guard operation and go back to what it was doing by called "agendaRestart" on the NPC.

Use npc.unguard to stop the NPC guarding an exit or location

NOTES:
needs to take account of team - playercould pretend to be the same team
also befuddlement


*/





agenda.ping = function(npc) { log(npc.name + ': ping'); return false }


agenda.guardItemNow = function(npc, arr) {
  return agenda._guardItem(npc, arr, true)
}

agenda.guardItem = function(npc, arr) {
  return agenda._guardItem(npc, arr, false)
}

agenda._guardItem = function(npc, arr, fast) {
  const item = w[arr.shift()]
  if (item.scenery) return false
  msg(arr.join(':'))
  if (item.loc && w[item.loc] && (w[item.loc].npc || w[item.loc].player)) {
    //npc.target = item.loc
    npc.antagonise(w[item.loc])
    if (fast) npc.performAttack(w[item.loc])
  }
  return true
}

// As patrol, but will attack enemies (one day!)
agenda.guardPatrol = function(npc, arr) {
  agenda._saveInitial("guardPatrol", npc, arr)
  if (npc.patrolCounter === undefined) npc.patrolCounter = -1
  npc.patrolCounter = (npc.patrolCounter + 1) % arr.length
  this.moveTo(npc, [arr[npc.patrolCounter]])
  return false
}

// As walkTo, but will attack enemies (one day!)
// used by npc.agendaRestart
agenda.guardWalkTo = function(npc, arr) {
  agenda._saveInitial("guardWalkTo", npc, arr)
  let dest = arr.shift();
  if (dest === "player") dest = player.loc;
  if (w[dest] === undefined) {
    errormsg("Location '" + dest + "' not recognised in the agenda of " + npc.name);
    return true;
  }
  if (!w[dest].room) {
    dest = w[dest].loc;
    if (w[dest] === undefined) {
      errormsg("Object location '" + dest + "' not recognised in the agenda of " + npc.name);
      return true;
    }
  }
  if (npc.isAtLoc(dest)) {
    this.text(npc, arr);
    return true;
  }
  else {
    const route = agenda.findPath(w[npc.loc], w[dest]);
    if (!route) errormsg("Location '" + dest + "' not reachable in the agenda of " + npc.name)
    const exit = w[npc.loc].findExit(route[0])
    npc.movingMsg(exit) 
    npc.moveChar(exit)
    if (npc.isAtLoc(dest)) {
      this.text(npc, arr);
      return true;
    }
    else {
      return false;
    }
  }
}






agenda._saveInitial = function(name, npc, arr) {
  this.debug(name, npc, arr)
  if (!npc.agendaOriginalSettings) {
    npc.agendaOriginalSettings = {
      action:name,
      data:'arr',
      loc:this.loc,
    }
  }
}


agenda.antagoniseNow = function(npc, arr) {
  agenda.antagonise(npc, arr)
  npc.performAttack(w[npc.target])
  return true
}
  


agenda.antagonise = function(npc, arr) {
  if (arr.length === 0) {
    npc.antagonise(player)
  }
  else if (arr[0] === 'player') {
    npc.antagonise(player)
  }
  else if (arr[0] === 'target') {
    npc.antagonise(w[npc.target])
  }
  else {
    const target = w[arr[0]]
    if (!target) return errormsg("Unknown target set for `antagonise` agenda item: " + arr[0])
    npc.antagonise(target)
  }
  return true
}
