"use strict"


createItem("PAGE", TAKEABLE(), {
  examine:'You look at the PAGE. It is a standard issue, type 3, doubtless one of dozens on the ship.',
  contactActiveOptions:[],
  lookUpActiveOptions:["SS Star Quest", "Sector 7 Iota"],
  //otherUseActiveOptions:['Read a book', 'News app', 'Messages'],
  loc:"player",
  
  verbFunction:function(verbList) {
    verbList.pop()
    if (this.loc !== 'player') return
    verbList.push("Missions")
    verbList.push("Crew roster")
    verbList.push("Contact")
    verbList.push("Look up")
    if (w.ship.arrivedAtSector) verbList.push("Star database")
    if (game.player.loc === 'library' && this.passwordKnown) verbList.push("Look up*")
    verbList.push("Other use")
  },

  contact:function() { this.usePage("contact", "contact") },
  lookup:function() { this.usePage("lookUp", "look up") },
  stardatabase:function() { this.usePage("star", "look up") },
  otheruse:function() { this.usePage("otherUse", "") },
  crewroster:function() {
    if (game.player.arrivedAtSector) {
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
    if (game.player.arrivedAtSector) {
      msg()
      
    }
    else {
      msg("Mission briefing: Proceed to sector 7 Iota and report to Commander Nagoshima at Star Base 142. Further details will provided on arrival." , {}, 'lookUp')
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
        msg(option.t, {}, s)
      }
      if (option.func) option.func()
    })
  },
})



const pageData = []
const addToEncyclopaedia = function(name, data) { pageData.push({name:data.alias, t:data.examine, type:'lookUp'}) }






addToEncyclopaedia("pirates", {
  alias:"Pirates",
  examine:"Pirates have plagued interstellar travel for centuries. ",
})
addToEncyclopaedia("star_quest", {
  alias:"SS Star Quest",
  examine:"The SS Star Quest is an {i:Intrepid} class warship, launched in {=Year(5)} from Newport, in Mars orbit. She is a general purpose ship, fitted with medical and science facilities, armaments and limited cargo facilities.<br/><br/>She has a mass of 984 te, has a typical crew of 54 plus 18 marines and can achieve a maximum speed of warp 6 with her two Mark 7 engines. She is armed with twin turbo lasers and hard-light torpedoes.",
})
addToEncyclopaedia("brakk", {
  alias:"The Brakk",
  examine:"The Brakk are a belligerent, war-like race who have taken it upon themselves to halt the natiral expansion of mankind into space.",
})
addToEncyclopaedia("admiralty", {
  alias:"The Admiralty",
  examine:"The Space Admiralty, or more often just the Admiralty, is the administration for Earth-based space military.",
})
addToEncyclopaedia("girrgirr", {
  alias:"The Girr-Girr",
  examine:"The Girr-Girr are a sentient race from the planet Noshtrim, noted for their abstract poetry and athletic dance. As a species, they tend to be quick and agile, if flighty.",
})
addToEncyclopaedia("sector", {
  alias:"Sector 7 Iota",
  examine:"Sector 7 Iota is approximately 60 lightyears from Earth, heading approximately away from the galatic centre. It is characterised by a cluster of some twenty stars, many with inhabited planets, with a limited number of outlying worlds at some remove.<br/><br/>The admiralty maintain Starbase 142 in orbit around Mendone III, the most populous planet.",
})
addToEncyclopaedia("salis", {
  alias:"Salis",
  examine:"Salis are a race of amorphous blobs. They were first encountered on Sirius Beta V, but xenobiologists consider it unlikely they originated there, as there are no other lifeforms on the planet with the same biochemistry. They had no written or oral history and so their origins remain a mystery.<br/><br/>Due to issues with communication, it was only some thirty years after discovery they were found to be sentient, and indeed to be particularly intelligent.",
})
addToEncyclopaedia("chal", {
  alias:"Chal",
  examine:"The similarities between the Chal and mankind, both in shape and in thought, are very apparent, and more than one commentator hassuggested this led to the three decades of war between the two species. After some five years of tentative peace, we are at last learning more about this species, and realising just how much we are alike.",
})
addToEncyclopaedia("stardate", {
  alias:"Stardate",
  examine:"The \"Stardate\" has been adopted as a universal time system across Accord space. Due to relativistic effects, time travels at different rates depending on the observer's own speed, and as stars are moving relative to each other, even different planets have slight different time rates. The Stardate is a theoretical time based on a stationary galaxy, and starts at midnight, new years day, 1970 in the original Earth-based system, taken as the start of te epoch.|It is split into parts, separated by dots. The first is the number of years since the start of the epoch. The second part is the number of days since the start of the year, the third part is the number of hours. Further divisions divide into minutes and second. Later parts may be omitted as convenient. Note that Stardate uses a \"standard year\", which is exactly 360 days long or 31,104,000 seconds.",
})













