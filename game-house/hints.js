  "use strict"

const hintSystem = {}
hintSystem.toWiki = function() {
  for (const el of hintSystem.hints) {
    blankLine()
    msg('***')
    blankLine()
    msg("#### " + el.name)
    for (const [i, value] of el.hints.entries()) {
      blankLine()
      msg("&lt;details>")
      msg(" &lt;summary>Clue " + lang.toWords(i+1) + "&lt;/summary>")
      msg(" " + value)
      msg("&lt;/details>")
    }    
  }
}  



findCmd('MetaHint').script = function() {
  if (!player.hintCounter) player.hintCounter = new Array(hintSystem.hints.length).fill(0)
    
  


  return world.SUCCESS_NO_TURNSCRIPTS;
}



hintSystem.hints = [
  {
    name:"In to the house",
    hints:[
      "Pick up the letter, and the house will let you inside.",
    ],
  },

  {
    name:"Find Boots",
    hints:[
      "Head south from the hall to the gallery, then east; you will be in a huge room. You need to shift the cabinet, to access the hole behind it.",
      "If you have seen the giant cabinet, head back to the gallery, and go to the other end, and then east again, to see the same room, but normal size. Should be easier to move the cabinet.",
      "Head south from the hall to the gallery, then east; you will be in a huge room. You need to shift the cabinet, to access the hole behind it. Now, head back to the gallery, and go to the other end, and then east again, to see the same room, but normal size. Should be easier to move the cabinet. You can now go back to the gallery, returning to the giant room -- the cabinet is now proud of the wall, and you can access the hole, to get the boots."
    ],
  },

  {
    name:"It's Alive",
    hints:[
      "Down from the Great Hall is the Mad Science Lab. What does every mad scientist need to animate a body? Reading the journal might give an extra clue.",
      "You are going to need lightning to animate a body. Grab the coil of wire, and see what you can find. Where might you find lightning?",
      "You are going to need lightning to animate a body. Grab the coil of wire, and take it up to the observatory. Now, how are you going to get on to the roof?",
      "You are going to need lightning to animate a body. Grab the coil of wire, and take it up to the observatory. Use the lever and wheels to open the roof, lower the telescope and point it west.",
      "You are going to need lightning to animate a body. Grab the coil of wire, and take it up to the observatory. Use the lever and wheels to open the roof, lower the telescope and point it west. Climb up and attach the wire to the weather vane.",
    ],
  },

  {
    name:"Boots Again",
    hints:[
      "Patch will not wear the boots while they have a hole in them. Who could fix them?",
      "Patch will not wear the boots while they have a hole in them. However, the little guy in the nursery has some skill in that area. You just need to make the boots small and stop the room resetting.",
      "Patch will not wear the boots while they have a hole in them. However, the little guy in the nursery has some skill in that area. You just need to make the boots small by dropping them in the giant drawing room, and then picking them up in the normal drawing room. Now just stop the nursery resetting.",
      "Patch will not wear the boots while they have a hole in them. However, the little guy in the nursery has some skill in that area. You just need to make the boots small by dropping them in the giant drawing room, and then picking them up in the normal drawing room. Back at the nursery, occasionally knock the balloon to keep it afloat, while you ask the man to fix the boots. Once done, Patch will put them on?",
    ],
  },

  {
    name:"Even More Boots",
    hints:[
      "Patch will not wear the boots because there is something inside one of them. But are you going to get it out?",
      "Patch will not wear the boots because there is something inside one of them. The way to get it out, is to use the drawing room to make them big, then go inside them.",
    ],
  },

  {
    name:"The Key",
    hints:[
      "Get some advice from the mannequin in the theatre. You may need to wind him up.",
      "Get some advice from the mannequin in the theatre. You will need to wind him up using a key, like the one in the dining room, but bigger.",
      "Get some advice from the mannequin in the theatre. You will need to wind him up using a key, like the one in the dining room, but bigger. Drop the key in the giant drawing room, then pick it up from normal-sized drawing room. Now you can wind up the mannequin.",
      "Get some advice from the mannequin in the theatre. You will need to wind him up using a key, like the one in the dining room, but bigger. Drop the key in the giant drawing room, then pick it up from normal-sized drawing room. Now you can wind up the mannequin, and he will ask a riddle. Perhaps there i something in her bag?",
      "Get some advice from the mannequin in the theatre. You will need to wind him up using a key, like the one in the dining room, but bigger. Drop the key in the giant drawing room, then pick it up from normal-sized drawing room. Now you can wind up the mannequin, and he will ask a riddle. The book she starts with changes as she go to different areas.",
      "Get some advice from the mannequin in the theatre. You will need to wind him up using a key, like the one in the dining room, but bigger. Drop the key in the giant drawing room, then pick it up from normal-sized drawing room. Now you can wind up the mannequin, and he will ask a riddle. Her book will become Hamlet in the Great Hall.",
    ],
  },

  {
    name:"The Horse",
    hints:[
      "After resolving \"The Key\", you can turn the knight on the chess board in the gallery to reach the battlefield.",
      "After resolving \"The Key\", you can turn the knight on the chess board in the gallery to reach the battlefield. Heading south will get you to the beach, where you can get sand. Do you have a vessel?",
      "After resolving \"The Key\", you can turn the knight on the chess board in the gallery to reach the battlefield, but male sure you picked up the chamber pot from the solar first. Heading south will get you to the beach, where you can get sand. What else is here?",
      "After resolving \"The Key\", you can turn the knight on the chess board in the gallery to reach the battlefield, but male sure you picked up the chamber pot from the solar first. Heading south will get you to the beach, where you can get sand. Go southwest to find a oar.",
      "After resolving \"The Key\", you can turn the knight on the chess board in the gallery to reach the battlefield, but male sure you picked up the chamber pot from the solar first. Heading south will get you to the beach, where you can get sand. Go southwest to find a oar. Turning the horse on the chess board got you here, so use the oar to turn the horse on the battlefield to get back.",
    ],
  },
  
  {
    name:"The Seed",
    hints:[
      "The seed pods are out of reach, but perhaps you could knock them down?",
      "The seed pods are out of reach, but you could knock them down. If you had someone to catch it, the silvers would not be able to steal them.",
      "The seed pods are out of reach, but you could knock them down. Tell Patch to wait below to catch it -- the silvers will not be able to steal it.",
      "The seed pods are out of reach, but you could knock them down. Tell Patch to wait below to catch it -- the silvers will not be able to steal it. Now you just need something sharp to open the pod.",
      "The seed pods are out of reach, but you could knock them down. Tell Patch to wait below to catch it -- the silvers will not be able to steal it. Now you just need something sharp to open the pod; like broken glass?",
      "The seed pods are out of reach, but you could knock them down. Tell Patch to wait below to catch it -- the silvers will not be able to steal it. Now you just need something sharp to open the pod; like broken glass! You cannot break the windows in the greenhouse, but most other rooms have windows.",
    ],
  }, 

  {
    name:"Grow A Tree",
    hints:[
      "If you plant a seed in the bare earth, can you get it to grow? The thing in the boot might give a hint.",
      "If you plant a seed in the bare earth, you can use the hourglass to get it to grow.",
      "Plant a seed in the bare earth, put the hourglass on the pedestal and then turn it. The seed grows! Into a tiny plant. How can you prolong the growing time?",
      "Plant a seed in the bare earth, put the hourglass on the pedestal and then turn it. The seed grows! Into a tiny plant. How can you prolong the growing time? Repeated use of the hourglass will not work, you need the hourglass to take longer.",
      "Plant a seed in the bare earth, put the hourglass on the pedestal and then turn it. The seed grows! Into a tiny plant. How can you prolong the growing time? Repeated use of the hourglass will not work, you need the hourglass to take longer, by both making it bigger and putting more sand in it.",
      "Plant a seed in the bare earth, put the hourglass on the pedestal and then turn it. The seed grows! Into a tiny plant. How can you prolong the growing time? Repeated use of the hourglass will not work, you need the hourglass to take longer, by both making it bigger and putting more sand in it. The can use the chamber pot from the solar to carry sand (and see the clues for \"The Horse\" for the sand).",
      "Plant a seed in the bare earth, put the hourglass on the pedestal and then turn it. The seed grows! Into a tiny plant. How can you prolong the growing time? Repeated use of the hourglass will not work, you need the hourglass to take longer, by both making it bigger and putting more sand in it. The can use the chamber pot from the solar to carry sand (and see the clues for \"The Horse\" for the sand). You need to make the hourglass huge to successfully pour sand into it the small opening.",
    ],
  }, 

  {
    name:"Up A Tree",
    hints:[
      "It the tree is big enough to be useful, you cannot climb straight up it. There are two ways around that...",
      "It the tree is big enough to be useful, you cannot climb straight up it. You can walk up to the catwalk, and get to it that way, or get Patch to help you.",
    ],
  }, 

  {
    name:"The Riddle",
    hints:[
      "Talking to Malewicz will give clues; there are if a different colour to make it even easier!",
      "Talking to Malewicz will give clues; there are if a different colour to make it even easier! Google a few.",
      "Talking to Malewicz will give clues; there are if a different colour to make it even easier! Google a few. Or look at her bag.",
      "Talking to Malewicz will give clues; there are if a different colour to make it even easier! Google a few. Or look at her bag. Come on, I cannot make this any easier, there is only ONE thing it can be!",
    ],
  }, 
]