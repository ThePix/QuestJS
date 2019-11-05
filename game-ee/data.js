"use strict";


createItem("me",
  PLAYER(),
  { loc:"sickbay", regex:/^(me|myself|player)$/, examine: "Just a regular guy.", }
);

createItem("all_tool",
  { 
    loc:"me",
    alias:"AllTool",
    getVerbs:function() { return ["Examine", "Use"]; },
    examine: "Your AllTool is a high-spec version of the device. You can use it to access numerous databases and IT systems, as well as controlling certain drones and make cyber attacks. For reasons that I am sure are obvious, you would need to go to a terminal to read your e-mails.|[Do USE ALLTOOL to look things up on it.]",
    getTopics:npc_utilities.getTopics,
    use:npc_utilities.talkto,
    pause:function() {},
  }
);


createItem("consult_brittany",
  TOPIC(true),
  { 
    loc:"all_tool",
    alias:"Ship: Brittany",
    nowShow: ["consult_fastness", "consult_fastness_council"],
    script:function() {
      msg("{b:Ship: Brittany}|The SS Brittany was a frigate of the Systems Accord fleet, fitted with specialised stealth and exploration equipment It was lost in a battle with the Gith six months ago.");
    },
  }
);

createItem("consult_accord",
  TOPIC(true),
  { 
    loc:"all_tool",
    alias:"Organisation: Systems Accord",
    nowShow: ["consult_fastness", "consult_fastness_council"],
    script:function() {
      msg("{b:Organisation: Systems Accord}|The Accord is an agreement between Earth and most human colony worlds. It involves trade agreements, defence agreements and a common legal system. it was established in 2465, and now includes over sixty worlds, howabout at least twenty human colonies are not part of the Accord, feeling it to be too restrictive.");
    },
  }
);

createItem("consult_garmr",
  TOPIC(true),
  { 
    loc:"all_tool",
    alias:"Organisation: GARMR",
    nowShow: ["consult_fastness", "consult_fastness_council"],
    script:function() {
      msg("{b:Organisation: GARMR}|GARMR is a para-milirary organisation that hold to human supremacy at the expense of other species. Due to their disregard for the lives of alien species in their activities, they are considered a terrorist organisation by both the Systems Accord and the Fastness Council.|GARMR stands for Guardian Agent Response for Mankind Required. That it is als the name of the guarddog of Hell in Norse mythology is just coincidence...");
    },
  }
);

createItem("consult_fastness",
  TOPIC(false),
  { 
    loc:"all_tool",
    alias:"Station: Fastness",
    script:function() {
      msg("{b:Station: Fastness}|The Fastness is a huge, deep-space orbital, built eons ago. As an independent site, it has become a meeting place of all the great space-faring aliens, and is the home of the Fastness Council|It is definitely not a trap.");
    },
  }
);

createItem("consult_fastness_council",
  TOPIC(false),
  { 
    loc:"all_tool",
    alias:"Organisation: Fastness Council",
    script:function() {
      msg("{b:Organisation: Fastness Council}|The council is the body responsibly for resolving inter-species disputes, and is run by the more important space-faring races (in their opinion anyway).");
    },
  }
);









createRoom("brittany_lift",
  TRANSIT("north"),
  {
    desc: "The lift is large and well l;it, with a set of buttons at the back.",
    north:new Exit('flight_deck'),
  }
);
createItem("button_1",
  TRANSIT_BUTTON("brittany_lift"),
  {
    alias:"Button: 1",
    examine:"A button with the number 1 on it.",
    transitDest:"captains_room",
    transitAlreadyHere:"You press the button; nothing happens.",
    transitGoToDest:"You press the button; the door closes  and the lift goes to level 1.",
  }
);
createItem("button_2",
  TRANSIT_BUTTON("brittany_lift"),
  {
    alias:"Button: 2",
    examine:"A button with the number 2 on it.",
    transitDest:"flight_deck",
    transitAlreadyHere:"You press the button; nothing happens.",
    transitGoToDest:"You press the button; the door closes  and the lift goes to level 2.",
  }
);
createItem("button_3",
  TRANSIT_BUTTON("brittany_lift"),
  {
    alias:"Button: 3",
    examine:"A button with the number 3 on it.",
    transitDest:"mess",
    transitAlreadyHere:"You press the button; nothing happens.",
    transitGoToDest:"You press the button; the door closes  and the lift goes to level 3.",
  }
);











createRoom("captains_room",
  {
    desc: ".",
    south:new Exit('brittany_lift'),
  }
);





createRoom("flight_deck",
  {
    desc: "From here, you cmmand the ship. Forward is the galaxy map, a huge holographic display you can use to plot a destination. Beyond, is the cockpit, where the pilot sits.",
    south:new Exit('brittany_lift'),
    north:new Exit('cockpit'),
    west:new Exit('armoury'),
    east:new Exit('laboratory'),
  }
);

createRoom("cockpit",
  { 
    desc: "This is where Jester sits... {once:All the time. Seriously, it is like he eats and sleeps here. Does he never go to the bathroom? Jester is sat in a contour chair, and is surrounded by screens, giving an all arouund view of outside of the ship. {once:About half of the are filled with Lambda Station.}",
    south:new Exit('flight_deck'),
  }
);

createRoom("armoury",
  {
    desc: ".",
    east:new Exit('flight_deck'),
  }
);

createRoom("laboratory",
  {
    desc: ".",
    west:new Exit('flight_deck'),
  }
);















createRoom("mess",
  {
    desc: ".",
    south:new Exit('britanny_lift'),
    north:new Exit('guns_battery'),
    east:new Exit('sickbay'),
    west:new Exit('malinda_office'),
    afterFirstEnter:function() {
      msg("A man steps up to you. 'Commander Herdsman, it's an honour to finally meet you.' He is dressed in a military uniform - the insignia is GARMR. 'I'm James Couturier. I'm the weapons specialist assigned to the Brittany. You can usually find me in the armoury, but when I heard you were awake, I just had to come and talk to the greatesrt man ever.'");
    }
  }
);



createRoom("guns_battery",
  {
    desc: ".",
    south:new Exit('mess'),
  }
);

createRoom("sickbay",
  {
    desc: "The sickbay is small, with just two beds on one side, and a desk on the other. Nevertheless, it looks very well equipped, with various monitors and devices surrounding each bed.",
    west:new Exit('mess'),
  }
);

createItem("quechua",
  NPC(true),
  {
    alias:"Dr Quechua",
    regex:/doctor|quechua|dr/,
    loc:"sickbay",
    examine:"Dr Quechua is much as you remember her, if perhaps a little greyer. She is slim, and a little on the short side. She has grey, caring eyes, and a warm smile. She is wearing a white lab coat with a GARMR logo on it.",
  }
);

createItem("quechua_what_was_wrong",
  TOPIC(true),
  { 
    loc:"quechua",
    alias:"What was wrong with me?",
    //nowShow: ["consult_fastness", "consult_fastness_council"],
    script:function() {
      msg(".");
    },
  }
);





createRoom("malinda_office",
  {
    desc: ".",
    east:new Exit('mess'),
  }
);