/*


createRoom("padd_system", {
})


createRoom("padd_toplevel", {
  loc:"padd_system",
  desc:"Welcome to PAGE 3.56, your Personal Analytical Generic Engine. It is {=Date} and our location is {=Location}. What would you like to do today?",
  Select officers:new Exit("padd_select_crew"),
  Missions:new Exit("padd_missions"),
  Encyclopaedia:new Exit("padd_encyclo"),
  Crew roster:new Exit("padd_crew_roster"),
  Journal:new Exit("padd_journal"),
})


createRoom("padd_select_crew", {
  loc:"padd_system",
  alias:"Select Officers",
  desc:"The Admiralty have short listed a number of candiates for your consideration.",
  Return:new Exit("padd_toplevel"),
})


createRoom("padd_crew_roster", {
  loc:"padd_system",
  desc:function() {
    msg ("Crew roster")
    const let l = []()
    foreach (o, GetDirectChildren (w.officer_posts)) {
      if (o.officer === null) {
        msg (o.byname({}) + ":" + Spaces(30 - o.alias.length) + "No assignment")
      }
      else {
        msg (o.byname({}) + ":" + Spaces(30 - o.alias.length) + o.officer.alias)
      }
    }
    msg ("Captain's aid:" + spaces(17) + "Janice Rand")
    msg ("Engineering:" + spaces(19) + game.eng_crew)
    msg ("Science:" + spaces(23) + game.sci_crew)
    msg ("Medical:" + spaces(23) + game.med_crew)
    msg ("Marines:" + spaces(23) + game.mar_crew)
  },
  Return:new Exit("padd_toplevel"),
})


createRoom("padd_candidate_prototype", {
  loc:"padd_system",
  desc:function() {
    msg(this.candidate.cv)
    let l = ListCombineGeneral(GetUnfilledOfficerPosts(), Split("Reject|Undecided", "|"))
    game.candidate_menu = this
    ShowMenu ("Choose", l, false) {
      if (!result === "Undecided") {
        if (result === "Reject") {
          RemoveObject (game.candidate_menu.candidate)
          msg (game.candidate_menu.candidate.byname({}) + " has been dropped from the list of candidates.")
        }
        else {
          AssignPost (game.candidate_menu.candidate, GetObject(result))
        }
        let ext = GetObject(GetExitByLink (w.padd_select_crew, game.candidate_menu))
        ext.locked = true
      }
      msg ("")
      game.pov.context = w.padd_select_crew
      ConsoleOptions
    }
  },
})


createRoom("padd_encyclo", {
  loc:"padd_system",
  desc:"Welcome to the Admirality Encyclopaedia.{either DisclaimerNeeded():<br/><br/>Please note that the admiralty cannot be held for any inaccuracy or inconsistency on the information contained herein. Continued use is taken as absolving the admiralty of any and all liability.<br/><br/>If you do notice any  inaccuracy or inconsistency, please communicate this to the admiralty.}",
  Return:new Exit("padd_toplevel"),
})


createRoom("padd_missions", {
  loc:"padd_system",
  desc:"Current Missions",
  Go to Sector 7 Iota:new Exit("padd_mission_sector"),
  Return:new Exit("padd_toplevel"),
})


createRoom("padd_mission_sector", {
  loc:"padd_system",
  alias:"Go to Sector 7 Iota",
  desc:"Communication from Star Base One:<br/><br/>{i:Welcome to your new command captain!<br/><br/>Your first mission is to travel to Sector 7 Iota. With the war against the Brakk, most of the fleet is otherwise engaged, and the Star Quest will be the Admiralty's only ship in that area.<br/><br/>Assemble a bridge team you can work with and you can trust before you go.<br/><br/>Once there you will be given further missions. You should use your discretion as to how and when you do them.<br/><br/>Good luck captain!}",
  Return:new Exit("padd_missions"),
})


createRoom("padd_journal", {
  loc:"padd_system",
  desc:function() {
    msg ("Welcome to your journal")
    msg ("")
    for (let s of this.entries) {
      msg(s)
    }
  },
  Return:new Exit("padd_toplevel"),
})


createRoom("officer_posts", {
})


createItem("helmsman", {
  loc:"officer_posts",
  alias:"First Helmsman",
})




createItem("science_officer", {
  loc:"officer_posts",
  alias:"Science Officer",
})


createItem("armsman", {
  loc:"officer_posts",
  alias:"First Armsman",
})


createItem("engineer", {
  loc:"officer_posts",
  alias:"Chief Engineer",
})


*/