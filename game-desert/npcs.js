"use strict";



createItem("Lucas",
  NPC(false),
  { 
    notes:"Black guy, twenties, bi-sexual, good at cooking",
    loc:"bus",
    status:"okay",
    //properName:true,
    alias:'younger man',
    scenery:true,
    relationship:0,
    examine:"Lucas is a tall, slender black guy, wearing a tight-fitting orange vest top and khaki shorts. He has spiky blonde hair.",

    // Conversations
    askOptions:[
      {
        test:function(p) { return p.text.match(/newcastle/); }, 
        response:function() {
          msg("'What's Newcastle like?' you ask Kyle.");
          msg("'It's... okay. But no better than that. I guess it's too close to Sydney, and anything interesting goes there, so its kinda dull.'");
          trackRelationship(w.Kyle, 1, "background2");
        }},
      
      
    ],
    
  }
);






createItem("Emily",
  NPC(true),
  { 
    notes:"Redhead, twenties, into spiritualism, plays several instruments",
    loc:"bus",
    status:"okay",
    //properName:true,
    alias:'younger woman',
    scenery:true,
    relationship:0,
    examine:"Emily is a slim redhead, wearing a cropped wgite top and tiny demin shorts. Her long hair looks a little too red to be natural.",

    // Conversations
    askOptions:[
      {
        test:function(p) { return p.text.match(/newcastle/); }, 
        response:function() {
          msg("'What's Newcastle like?' you ask Kyle.");
          msg("'It's... okay. But no better than that. I guess it's too close to Sydney, and anything interesting goes there, so its kinda dull.'");
          trackRelationship(w.Kyle, 1, "background2");
        }},
      
      
    ],
    
    suspended:true,
    agenda:[
      "pause",
      "text:The redhead stands up and stretches. 'You think I've got time to go to the bathroom?'", 
      "text:The oriental turns around to look at the redhead. 'We'll make sure he doesn't go without you,' she says.'", 
      "walkTo:bus_front",
      //"joinedBy:Lara:'Sure,' says Lara.",
      //"walkTo:garden:inTheGardenWithLara:'Look at all the beautiful flowers,' says Arthur.:Through the window you see Arthur say something to Lara.",
      //"text:Lara smells the flowers.",
    ],
  }
);





createItem("Elijah",
  NPC(false),
  { 
    notes:"forties, conspiracy nut, refusing to fly, quite wealthy",
    loc:"bus",
    status:"okay",
    //properName:true,
    alias:'older man',
    scenery:true,
    relationship:0,
    examine:"Elijah looks to be in his forties. He is about average height, but looks quite muscular. He is wearing a black \"Ramones\" tee-shirt and faded jeans.",

    // Conversations
    askOptions:[
      {
        test:function(p) { return p.text.match(/newcastle/); }, 
        response:function() {
          msg("'What's Newcastle like?' you ask Kyle.");
          msg("'It's... okay. But no better than that. I guess it's too close to Sydney, and anything interesting goes there, so its kinda dull.'");
          trackRelationship(w.Kyle, 1, "background2");
        }},
      
      
    ],
    
  }
);





createItem("Amy",
  NPC(true),
  { 
    notes:"Korean parentage, thirties, Christian, into video games",
    loc:"bus",
    status:"okay",
    //properName:true,
    alias:'older woman',
    scenery:true,
    relationship:0,
    examine:"Amy is a slim oriental woman, with long black hair falling around her shoulders. She looks to be in her mid-thirties, maybe a little older. She is wearing a blushing pink top and black leggings.",

    // Conversations
    askOptions:[
      {
        test:function(p) { return p.text.match(/newcastle/); }, 
        response:function() {
          msg("'What's Newcastle like?' you ask Kyle.");
          msg("'It's... okay. But no better than that. I guess it's too close to Sydney, and anything interesting goes there, so its kinda dull.'");
          trackRelationship(w.Kyle, 1, "background2");
        }},
      
      
    ],
    
  }
);

