"use strict"


/*
The ship is on a long mission to visit various stars to survey them. It takes years between each one, so the crew are in stasis. The shop has an AI that controls the ship between stars, and on arrival does the initial scans, looking for anything interesting. The ship does not have the capability to land (it has two escape pods that can be used to land, but not get off the planet again).

There are:
Six stasis pods
Five? crew
Six seeder pods, to be deployed in batches of three
Six satellites
Sixteen probes with crawler-bots
Six probes with marine-bots
Two escape pods

Probes:
Geology (MS, also analyse atmosphere)
Biology (slice and dice, microscope)


Keep a score in the way of a bonus, related to how much data for useful planets

Each awakening gets steadily worse, by the fourth you are throwing up.








*/




io.scriptShow = function(opts) {
  let html = '';
  html += '<!DOCTYPE html><html lang="en"><head><meta charset="utf-8"/><title>Quest 6 Unit Tests for '
  html += settings.title
  html += '</title></head><body><p>"use strict"</p><p>test.tests = function() {</p><p>test.assertCmd("script on", ['
  for (let el of this.transcriptText) {
    switch (el.cssClass) {
      case 'input': html += '])</p><p>&nbsp;&nbsp;test.assertCmd("' + el.text + '", ['; break;
      default : html += '"' + el.text.replace(/\"/g, '\\"') + '",'; break;
    }
  }
  html += '])</p><p>}</p></body></html>'
  const tab = window.open('about:blank', '_blank')
  tab.document.write(html)
  tab.document.close()
}



const CREW = function(isFemale) {
  const res = NPC(isFemale)
  res.status = "okay"
  res.properName = true
  res.crewman = true
  res.relationship = 0
  res.clothing = 2
  res.reactionToUndress = 0
  res.oxygenUseModifier = 1
  res.oxygenUse = function() {
    if (typeof this.status !== 'number') return 0
    return this.baseOxygeUse * this.oxygenUseModifier
  }
  res.revive = function(options) {
    if (char === player) {
      msg("You wonder how to revive {nm:item} - probably best to leave that to Xsansi.", options);
      return false;
    }
    if (options.char !== w.Xsansi) {
      msg("'{nm:char}, can you revive {nm:item}?' you ask.", options);
      msg("'Probably best to leave that to Xsansi.'");
      return false;
    }
    if (!this.inPod) {
      msg("'Xsansi, please revive {nm:item},' you say.", options);
      msg("'Crew member {nm:item} is not currently in stasis.'", options);
      return false;
    }
    // check number revived TODO!!!
    
  }
  // Description
  res.examine = function(options) {
    const tpParams = {char:this}
    let s;
    switch (this.clothing) {
      case 0: s = " {pv:char:be:true} naked."; break;
      case 1: s = " {pv:char:be:true} in his underwear."; break;
      case 2: s = " {pv:char:be:true} wearing a dark grey jumpsuit."; break;
    }
    if (this.posture === "reclining" && this.loc === "stasis_bay") {
      s += " {pv:char:be:true} lying in his stasis pod.";
    }
    else if (this.posture) {
      s += " {pv:char:be:true} " + this.posture + ".";
    }
    msg(this.desc + s, tpParams);
  }
  res.stasis = function() {
    const tpParams = {char:this}
    msg("'{nm:actor}, you're work here is done; you can go get in your stasis pod.'", tpParams);
    if (this.deployProbeTotal === 0) {
      msg("'You don't think I should deploy a probe first?'", tpParams);
      msg("'I'm the captain,' you remind {ob:actor}.", tpParams);
    }
    msg(this.okay);
    this.agenda.push("walkTo:stasis_bay");
    this.agenda.push("text:stasisPod");
    this.stasisPodCount = 0;
  }
  res.stasisPod = function() {
    const tpParams = {char:this}
    if (this.clothing === 2) {
      this.msg("{nv:char:pull:true} off {pa:actor} jumpsuit, and puts it in the drawer under {pa:actor} stasis pod.", tpParams);
      this.clothing = 1;
      return false;
    }
    if (this.posture !== "reclining") {
      this.msg("Just in {pa:actor} underwear, {nv:char:climb} into {pa:actor} stasis pod.", tpParams);
      this.posture = "reclining";
      return false;
    }
    this.msg("'Close the pod, Xsansi,' {nv:char:say}. The stasis pod lid smoothly lowers, and Xsansi operates the stasis field.", tpParams);
    this.status = "stasis";
    this.loc = "nowhere";
    return true;
  }

  // Probe deployment
  res.deployProbeAction = 0
  res.deployProbeCount = 0  // number deployed in one batch
  res.deployProbeTotal = 0  // number deployed in this system
  res.deployProbeOverallTotal = 0  // total
  res.deployProbe = function(arr) {
    // This is an agenda item; it will continue until it returns true and is set other parameters from the agenda (just the count in this case).
    // It will run every turn until done. It should only start once the character is at the correct location.
    // Progress is tracked with deployProbeAction.
    // 0 is sitting down at the console
    // 1 is preparing the probe
    // 2 is launching the probe, and we can return to 1 if there are more to do
    // 3 is noting the job is done
    // Once a probe is launched this system forgets it
    const count = parseInt(arr[0])
    const tpParams = {char:this, count:this.deployProbeCount + 1}
    switch (this.deployProbeAction) {
      case 0:
        this.probeAction0(count)
        this.deployProbeAction++
        break
      case 1:
        this.msg("{nv:char:prepare:true} the {ordinal:count} {param:char:probeType}.", tpParams)
        this.deployProbeAction++
        break
      case 2:
        this.msg("{nv:char:launch:true} the {ordinal:count} {param:char:probeType}.", tpParams)
        this.actuallyDeployProbe(count)
        break
      case 3:
        this.probeAction3(count)
        this.deployProbeAction++
        break
    }
    return this.deployProbeAction === 4
  }

  res.actuallyDeployProbe = function(count) {
    // the details of leaunching a probe are done here
    // housekeeping
    this.probesRemaining--
    this.deployProbeCount++
    this.deployProbeTotal++
    this.deployProbeOverallTotal++
    if (this.deployProbeCount === count) {
      // last of the batch
      this.deployProbeAction++;
    }
    else {
      // some left to deploy
      this.deployProbeAction--;
    }

    w.probe_prototype.cloneMe(this)
  }
  
  return res 
}








const walkthroughs = {
  a:[
    "o",
    "get jumpsuit",
    "wear jumpsuit",
    "a",
    "u",
    "f",
    "s",
    "ask ostap about probes",
    "x chair",
    "x table",
    "ask ostap about bio-probes",
    "ask ostap about his health",
    "ostap, launch 19 probes",
    "ostap, launch 2 bio-probe",
    "z",
    "p",
    "d",
    "d",
    "a",
    "z",
    "ask ostap about lost probes",
    "ask ostap about planet",
    "ask ostap about lost probes",
    "topics for ostap",
    "z",
    "z",
    "z",
    "z",
    "z",
    "z",
    "ask ostap about lost probes",
    "ask ostap about planet",
    "topics ostap",
    "ask ostap about himself",
    "ask ostap about himself",
    "ostap, go in stasis pod",
    "f",
    "u",
    "s",
    "ostap, stop",
    "ostap, stop",
    "z",
    "z",
    "l",
    "ostap, go in stasis pod",
    "z",
    "x ostap",
    "l",
    "ask ai about crew",
    "p",
    "u",
    "a",
    "a",
    "tell aada to deploy probe",
    "z",
    "f",
    "f",
    "d",
    "d",
    "a",
    "z",
    "z",
    "z",
    "z",
    "z",
    "ask aada about planet",
    "topics aada",
    "ask aada about himself",
    "ask aada about herself",
    "aada, go in stasis pod",

    "up",
    "forward",
    "starboard",
    "starboard",
    "in",
    "remove jumpsuit",
    "drop jumpsuit",
    "close lid",

    "out",
    "open locker",
    "get suit",
    "get sp",
    "wear sp",
    "ai,depres stasis",



    /**/
  ],
  c:[
    "o",
    "get jumpsuit",
    "wear jumpsuit",
    "p",
    "f",
    "kyle, launch 19 probes",
    "kyle, launch 1 satellite",
    "z",
    "a",
    "d",
    
  ],
}




function isRoomScope(obj) { return obj.room }





function createTopics(npc) {
  npc.askOptions.push({
    name:"health",
    regex:/(his |her )?(health|well\-?being)/,
    test:function(p) { return p.text.match(this.regex); }, 
    script:howAreYouFeeling,
  });
  npc.askOptions.push({
    name:"planet",
    regex:/(this |the |)?planet/,
    test:function(p) { return p.text.match(this.regex) }, 
    script:function(response) {
      const tpParams = {char:response.actor}
      msg("'What's your report on {planet}?' you ask {nm:char:the}.", tpParams)
      msg(planetAnalysis(response), tpParams)
    },
  });
  npc.askOptions.push({
    name:"probes",
    regex:/probes?/,
    test:function(p) { return p.text.match(this.regex) }, 
    script:function(response) {
      response.actor.probesAskResponse();
    }
  });
  npc.askOptions.push({
    name:"expertise", 
    regex:/(your |his |her )?(area|special.*|expert.*|job|role)/,
    test:function(p) { return p.text.match(this.regex); }, 
    script:function(response) {
      msg("'What is your area of expertise?' you ask " + lang.getName(response.actor, {article:DEFINITE}) + ".");
      response.actor.areaAskResponse();
    }
  });
  npc.askOptions.push({
    name:"background", 
    regex:/^((his |her )?(background))|((him|her)self)$/,
    test:function(p) { return p.text.match(this.regex); }, 
    script:function(response) {
      msg("'Tell me about yourself,' you say to " + lang.getName(response.actor, {article:DEFINITE}) + ".");
      response.actor.backgroundAskResponse();
      trackRelationship(response.actor, 1, "background");
    }
  });
  npc.askOptions.push({
    msg:"{nv:char:have:true} no interest in that.",
    failed:true,
  })
}
 
function howAreYouFeeling(response) {
  msg("'How are you feeling?' you ask " + lang.getName(response.actor, {article:DEFINITE}) + ".");
  msg(PLANETS[w.Xsansi.currentPlanet][response.actor.name + "_how_are_you"]);
}

function planetAnalysis(response) {
  const arr = response.actor.data[w.Xsansi.currentPlanet]
  if (Object.keys(arr).length === 0) return falsemsg("You should talk to Aada or Ostap about that stuff.")

  let rank = response.actor["rank" + w.Xsansi.currentPlanet]
  if (rank === undefined) return falsemsg("You should talk to Aada or Ostap about that stuff.")
  rank >>= 1
  if (rank >= arr.length) rank = arr.length - 1
  return arr[rank]
}

  
function createPlanets() {
  for (let i = 0; i < PLANETS.length; i++) {
    createItem("planet" + i,
      { 
        starName:PLANETS[i].starName,
        alias:PLANETS[i].starName + " " + PLANETS[i].planet,
        geology:0,
        marine:0,
        biology:0,
        coms:0,
        satellite:false,
        probeLandingSuccess:PLANETS[i].probeLandingSuccess,
        eventIsActive:function() { return this.satellite; },
        eventPeriod:5,
        eventScript:function() {
          this.coms++; 
        },
      }
    )
  }
}


createPlanets();


function arrival() {
  w.Xsansi.currentPlanet++
  PLANETS[w.Xsansi.currentPlanet].onArrival()
  game.elapsedTime = 0
  game.startTime = PLANETS[w.Xsansi.currentPlanet].arrivalTime
  w.Aada.deployProbeTotal = 0
  w.Ostap.deployProbeTotal = 0
  updateTopics(w.Xsansi, w.Xsansi.currentPlanet)
  for (let npc of NPCS) {
    npc.state = w.Xsansi.currentPlanet * 100
  }
  w.Kyle.setAgenda(["walkTo:probes_forward", "text:deployProbe:1"])
  io.updateStatus() 
}

// If a topic has an attribute "name2", then using code=2,
// "name" will be changed to "name2". This means new topics get added to the TOPIC command
// tested
function updateTopics(npc, code) {
  for (let opt of npc.askOptions) {
    if (opt["name" + code] !== undefined) {
      opt.name = opt["name" + code]
    }
  }
}

// Use this to increase the player's relationship with the NPC to ensure it only happens once
// tested
function trackRelationship(npc, inc, code) {
  if (npc.relationshipTracker === undefined) npc.relationshipTracker = "~"
  const regex = new RegExp("~" + code + "~")
  if (!regex.test(npc.relationshipTracker)) {
    npc.relationship += inc
    npc.relationshipTracker += code + "~"
  }
}
    


function reviveNpc(npc, object) {
  
}





function getProbes() {
  const arr = [];
  for (let key in w) {
    if (w[key].clonePrototype === w.probe_prototype) arr.push(w[key]);
  }
  return arr;
}


function shipAlert(s) {
  if (isOnShip()) {
    msg("'" + s + "' announces Xsansi.");
  }
}


function isOnShip() {
  return w[player.loc].notOnShip === undefined;
}


function currentPlanet() {
  return w["planet" + w.Xsansi.currentPlanet];
}


function probeLandsOkay() {
  const planet = currentPlanet();
  const flag = (planet.probeLandingSuccess[0] === "y");
  planet.probeLandingSuccess = planet.probeLandingSuccess.substring(1);
  if (!flag) {
    w.Aada.lostProbe = true;
    w.Ostap.lostProbe = true;
    updateTopics(w.Ostap, "Lost")
  }
  return flag;
}
  
  
settings.deckNames = {layer1:'Deck 2', layer3:'Deck 1', layer4:'Deck 3'}

function updateMap() {
  $('#layer1').hide()
  $('#layer3').hide()
  $('#layer4').hide()
  const currentDeck = w[player.loc].deckName
  $('#map').attr('title', 'The Joseph Banks, ' + settings.deckNames[currentDeck]);
  if (!currentDeck) return errormsg("No deckName for " + player.loc)
  $('#' + currentDeck).show()
  for (let key in w) {
    if (w[key].svgId) $('#' + w[key].svgId).css('fill', isRoomPressured(w[key]) ? '#777' : '#222')
  }
  const mySvgId = w[player.loc].svgId
  let otherSvgId
  if (w.Xsansi.locate) otherSvgId = w[w[w.Xsansi.locate].loc].svgId

  if (!mySvgId && !otherSvgId) return
  if (mySvgId === otherSvgId) {
    $('#' + mySvgId).css('fill', 'green')
    w.Xsansi.locate = false
  }
  else {
    if (mySvgId) $('#' + mySvgId).css('fill', 'yellow')
    if (otherSvgId) $('#' + otherSvgId).css('fill', 'blue')
  }
  $('#rect10').css('fill', settings.darkModeActive ? '#606' : '#bbb')
  for (let id of [3334, 2800, 2788, 3330]) {
    $('#text' + id).css('fill', settings.darkModeActive ? 'white' : 'black')
    $('#text' + id).css('font-family', 'Orbitron, sans-serif')
  }
}




function isRoomPressured(room) {
  if (typeof room.vacuum === "string") room = w[room.vacuum];
  return !room.vaccum;
}


