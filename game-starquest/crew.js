"use strict"


createItem("player", PLAYER(), {
  loc:"bridge",
  crewSummary:'',
  mission_assemble_crew:1,
  missionStart_assemble_crew:w.ship.dateTime,
  mission_sector_7_iota:1,
  missionStart_sector_7_iota:w.ship.dateTime,
})  
  





// Your boss
createItem("nagoshima", NPC(true), {
  alias:"Commander Nagoshima",
  properNoun:true,
  isAtLoc:function(loc, situation) { return situation === world.PARSER && w.ship.onView === this.name },
  examine:"Despite her striking black hair, which she wears in a neat bun, you would judge Commander Nagoshima to be in her fifties. You find yourself warming to her smile.",
  convTopics:[
    {
      name:"nagoshima_missions",
      showTopic:true,
      alias:"Mission?",
      nowShow:['nagoshima_brakk', 'nagoshima_backwater', 'nagoshima_other_militrary'],
      msg:"'I imagine you have some specific missions you need us for,' you say to the commander.|'Indeed! Quite a few in fact; as I say, we have been sorely lacking in available ships. You should already have them on your PAGE.'",
    },
    {
      name:"nagoshima_backwater",
      alias:"Why are you assigned to such a backwater?",
      nowHide:['nagoshima_cushy'],
      msg:"'This is quite the backwater. What did you do to get this posting?' you ask the commander.|'Hah! Yes, I've had a run in or two with the top brass. But I'd have to know you better before I say anything about that. Still it's not so bad here. Sometimes I can almost convince myself it more of a comfy retirement.'",
    },
    {
      name:"nagoshima_cushy",
      alias:"Seems a cushy assignment for you",
      nowHide:['nagoshima_backwater'],
      msg:"'This is nice quiet sector. How did you get such a cushy assignment?' you ask the commander.|'I wish. The Union has virtually no miliary presence here at all, and half the planets are not even in the union. It has its quiet days, but when things get rough, they get very rough, and there is precious little I can do.'",
    },
    {
      name:"nagoshima_other_militrary",
      alias:"Other fleet forces in the sector?",
      msg:"'What other fleet forces are in the sector?' you ask the commander.|'We have a few shuttles and courier ships, but that is about it. The only weaponry worth a damn in on this starbase. We have agents on a few planets, but even they are spread too thin.'",
    },
    {
      name:"nagoshima_brakk",
      alias:"Mission?",
      msg:"'Any problems with the Brakk?' you ask the commander.|'Just some odd rumours; nothing confirmed. We're not far from the border, but I guess there's not much to interest them here.'",
    },
  ],
})





    



createItem("yeoman", NPC(true), {
  loc:"bridge",
  alias:"Yeoman Rand",
  properNoun:true,
  examine:"Yeoman Rand arrived at Starbase One on the same shuttle as you, and you conversed with her a little on the journey; this is her first assignment to a star ship. She is above average height for a woman, with cropped blonde hair, and is dressed smartly in the fleet uniform.",
  convTopics:[
    {
      name:"yeoman_settling_in",
      showTopic:true,
      alias:"Are you settling in okay?",
      script:function() {
        msg("'Are you settling in okay?' you ask Yeoman Rand.");
        msg("'Yes, {sir}. It's much bigger than the ships I'm used to, but I'm finding my way around.'");
        msg("'Well, I'm not used to commanding anything this big. We'll both have to get used to it.'");
        msg("'Yes {sir}.'");
      },
    },
    {
      name:"yeoman_academy",
      showTopic:true,
      alias:"Which space academy did you go to?",
      nowShow:['yeoman_dewar_pun'],
      script:function() {
        msg("'What academy did you graduate from?' you ask Yeoman Rand.");
        msg("'Nairobi, Earth, {sir}.'");
        msg("'Must've been hot.'");
        msg("'They do have air con there... But outside, yes, it could be very hot.'");
        msg("'I'm a Mars alumni myself. I wanted to get out into space as soon as possible, and that seemed like the first step.'");
        msg("'Oh, I was born on Dewar III. I suppose I did it in reverse. I wanted to go to the centre of it all - Earth.'");
      },
    },
    {
      name:"yeoman_dewar_pun",
      alias:"Is it always the same temperature of Dewar III?",
      script:function() {
        msg("'So is it always the same temperature of Dewar III?' you ask with a smile, recalling that James Dewar invented the vacuum flask.");
        msg("She signs. 'Hilarius, sir. In fact the region where I was raised was notable for its extremes of temperature.'");
      },
    },
    {
      name:"yeoman_call_me_maam",
      //showTopic:true,
      alias:"Call me ma'am",
      script:function() {
        msg("'I prefer ma'am to sir,' you tell the yeoman.");
        msg("'As you wish, ma'am.'");
        player.callmemaam = true        
      },
    },
  ],
})



