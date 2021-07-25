"use strict"


createItem("PAGE", {
  examine:'You look at the PAGE. It is a standard issue, type 3, doubtless one of dozens on the ship.',
  starActiveOptions:[],
  contactActiveOptions:[],
  lookUpActiveOptions:["SS Star Quest", "Sector 7 Iota", "Stardate", "The Brakk"],
  //otherUseActiveOptions:['Read a book', 'News app', 'Messages'],
  loc:"player",
  
  add:function(name, list) {
    const att = list + 'ActiveOptions'
    if (!this[att].includes(name)) this[att].push(name)
  },

  verbFunction:function(verbList) {
    log(verbList)
    verbList.pop()
    if (this.loc !== 'player') return
    verbList.push("Missions")
    verbList.push("Crew roster")
    verbList.push("Contact")
    verbList.push("Encyclopedia")
    if (w.ship.arrivedAtSector) verbList.push("Star database")
  },

  contact:function() { this.usePage("contact", "contact") },
  encyclopedia:function() {
    showTextDiag("Search the web", function(s) {
      msg("On your PAGE you search for \"" + s + "\".")
      const regex = RegExp(s, 'i')
      log(s)
      for (const key in encyclopedia) {
        log(key)
        if (regex.test(key)) {
          msg("{i:{b:" + key + ":} " + encyclopedia[key] + "}")
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
    this.crewActiveOptions = getCandidates()//.map(el => el.alias)
    this.usePage("crew", "manage", function(result) {
      console.log(result.name)
      console.log(result)
      result.dutiesDiag()
    })
  },
  missions:function() {
    if (w.ship.arrivedAtSector) {
      msg(missions.getList(), {}, 'lookUp')
    }
    else {
      msg("Mission briefing: Proceed to sector 7 Iota and report to Commander Nagoshima at Star Base 142. Further details will provided on arrival.", {}, 'lookUp')
    }
  },
  usePage:function(s, s2, f) {
    const choices = this[s + 'ActiveOptions'].concat('Forget it')
    log(choices)
    showSidePaneOptions("Use your PAGE to " + s2 + "..?", choices, function(result) {
      $('#sidepane-menu').remove()
      if (result === 'Forget it') return
      if (f) {
        f(result)
        return
      }
      const option = pageData.find(el => result.includes(el.name) && el.type === s)
      if (!option) {
        console.log(result)
        console.log(pageData)
        return errormsg("Problem...")
      }
      if (option.t) {
        msg('You look up "' + option.name + '" on your PAGE:')
        if (doOnce(w.PAGE)) msg("{i:Welcome to the Fleet Admiralty Encyclopaedia}|Please note that the admiralty cannot be held for any inaccuracy or inconsistency on the information contained herein. Continued use is taken as absolving the admiralty of any and all liability.|If you do notice any  inaccuracy or inconsistency, please communicate this to the admiralty.", {}, s)
        msg(option.t, {}, s)
      }
      if (option.func) option.func()
    })
  },
})



const pageData = []



const encyclopedia = {
  "pirates":"Pirates have plagued interstellar travel for centuries.",
  "SS Star Quest":"The SS Star Quest is an {i:Intrepid} class warship, launched {time:-43254} from Newport, in Mars orbit. She is a general purpose ship, fitted with medical and science facilities, armaments and limited cargo facilities.|She has a mass of 984 te, has a typical crew of 54 plus 18 marines and can achieve a maximum speed of warp 6 with her two Mark 7 engines. She is armed with twin turbo lasers and hard-light torpedoes.",
  "The Brakk":"The Brakk are a belligerent, war-like race who have taken it upon themselves to halt the natural expansion of mankind into space.",
  "The Admiralty":"The Space Admiralty, or more often just the Admiralty, is the administration for Earth-based space military.",
  "The Girr-Girr":"The Girr-Girr are a sentient race from the planet Noshtrim, noted for their abstract poetry and athletic dance. As a species, they tend to be quick and agile, if flighty.",
  "Sector 7 Iota":"Sector 7 Iota is approximately 60 lightyears from Earth, heading approximately away from the galatic centre. It is characterised by a cluster of some twenty stars, many with inhabited planets, with a limited number of outlying worlds at some remove.|The admiralty maintain Starbase 142 in orbit around Mendone III, the most populous planet.",
  "Salis":"Salis are a race of amorphous blobs. They were first encountered on Sirius Beta V, but xenobiologists consider it unlikely they originated there, as there are no other lifeforms on the planet with the same biochemistry. They had no written or oral history and so their origins remain a mystery.|Due to issues with communication, it was only some thirty years after discovery they were found to be sentient, and indeed to be particularly intelligent.",
  "Chal":"The similarities between the Chal and mankind, both in shape and in thought, are very apparent, and more than one commentator has suggested this led to the three decades of war between the two species. After some five years of tentative peace, we are at last learning more about this species, and realising just how much we are alike.",
  "Stardate":"The \"Stardate\" has been adopted as a universal time system across Accord space. Due to relativistic effects, time travels at different rates depending on the observer's own speed, and as stars are moving relative to each other, even different planets have slight different time rates. The Stardate is a theoretical time based on a stationary galaxy. It uses midnight, New Year's day, 1970 in the original Earth-based system as the start of the epoch.|It is split into parts, separated by dots. The first is the number of years since the start of the epoch, the second part is the number of days since the start of the year, the third part is the number of hours. Further divisions divide into minutes and second. Later parts may be omitted as convenient. Note that Stardate uses a \"standard year\", which is exactly 360 days long or 31,104,000 seconds.",
}













/*








createRoom("padd_mission_sector", {
  loc:"padd_system",
  alias:"Go to Sector 7 Iota",
  desc:"Communication from Star Base One:<br/><br/>{i:Welcome to your new command captain!<br/><br/>Your first mission is to travel to Sector 7 Iota. With the war against the Brakk, most of the fleet is otherwise engaged, and the Star Quest will be the Admiralty's only ship in that area.<br/><br/>Assemble a bridge team you can work with and you can trust before you go.<br/><br/>Once there you will be given further missions. You should use your discretion as to how and when you do them.<br/><br/>Good luck captain!}",
  Return:new Exit("padd_missions"),
})

*/