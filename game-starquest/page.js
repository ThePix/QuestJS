"use strict"


createItem("missions", {
  pageOption:true,
  verbFunction:function(verbList) {
    verbList.pop()
    for (const m of missions.getList()) verbList.push(m.alias)
  },
})

commands.unshift(new Cmd("Mission", {
  regex:/(.+) missions$/,
  objects:[
    {special:'text'},
  ],
  script:function(objects) {
    log(objects[0])
    const mission = missions.find(objects[0])
    log(mission)
    settings.startingDialogHtml = '<p>Name: <i>' + mission.alias + '</i></p>'
    settings.startingDialogHtml += '<p>Brief:</p>'
    const s = (typeof mission.brief === 'function') ? mission.brief() : mission.brief
    const ary = s.split('|')
    for (const el of ary) settings.startingDialogHtml += '<p><i>' + el + '</i></p>'
    settings.setUpDialog()
    return world.SUCCESS
  },
}))


createItem("crew_roster", {
  pageOption:true,
  verbFunction:function(verbList) {
    verbList.pop()
    if (w.ship.arrivedAtSector) {
      for (const o of roster.getCrew()) verbList.push(o.alias)
    }
    else {
      for (const o of getCandidates()) verbList.push(o.alias)
    }
  },
})

commands.unshift(new Cmd("Crew Roster", {
  regex:/(.+) crew roster$/,
  objects:[
    {scope:parser.isInWorld, attName:'npc'},
  ],
  script:function(objects) {
    log(objects[0])
    const o = objects[0][0]
    o.dutiesDiag()
    return world.SUCCESS
  },
}))



createItem("encyclopedia", {
  pageOption:true,
  askDiag:function(s, fromLink) {
    if (s.length === 0) return
    if (s.length < 3) {
      msg("On your PAGE you search for \"" + s + "\", but get over a billion hits. Perhaps search for something a few more characters long?")
      return
    }
    const regex = RegExp(s, 'i')
    for (const key in encyclopedia) {
      if (regex.test(key)) {
        if (!fromLink) msg("On your PAGE you search for \"" + s + "\".")
        let strs = []
        if (doOnce(w.PAGE, 'Encyclopaedia')) {
          strs.push("<b>Welcome to the Fleet Admiralty Encyclopaedia</b>")
          strs.push("Please note that the admiralty cannot be held accountable for any inaccuracy or inconsistency on the information contained herein. Continued use is taken as absolving the admiralty of any and all liability.")
          strs.push("If you do notice any  inaccuracy or inconsistency, please communicate this to the admiralty.")
        }
        const paras = encyclopedia[key].split('|')
        let flag = true
        for (const s of paras) {
          if (flag) {
            strs.push("<b>" + key + "</b> " + w.encyclopedia.expandRefs(s))
            flag = false
          }
          else {
            strs.push(w.encyclopedia.expandRefs(s))
          }
        }
        msgDiv(strs, {}, 'encyclopedia')
        return true
      }
    }
    if (fromLink) {
      msg("The link seems to be broken; you wondeer if you should report it to someone....")
    }
    else {
      msg("On your PAGE you search for \"" + s + "\", but find nothing of interest.")
    }
    return false      
  },
  expandRefs:function(s) {
    let match = s.match(/\[\[(.+)\]\]/)
    while (match) {
      log(match)
      const link = '<span onclick="runCmd(\'encyclopedia ' + match[1] + '\')" class="encycLink">' + match[1] + '</span>'
      log(match[0])
      log(link)
      s = s.replace(match[0], link)
      log(s)
      match = s.match(/\[\[.+\]\]/)
    }
    return s
  },
})

commands.unshift(new Cmd("Encyclopedia", {
  regex:/encyclopedia (.+)$/,
  objects:[
    {special:'text'},
  ],
  script:function(objects) {
    log(objects[0])
    w.encyclopedia.askDiag(objects[0], true) 
    return world.SUCCESS
  },
}))


