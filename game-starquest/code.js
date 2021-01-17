"use strict"





npc_utilities.talkto = function() {
  if (!game.player.canTalk(this)) return false
  const topics = this.getTopics(this)
  if (topics.length === 0) return failedmsg(lang.no_topics, {char:game.player, item:this})
  topics.push(lang.never_mind)
  showSidePaneOptions(this, topics, function(result) {
    $('#sidepane-menu').remove()
    if (result !== lang.never_mind) {
      result.runscript()
    }
  })
  return world.SUCCESS_NO_TURNSCRIPTS;
}

function showSidePaneOptions(title, options, fn) {
  if (typeof title !== 'string') title = 'Talk to ' + lang.getName(title, {article:DEFINITE}) + ':'
  const opts = {article:DEFINITE, capital:true}
  io.input('', options, false, fn, function(options) {
    let s = '<div id="sidepane-menu"><p class="sidepane-menu-title">' + title + '</p>'
    for (let i = 0; i < options.length; i++) {
      s += '<p value="' + i + '" onclick="io.menuResponse(' + i + ')" class="sidepane-menu-option">';
      s += (typeof options[i] === 'string' ? options[i] : lang.getName(options[i], opts))
      s += '</p>';
    }
    s += '</div>'
    $('body').append(s)
  })
}



io.msgInputText = function(s) {
  if (!settings.cmdEcho || s === '') return
  $("#output").append('<p id="n' + io.nextid + '" class="input-text">&gt; ' + s.toUpperCase() + "</p>")
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
  }  
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

tp.addDirective("sir", function(arr, params) { return game.player.callmemaam ? "ma'am" : "sir" })
tp.addDirective("Sir", function(arr, params) { return game.player.callmemaam ? "Ma'am" : "Sir" })

tp.addDirective("time", function(arr, params) {
  return "Stardate " + w.ship.getDateTime()
})




const newCmds = [
  { name:'Look up' },
  { name:'Press button' },
  { name:'Assign crew' },
  { name:'Crew roster' },
  { name:'Missions' },
  { name:'Contact planet' },
  { name:'Star database' },
]

for (let el of newCmds) {
  commands.unshift(new Cmd(el.name, {
    regex:new RegExp('^' + el.name.toLowerCase() + ' (.+)$'),
    attName:el.name.toLowerCase().replace(/ /g, ''),
    objects:[
      {scope:el.scopeHeld ? parser.isHeld : parser.isHere},
    ],
    default:function(item) {
      msg("{pv:item:'be:true} not something you can do that with.", {item:item});
      return false;
    },
  }))
}



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