const CANDIDATE = function(female) {
  const res = NPC(female)
  res.candidate = true
  res.properNoun = true
  res.dutiesDiag = function() {
    settings.startingDialogHtml = '<p>Name: <i>' + this.alias + '</i></p>'
    settings.startingDialogHtml += '<p>Species: <i>' + this.species + '</i></p>'
    settings.startingDialogHtml += '<p>Comments: <i>' + this.cv + '</i></p>'
    settings.startingDialogHtml += '<input type="hidden" name="name" id="diag-name" value="' + this.name + '"/>'
    for (let role of roster.data) {
      const npc = roster.getOfficer(role.name)
      if (!w.ship.arrivedAtSector) {
        if (npc === this) {
          settings.startingDialogHtml += '<p><input type="checkbox" name="' + role.name + '" id="diag-' + role.name + '" checked="yes"/> ' + role.alias + '</p>'
        }
        else if (npc) {
          settings.startingDialogHtml += '<p><input type="checkbox" checked="yes" disabled="yes"/> ' + role.alias + ': <i>' + npc.alias + '</i></p>'
        }
        else {
          settings.startingDialogHtml += '<p><input type="checkbox" name="' + role.name + '" id="diag-' + role.name + '"/> ' + role.alias + '</p>'
        }
      }
      else {
        if (npc === this) {
          settings.startingDialogHtml += '<p>Assigned as: ' + role.alias + '</p>'
        }
      }
    }
    
    settings.dialogType = 'crew roster'
    settings.setUpDialog()
  }
  if (!res.entering) res.entering = '{nm:char} enters the bridge.'
  if (!res.leaving) res.leaving = '{nm:char} leaves the bridge.'
  return res
}

const getCrew = function() { }

const getCandidates = function() { return scopeBy(o => o.candidate).sort(function(a, b) {
  var nameA = a.name.toUpperCase()
  var nameB = b.name.toUpperCase()
  return (nameA < nameB ? -1 : 1)
})}



const belongsToHelm = function(loc) {
  log(loc)
  return w.ship.helm && loc === w.ship.helm
}





createItem("sharraaa", CANDIDATE(false), {
  alias:"Sharraaa",
  examine:"Sharraaa is a pink, and somewhat translucent, blob. He is sat in bucket from which he raises a pseudopod as the need arises.",
  weapons:"5",
  engineering:"6",
  science:"7",
  navigation:"6",
  summary:'Jack-of-all-trades amorphous blob.',
  formalName:"Shu Sharraaa",
  ayeaye:"He raises a pseudopod to indicate assent.",
  dissent:"Sharraaa raises two  pseudopods, indicating his disapproval.",
  alreadyHere:"Sharraaa slumps a little in his bucket. For a moment, you wonder what is wrong, then realise you are already here.",
  going:"Sharraaa morphs over the controls, rapidly setting the destination, and a moment later the ship starts to move. There is that stomach-clenching lurch as it hits warp speed...",
  firstFlight:"{role:helm:altName:true} punches in the coordinates.|'Engage!'|The SS Star Quest gently eases out of star-dock, into open space, then, with a stomach-churning lurch, accelerates to warp speed. The stars on the viewscreen become thin red lines as the ship heads to its destination at speeds hard to properly understand unless you are a navigator.",
  thoughtful:"Sharraaa quivers in thought.",
  scared:"Sharraaa goes perfectly still.",
  incredulous:"Sharraaa slumps in surprise.",
  cv:"For an amorphous blob, Sharraaa shows a remarkable aptitude in a number of areas, though the absence of a mouth can present communications problems in some roles.",
  species:"Salis",
  altName:"the Salis",
})