createItem("PAGE", {
  starActiveOptions:[],

/*  //examine:'You look at the PAGE. It is a standard issue, type 3, doubtless one of dozens on the ship.',
  contactActiveOptions:[],
  lookUpActiveOptions:["SS Star Quest", "Sector 7 Iota", "Stardate", "The Brakk"],
  //otherUseActiveOptions:['Read a book', 'News app', 'Messages'],
  loc:"player",
  
  add:function(name, list) {
    const att = list + 'ActiveOptions'
    if (!this[att].includes(name)) this[att].push(name)
  },

  verbFunction:function(verbList) {
    verbList.pop()
    if (this.loc !== 'player') return
    verbList.push("Missions")
    verbList.push("Crew roster")
    //verbList.push("Contact")
    verbList.push("Encyclopedia")
    if (w.ship.arrivedAtSector) verbList.push("Star database")
  },

  contact:function() { this.usePage("contact", "contact") },
  encyclopedia:function() {
    askDiag("Search the web", function(s) {
      msg("On your PAGE you search for \"" + s + "\".")
      const regex = RegExp(s, 'i')
      log(s)
      for (const key in encyclopedia) {
        log(key)
        if (regex.test(key)) {
          if (doOnce(w.PAGE, 'Encyclopaedia')) msg("{i:Welcome to the Fleet Admiralty Encyclopaedia}|{i:Please note that the admiralty cannot be held for any inaccuracy or inconsistency on the information contained herein. Continued use is taken as absolving the admiralty of any and all liability.}|{i:If you do notice any  inaccuracy or inconsistency, please communicate this to the admiralty.}", {}, s)
          const paras = encyclopedia[key].split('|')
          let flag = true
          for (const s of paras) {
            if (flag) {
              msg("{i:{b:" + key + ":} " + s + "}")
              flag = false
            }
            else {
              msg("{i:" + s + "}")
            }
          }
          return true
        }
      }
      msg("You find nothing of interest.")
      return false      
    })
  },
  stardatabase:function() { this.usePage("star", "look up") },
  otheruse:function() { this.usePage("otherUse", "") },
  crewroster:function() {
    if (player.arrivedAtSector) {
      msg(roster.getRoster(), {}, 'lookUp')
      return
    }
    const choices = getCandidates()
    choices.push('Forget it')
    //log(choices)
    showMenuDiag("Use your PAGE to manage..?", choices, function(result) {
      //document.querySelector('#sidepane-menu').remove()
      if (result === 'Forget it') return
      console.log(result.name)
      console.log(result)
      result.dutiesDiag()
    })
  },
  missions:function() {
    const choices = missions.getList()
    choices.push('Forget it')
    showMenuDiag("Current missions", choices, function(result) {
      //document.querySelector('#sidepane-menu').remove()
      if (result === 'Forget it') return
      console.log(result.name)
      console.log(result)
      result.diag()
    })

  },
  usePage:function(s, s2, f) {
    const choices = this[s + 'ActiveOptions'].concat('Forget it')
    log(choices)
    showMenuDiag("Use your PAGE to " + s2 + "..?", choices, function(result) {
      //document.querySelector('#sidepane-menu').remove()
      if (result === 'Forget it') return
      if (f) {
        f(result)
        return
      }
    })
  },*/
  introHelp1:"All interactions in this game (except some explanatory links like this) are through the panel to the left. You can select different areas of the ship to visit, and from the shuttle bay may also be able to go off ship, depending on whether there is anything near by. You can also talk to people; giving your crew instructions is a big part of the game.|Your PAGE is also there; this gives you access to the ship computer. Use this is check the missions, view the encyclopedia or crew roster.",
  introHelp2:"Your first task is to assemble your crew by assigning candidates to posts on the bridge using your PAGE. Look at the missions on your PAGE for a quick overview of the candidates. You will need a helmsman, but other posts can be left empty if you wish. You can assign officers to multiple roles, but they will tend to be less effective in both roles. Some candidates are better suited to a certain roles than others, but it is up to you; if you want to appoint people to posts that will be poor at, go for it! Note that if you change your mind - perhaps after talking to the candidate - you can unassign the role for the current officer, and then assign it to your new choice.|Once you are happy with your crew, ask the helmsman to lay in a course for sector 7 Iota. Note that once you set off for Sector 7 Iota you cannot change assignments.|Once you arrive there, you will get a list of missions - you will need to prioritize. It may not be possible to  do everything, and the situation could change as time passes. In most cases it takes about a day to travel between star systems in the sector, but some systems are further out and will take longer; this will be noted in the mission. Obviously it will take a similar time to get back to a star system in the central cluster.",
  introHelp3:"If your screen is wide enough, you will see a star man on the right, but you do not need it to play the game. When you arrive in sector 7 Iota you will be able to toggle between  map of the stars in the sector and the star system you are currently at.|It is possible to die; bad decisions or just bad luck may lead to a bad ending.|Any similarity to a certain series from the sixties... and several other decades... is entirely coincidental. Honest.",
  intro1:function() {
    showDiag('Welcome to your new ship, captain!', '<br/>' + this.introHelp1.replace(/\|/g, '<br/><br/>'), 'Okay')
  },
  intro2:function() {
    showDiag('Getting started', '<br/>' + this.introHelp2.replace(/\|/g, '<br/><br/>'), 'Okay')
  },
  intro3:function() {
    showDiag('Additional notes', '<br/>' + this.introHelp3.replace(/\|/g, '<br/><br/>'), 'Okay')
  },
})



