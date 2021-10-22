"use strict"





parser.isRoom = function(o) { return o.room }

commands.unshift(new Cmd('GoToDest', {
  npcCmd:true,
  regex:/^(?:go to|go) (.+)$/,
  objects:[
    {scope:parser.isRoom}
  ],
  script:function(objects) {
    const room = objects[0][0]
    if (room === currentLocation) return failedmsg("As if by magic, you are suddenly... where you already were.")
    if (!room.room) return failedmsg("{pv:item:be:true} not a destination.", {item:room})
    for (const ex of currentLocation.dests) {
      if (room.name === ex.name) {
        return ex.use(player, ex) ? world.SUCCESS : world.FAILED
      }
    }
    return failedmsg("{pv:item:be:true} not a destination you can get to from here.", {item:room})
  },
}))




/*
npc_utilities.talkto = function() {
  if (!player.testTalk(this)) return false
  const topics = this.getTopics(this)
  player.conversingWithNpc = this
  if (topics.length === 0) return failedmsg(lang.no_topics, {char:player, item:this})
  topics.push(lang.never_mind)
  showSidePaneOptions(this, topics, function(result) {
    document.querySelector('#sidepane-menu').remove()
    if (result !== lang.never_mind) {
      log(result)
      result.runscript()
    }
  })
  return world.SUCCESS_NO_TURNSCRIPTS;
}

findCmd('TalkTo').objects[0].scope = function(item) {
  if (item.name === w.ship.onView) return true
  return item.isAtLoc(player.loc, world.PARSER) && (item.npc || item.player);
}*/


io.msgInputText = function(s) {
  if (!settings.cmdEcho || s === '') return
  document.querySelector("#output").innerHTML += '<p id="n' + io.nextid + '" class="input-text">&gt; ' + s.toUpperCase() + "</p>"
  io.nextid++
  if (io.spoken) io.speak(s, true)
  if (io.transcript) io.scriptAppend({cssClass:'input', text:s})
}



const roster = {
  data:[
    {name:'helm', alias:'Helm', skill:'navigation', desc:'The officer at the helm has responsibility for piloting the ship, and needs a good skill at navigation.'},
    {name:'engineering', alias:'Chief Engineer', skill:'engineering', desc:'The chief engineer has the job of ensuring all systems on the ship are running smoothly, working with the 28 ratings who make up most of the crew.'},
    {name:'science', alias:'Science Officer', skill:'science', desc:'The science officer leads a team of twelve, who are trained in various disciplines. He or she will report findings and opinions to the captains, as appropriate.'},
    {name:'armsman', alias:'Armsman', skill:'weapons', desc:'The armsman is responsible for targeting and firing the ship\'s weapons in the event of combat, which requires skill with the weapon as well as the ability to remain calm under pressure. The office will be in command of eight crewman who are responsible for maintenance of the weapon systems (so knowledge of engineering is of limited use). The officer is also in charge of the marines and shipboard security.'},
  ],
  // get the data for the given role
  getRole:function(pos) { return roster.data.find(el => el.name === pos) },
  // is an officer assigned to the role?
  hasOfficer:function(pos) { return w.ship[pos] !== undefined },
  // get the officer object assigned to the role or null if not set
  getOfficer:function(pos) { return this.hasOfficer(pos) ? w[w.ship[pos]] : null },
  // get a list of role names for the officer
  getRoles:function(officer) {
    const list = roster.data.map(el => el.name)
    if (officer === undefined) return list
    if (officer === true) return list.filter(el => w.ship[el] !== undefined)
    if (officer === false) return list.filter(el => w.ship[el] === undefined)
    if (typeof officer !== 'string') officer = officer.name
    return list.filter(el => w.ship[el] === officer)    
  },
  getRoster:function() {
    let s = 'Ship officer roster:'
    for (let el of roster.data) {
      if (roster.hasOfficer(el.name)) {
        s += '|' + el.alias + ': ' + roster.getOfficer(el.name).alias
      }
      else {
        s += '|' + el.alias + ': no assignment'
      }
    }
    return s
  },
  getCrew:function() {
    let l = []
    for (let el of roster.data) {
      if (roster.hasOfficer(el.name)) l.push(roster.getOfficer(el.name))
    }
    return l
  },
}






tp.addDirective("role", function(arr, params) {
  const pos = arr[0]
  const npc = roster.getOfficer(pos)
  if (!npc) {
    errormsg("TP Failed for role :" + arr.join(':'))
    return ''
  }
  const s = npc[arr[1]]
  return arr[2] === 'true' ? sentenceCase(s) : s
})

tp.addDirective("sir", function(arr, params) { return player.callmemaam ? "ma'am" : "sir" })
tp.addDirective("Sir", function(arr, params) { return player.callmemaam ? "Ma'am" : "Sir" })

tp.addDirective("time", function(arr, params) {
  return "Stardate " + w.ship.getDateTime(arr[0])
})




const newCmds = [
  { name:'Encyclopedia' },
  { name:'Press button' },
  { name:'Assign crew' },
  { name:'Crew roster' },
  { name:'Missions' },
  { name:'Contact planet' },
  { name:'Star database' },
  { name:'Intro1' },
  { name:'Intro2' },
  { name:'Intro3' },
]

for (let el of newCmds) {
  commands.unshift(new Cmd(el.name, {
    regex:new RegExp('^' + el.name.toLowerCase() + ' (.+)$'),
    attName:el.name.toLowerCase().replace(/ /g, ''),
    objects:[
      {scope:el.scopeHeld ? parser.isHeld : parser.isHere},
    ],
    defmsg:"{pv:item:'be:true} not something you can do that with.",
  }))
}








commands.unshift(new Cmd("JumpStart", {
  regex:/start/,
  objects:[
  ],
  script:function() {
    w.ship.helm = 'farrington_moss'
    w.ship.science = 'lashirr_hrong'
    w.ship.engineering = 'milton_keynes'
    w.ship.armsman = 'dakota_north'
    
    w.helmsman_go_to_7iota.script()
    //stars.arriveAtSector()
    return world.SUCCESS
  },
}))