createItem("farrington_moss", CANDIDATE(false), {
  alias:"Farrington Moss",
  examine:"Farrington is a well-muscled man, with cropped hair that almost looks painted on. His uniform is crisply smart and he seems to be constantly standing at attention, even when in his seat.",
  weapons:"5",
  engineering:"4",
  science:"1",
  navigation:"8",
  summary:'Excellent helmsman; wants to move into weapon.',
  formalName:"Mister Moss",
  ayeaye:"'{Sir}! Yes, {sir}!'",
  dissent:"'Is that wise, {sir}?'",
  alreadyHere:"'{Sir}, we're already here.'",
  going:"Farrington punches in the co-ordinates, and engages the engages, smoothly accelerating to warp speed.",
  firstFlight:"He deftly punches in the coordinates. 'Ready to go, Sir.'|'Engage!'|The SS Star Quest gently eases out of star-dock, into open space, then smoothly accelerates to warp speed. The stars on the viewscreen become thin red lines as the ship heads to its destination at speeds hard to properly understand unless you are a navigator.",
  thoughtful:"Farrington looks thoughtful for a moment.",
  scared:"'Holy crap,' exclaimed Farrington.",
  incredulous:"'What the deuce?' exclaimed Farrington.",
  cv:"Farrington Moss has been in the space navy for 17 years, after joining as an enlisted officer from the academy on Mars with a rating of 86. His last position was Helmsman on the Andromeda, though he is keen to be considered as Armsman Officer. For the love of God, do not ask him about ???.",
  species:"human",
  altName:"he",
})


createItem("lashirr_hrong", CANDIDATE(true), {
  alias:"Lashirr Hrong",
  examine:"Like most  Girr-Girr, Lashirr is tall and gangling. The sensory nodules covering her yellowy-green skin do serve to fill out her uniform, but in a manner that looks rather odd to the human eye.",
  weapons:"2",
  engineering:"5",
  science:"8",
  navigation:"1",
  summary:'A Girr-Girr, who nevertheless is an excellent science officer.',
  formalName:"Ms Hrong",
  ayeaye:"'Of course, captain.'",
  alreadyHere:"Lashirr starts to type in the co-ordinates, then pauses, humming thoughtfully. 'Captain, I believe we're already here.'",
  going:"After some thoughtful humming, Lashirr starts to tentatively punch in the co-ordinates. '{random:I think that's right:Hopefully should be it:I... yes, that {i:should} be right:Yes... No... wait, I can do this. That... might be right},' she says. There is an abrupt lurch, and the ship is moving. Suddenly it hits light speed, and you can taste your lunch again.\"",
  firstFlight:"{role:helm:altName:true} slowly punches in the coordinates. 'Ready to...No wait.' Some more typing. 'I better just check that... Yes, I think that's right.'|'Engage!'|The SS Star Quest eases out of star-dock with a couple of bumps, into open space, then, then, with a stomach-turning lurch, accelerates to warp speed. The stars on the viewscreen become thin red lines as the ship heads to its destination and speeds hard to properly understand unless you are a navigator. And in {role:helm:alias}'s case, not even then.",
  thoughtful:"Lashirr hums tunelessly as she considers.",
  scared:"'That's a concern,' Lashirr observes.",
  incredulous:"'That's odd,' Lashirr notes.",
  cv:"Lashirr is a Girr-Girr, but nevertheless has an excellent background in science. Her piloting skills are limited.",
  species:"Girr-Girr",
  altName:"the Girr-Girr",
})


createItem("dakota_north", CANDIDATE(true), {
  alias:"Dakota North",
  examine:"Dakota is a tall, slim woman, with blonde hair in a neat ponytail. She has a stern look and eyes of steel.",
  weapons:"9",
  engineering:"4",
  science:"3",
  navigation:"5",
  summary:'Excellent track record as an armsman.',
  formalName:"Ms North",
  ayeaye:"'Yes {sir}!'",
  dissent:"'With respect, is that wise, {sir}?'",
  alreadyHere:"'With respect, {sir}, I think we are already here.'",
  going:"Dakota punches in the co-ordinates, and engages the engages, smoothly accelerating to warp speed.",
  firstFlight:"{role:helm:altName:true} slowly punches in the coordinates. 'Ready to go, Sir.'|'Engage!'|The SS Star Quest gently eases out of star-dock, into open space, then, then, with a stomach-turning lurch, accelerates to warp speed. The stars on the viewscreen become thin red lines as the ship heads to its destination and speeds hard to properly understand unless you are a navigator.",
  thoughtful:"Dakota frowns for a moment.",
  scared:"Dakota frowns for a moment.",
  incredulous:"Dakota frowns for a moment.",
  cv:"Dakota North is very much a professional soldier, joining as a marine and working her way up the ranks. Her weapon skills are second to none.",
  species:"human",
  altName:"she",
})