const pageData = []



const encyclopedia = {
  "SS Star Quest":"The SS Star Quest is an {i:Intrepid} class warship, launched {time:-195341} from Newport, in Mars orbit. Originally a top-of-the-line ship, she has been downgraded twice, and is now classified as a general purpose ship. She is fitted with medical and science facilities, armaments and limited cargo facilities.|She was re-fitted in {time:-49}, and as of the re-fit she has a mass of 984 te, a typical crew of 54 plus 18 marines and can achieve a maximum speed of warp 6 with her two Mark 7 engines. She is armed with twin turbo lasers and hard-light torpedoes. She is due to be decommissioned in {time:25,871}",
  "The Admiralty":"The Space Admiralty, or more often just the Admiralty, is the administration for Earth-based space military.",
  "Stardate":"The \"Stardate\" has been adopted as a universal time system across [[Union]] space. Due to relativistic effects, time travels at different rates depending on the observer's own speed, and as stars are moving relative to each other, even different planets have slight different time rates. The Stardate is a theoretical time based on a stationary galaxy. It uses midnight, New Year's day, 1970 in the original Earth-based system as the start of the epoch.|It is split into parts, separated by dots. The first is the number of years since the start of the epoch, the second part is the number of days since the start of the year, the third part is the number of hours. Further divisions divide into minutes and second. Later parts may be omitted as convenient. Note that Stardate uses a \"standard year\", which is exactly 360 days long or 31,104,000 seconds.",
  "Alliance":"Currently thirty four species spread across 3962 planets make up the alliance. Its aim is to promote peace and prosperity throughout the galaxy. The latest species to join the Alliance was the [[Chal]], five years ago.",
  "Terran Union of Planets":"Of the 84 planets that are considered to be terran (earth and its colonies), 68 are part of the Terran Union of Planets. The union aims to provide protect to its members, but is more of a trade organisation. Members are required to uphold certain rights for all sentient beings on the planets.|The Terran Union of Planets is a subset of the [[Alliance]].",

  // Species  
  "The Brakk":"The Brakk are a belligerent, war-like race who have taken it upon themselves to halt the natural expansion of mankind into space.",
  "The Girr-Girr":"The Girr-Girr are a sentient race from the planet Noshtrim, noted for their abstract poetry and athletic dance. As a species, they tend to be quick and agile, if flighty.",
  "Salis":"Salis are a race of amorphous blobs. They were first encountered on Sirius Beta V, but xenobiologists consider it unlikely they originated there, as there are no other lifeforms on the planet with the same biochemistry. They had no written or oral history and so their origins remain a mystery.|Due to issues with communication, it was only some thirty years after discovery they were found to be sentient, and indeed to be particularly intelligent.",
  "Chal":"The similarities between the Chal and mankind, both in shape and in thought, are very apparent, and more than one commentator has suggested this led to the three decades of war between the two species. After some five years of tentative peace, we are at last learning more about this species, and realising just how much we are alike.",
  
  // Locations
  "Sector 7 Iota":"Sector 7 Iota is approximately 60 lightyears from Earth, heading approximately away from the galatic centre. It is characterised by a cluster of some twenty stars, many with inhabited planets, with a limited number of outlying worlds at some remove.|The admiralty maintain Starbase 142 in orbit around Mendone III, the most populous planet.",
  "83":"Starbase 83 orbits the sun in the same orbit as Earth, at L4, and is considered third starbase at that location, though the first was an unmanned telescope. Its primary role is assembling, re-fitting and overhaul of fleet starships. It has no civilian facilities.",
  
  // Other
  "pirates":"Pirates have plagued interstellar travel for centuries. The vastness of space has turned out to be the biggest defence against pirates, but also the biggest obstacle in eradicating them altogether.",
  
}













/*








createRoom("padd_mission_sector", {
  loc:"padd_system",
  alias:"Go to Sector 7 Iota",
  desc:"Communication from Star Base One:<br/><br/>{i:Welcome to your new command captain!<br/><br/>Your first mission is to travel to Sector 7 Iota. With the war against the Brakk, most of the fleet is otherwise engaged, and the Star Quest will be the Admiralty's only ship in that area.<br/><br/>Assemble a bridge team you can work with and you can trust before you go.<br/><br/>Once there you will be given further missions. You should use your discretion as to how and when you do them.<br/><br/>Good luck captain!}",
  Return:new Exit("padd_missions"),
})

*/