createItem("river_severn", CANDIDATE(true), {
  alias:"River Severn",
  examine:"River is a petite woman, whose long, flowing, blue hair indicates a casual regard for the regulations, to say nothing of the unfastened button on her collar and the bangles and earrings.",
  weapons:"1",
  engineering:"6",
  science:"10",
  navigation:"5",
  summary:'While great at science, she has issues with authority.',
  formalName:"Ms Severn",
  ayeaye:"'No problem.'",
  dissent:"'No way!'",
  alreadyHere:"'We're already here,' says River with a smirk.",
  going:"'Let's see...' River types in the coordinates. 'Hold on tight, boys and girls,' she says as she engages the engines. The Star Quest starts to accelerate, hitting warp speed with an unpleasant lurch.",
  firstFlight:"{role:helm:altName:true} slowly punches in the coordinates. 'Ready to go, Sir.'|'Engage!'|The SS Star Quest gently eases out of star-dock, into open space, then, then, with a stomach-turning lurch, accelerates to warp speed. The stars on the viewscreen become thin red lines as the ship heads to its destination and speeds hard to properly understand unless you are a navigator.",
  thoughtful:"River goes into a trance for a moment, deep in meditation.",
  scared:"'Oh, shit,' exclaims River.",
  incredulous:"'Like,wow...' exclaims River.",
  cv:"River Severn gained a Ph.D. in biology from MIT and was on track to be one of their youngest professors, until an undisclosed incident caused her to rethink her career. She joined the fleet, and her knowledge of biology, and indeed all science, has been of great value, though she does have issues with insubordination.",
  species:"human",
  altName:"River",
  convTopics:[
    {
      name:"river_incident_mit",
      showTopic:true,
      alias:"Incident at MIT",
      script:function() {
        msg("'Your record mentions an \"incident\" while you were at MIT.'");
        msg("'Too dreadful to mention!' she says, with a straight face. Then she smiles. 'No, it was just some wild parties that got seriously out of control. Good times... But the university starting saying the damage had to be paid for, so I had to get a proper job. Bummer. I mean, no offense, but when do you guys smile?'");
      },
    },
  ],
})





createItem("milton_keynes", CANDIDATE(false), {
  alias:"Milton Keynes",
  examine:"A thick-set man, shorted than average, with hands like shovels, Milton looks like he could pummel the engines into submission if necessary.",
  weapons:"4",
  engineering:"9",
  science:"4",
  navigation:"3",
  summary:'One of the best engineers in the fleet.',
  formalName:"Mr Keynes",
  ayeaye:"'Aye aye, {sir}.'",
  dissent:"'That's not a good idea, {sir}.'",
  alreadyHere:"'That's where we're already at, {sir}.'",
  going:"Milton types in the co-ordinates. He says a prayer under his breathe, then engages the engines. You feel your stomach heave as the ship goes to warp speed.{first: It seems his gods are not powerful enough to ensure a smooth journey...}",
  firstFlight:"{role:helm:altName:true} slowly punches in the coordinates. 'Ready to go, Sir.'|'Engage!'|The SS Star Quest gently eases out of star-dock, into open space, then, then, with a stomach-turning lurch, accelerates to warp speed. The stars on the viewscreen become thin red lines as the ship heads to its destination and speeds hard to properly understand unless you are a navigator.",
  thoughtful:"A look of concentration appears on Milton's face.",
  scared:"'God's preserve us,' says Milton.",
  incredulous:"'By the gods!' says Milton.",
  cv:"Milton Keynes is an excellent engineer, though his religious convictions can occasionally be an issue",
  species:"human",
  altName:"he",
  convTopics:[
    {  
      name:"milton_religion",
      showTopic:true,
      alias:"Religion",
      script:function() {
        msg("'I hear you're a religious man, Milton.'");
        msg("'Indeed, {sir}. Janus, the bifold godhead, the One True Religion.'");
        msg("'Er, remind me...'");
        msg("'The twin gods, Yinus and Yango, that rules our lives. Yinus the goddess who controls all that is moving, the flowing river of time, the entropy of the universe. Yango the god, controlling all that is static, the foundations of the world, the energy of the universe. I'll give you one of my pamphlets; it explains how the whole of creation is set out in the Book of the All, written by the prophet.'");
        msg("'Yeah, I'll read it... later. I guess.'");
      },
    }
  ],
})





createItem("norton_canes", CANDIDATE(false), {
  alias:"Norton Canes",
  examine:"Norton is a slender man, with a thin mustache, and raven black hair in a ponytail. Though his uniform is buttoned and polished, it still looks messy on him, and there is a distinctly seedy look about him.",
  weapons:"7",
  engineering:"4",
  science:"3",
  navigation:"6",
  summary:'Good at helm and weapons, but some irregularities in his record.',
  formalName:"Mr Canes",
  ayeaye:"'Alright, guv.'",
  dissent:"'Not sure about that, guv.'",
  alreadyHere:"'We're 'ere already, guv.'",
  going:"'Right you are, gov.' Norton punches in the coordinates, ",
  firstFlight:"{role:helm:altName:true} punches in the coordinates. 'Ready to go, Sir.'|'Engage!'|The SS Star Quest gently eases out of star-dock, into open space, then, then, with a stomach-turning lurch, accelerates to warp speed. The stars on the viewscreen become thin red lines as the ship heads to its destination and speeds hard to properly understand unless you are a navigator.",
  thoughtful:"Norton looks pensive.",
  scared:"'Fuck!'",
  incredulous:"'Stone the crows.'",
  cv:"Controversy seems to have dogged Norton Canes throughout his career, though it must be emphasized that nothing was ever proven in any of the cases. His graduation from Nairobi academy was questioned after irregularities in the marking came to light, and he resigned his post on the Storm of Fury and later the Demonic Trout when the ships' accounts were audited. Despite all this there is no doubt that he is a capable office in any role, especially that of armsman.",
  species:"human",
  altName:"he",
  convTopics:[
    {
      name:"norton_storm_of_fury",
      showTopic:true,
      alias:"Storm of Fury",
      script:function() {
        msg("'So you served on the Storm of Fury?' you ask Norton.");
        msg("'That's right, guv, under Captain Mallet. Good ship that Storm of Fury, bigger than this one, that's for sure.'");
        msg("'And you resigned?'");
        msg("'Yeah... All a bit awkward really. There was these... mistakes in the inventory. Seemed best all around if I just walked away from it.'");
      },
    },
    {
      name:"norton_demonic_trout",
      showTopic:true,
      alias:"Demonic Trout",
      script:function() {
        msg("'You were on the Demonic Trout?'");
        msg("'Yeah, gov. Right tug it was. Maximum warp two point three if you was lucky.'");
        msg("'And you resigned from it?'");
        msg("'Couldn't get off it quick enough. First sign of trouble, I was out of there.'");
      },
    },
    {
      name:"marking_irregularies",
      showTopic:true,
      alias:"Marking irregularies",
      script:function() {
        msg("'I heard there were marking irregularities when you graduated.'");
        msg("'Stone me, that story gets round fast, gov. I don't know much about it really, but there was a right brouhaha. Well, I suppose it's only to be expected. You work 'ard for years, then some joker goes and... I was right dischuffed. We all was.'");
      },
    },
  ],
})


createItem("info", CANDIDATE(false), {
  alias:"Info",
  examine:"Info is a sophisticated robot; a cylinder on crawler trackers, standing a little over average height for a man, from which six arms can extend, each suited to a different task. He has a flashing orange light on the top; a health and safety requirement.",
  weapons:"4",
  engineering:"3",
  science:"1",
  navigation:"1",
  summary:'Experimental android.',
  formalName:"Info",
  ayeaye:"'Affirmative.'",
  dissent:"'Negative.'",
  alreadyHere:"Beep. Beep. Beep. 'Current location.' Beep. Beep. Beep.",
  going:"Beep. Beep. Beep. The robot extends a metal arm, and methodically punches in the required coordinated. Beep. With a jerk, the Star Quest starts to move, then a jolt to the {random:left:right}, and a lurch. The jump to warp speed leaves you clutching your stomach.",
  firstFlight:"{role:helm:altName:true} slowly punches in the coordinates. 'Ready to...No wait.' Some more typing. 'I better just check that... Yes, I think that's right.'|'Engage!'|The SS Star Quest eases out of star-dock with a couple of bumps, into open space, then, then, with a stomach-turning lurch, accelerates to warp speed. The stars on the viewscreen become thin red lines as the ship heads to its destination and speeds hard to properly understand unless you are a navigator. And in {role:helm:alias}'s case, not even then.",
  thoughtful:"Beep. Beep. Beep. Beep. Beep.",
  scared:"Beep.",
  incredulous:"Beep-beep.",
  cv:"Info is an experimental prototype, the mark 4 version in his line. As yet, the Admiralty cannot fully endorse Info as an officer, but firmware upgrades are frequent, and with each one Info becomes better equipped to deal with any situation.",
  species:"robot",
  altName:"the robot",
})


createItem("restrel_juazz", CANDIDATE(true), {
  alias:"Restrel Juazz",
  examine:"The Chal are perhaps the most human-like of all the alien races mankind has discovered, and Restrel is very obviously a female. Her skin is smooth, green with a hint of blue, her hair a deep blue. She is a little shorter than you, but not by much.",
  weapons:"5",
  engineering:"3",
  science:"9",
  navigation:"4",
  summary:'Excellent science officer; on exchange with Chal fleet.',
  formalName:"Kr Juazz",
  ayeaye:"'Yes {sir}.'",
  dissent:"'I can't do that, {sir}.'",
  alreadyHere:"'We're already here,' says Restral pointedly.",
  going:"Restrel types in the coordinates. '{random:Your input systems leave a lot to be desired:Most inefficient:How can anyone use such an awkward system}.' She engages the engines, and the Star Quest accelerates to warp speed with a stomach-churning lurch. {random:You need more efficient momentum dampers:Do you not have phase-shift suppressors:The engines require shimming:Clearly an imbalance in the injector system; they should be serviced}.'",
  firstFlight:"{role:helm:altName:true} slowly punches in the coordinates. 'Ready to go, Sir.'|'Engage!'|The SS Star Quest gently eases out of star-dock, into open space, then, then, with a stomach-turning lurch, accelerates to warp speed. The stars on the viewscreen become thin red lines as the ship heads to its destination and speeds hard to properly understand unless you are a navigator.",
  thoughtful:"She tilts her head as she thinks.",
  scared:"She narrows eyes.",
  cv:"As part of the on-going peace process, officers from the fleet have exchanged places with Chal officers so we can better understand each other. Restrel Juazz has recently become available; this would be her first assignment on an Admiralty ship. Kr Juazz comes highly commended in all areas, but it is worth bearing in mind that she will be unfamiliar with our vessels.",
  convTopics:[
    {
      showTopic:true,
      alias:"Peace treaty",
      script:function() {
        msg("'What's your take on the peace treaty, Restrel?'")
        msg("'I just hope it lasts, {sir}. I know many Chal are concerned; how can we have peace with such blood-thirsty people? Many are worried it is a ploy to learn our secrets, steal our technology.'")
        msg("'What about you?'")
        msg("'I... know it's a possibility, but I think we have to at least make the effort to make this work.'")
      },
    },
    {
      showTopic:true,
      alias:"Earth technology",
      script:function() {
        msg("'How are you coping with earth technology, Restrel?'")
        msg("'Okay, I think. To be honest, the hardest part was the language. The science is more a question of perspective and the engineering is - well, just fascinating.'")
      },
    },
  ],
  species:"Chal",
  altName:"the Chal",
})









createItem("helmsman_go_to_7iota", TOPIC(true), {
  belongsTo:belongsToHelm,
  nowShow:['helmsman_go_to_star', 'helmsman_go_to_location'],
  alias:"Lay in a course for 7 Iota",
  script:function() {
    msg("'Lay in a course for sector 7 Iota,' you say to {role:helm:formalName}, 'warp factor 4.'")
    msg("{role:helm:ayeaye} " + roster.getOfficer('helm').firstFlight)
    hr()
    msg("Nine days later you arrive at Star Base 142. Yeoman Rand walks on to the bridge. 'Sir, we have a communication from the Star Base.'")
    msg("'Main screen, yeoman.'")
    msg("'Yes Sir.'")
    msg("A woman's face appears on the screen, Commander Nagoshima you assume, noting the rank of her uniform. 'Welcome to the ass-end of the galaxy, Captain' she says with a smile. 'It's good to have a ship around that can actually do something. I've sent over the mission briefs; they should be on your PAGE.'")
    stars.arriveAtSector()
  }
})


createItem("helmsman_go_to_star", TOPIC(false), {
  belongsTo:belongsToHelm,
  hideAfter:false,
  alias:"Lay in a course for star...",
  script:function() {
    showMenuDiag("Which star system?", stars.getStarNames(), function(result) {
      log(result)
      if (result === lang.never_mind) return
      const system = stars.getSystem(result)
      log(system)
    })
    return world.SUCCESS
  }
})

createItem("helmsman_go_to_location", TOPIC(false), {
  belongsTo:belongsToHelm,
  hideAfter:false,
  alias:"Lay in a course for location in this system...",
  script:function() {
    let l = []
    //for (const star og

  }
})
