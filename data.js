const SPELL = {
  spellVerbs:['Examine', 'Cast'],
  cast:function(self) {
    msg('You cast <i>' + self.name + '</i>.');
  },
  icon:function() {
    return ('<img src="images/spell12.png" />');
  },
}

const WEAPON = {
  icon:function() {
    return ('<img src="images/weapon12.png" />');
  }  
}

var data = [
  
  createItem("me", [
    PLAYER,
    { loc:"lounge", }
  ]),

  createObject("kitchen", [{
    examine:'A clean room.',
    west:"lounge",
    north:new Exit('garden'),
  }]),

  createObject("lounge", [{
    examine:'A smelly room with an [old settee:couch:sofa] and a [tv:telly].',
    east:'kitchen'
  }]),

  createObject("garden", [{
    examine:'A wild and over-grown garden.',
    south:function(self) {
      msg("You head back inside.");
      setRoom('kitchen');
    },
  }]),

  createObject("spellbook", [{
    examine:'A ancient tomb.',
  }]),

  createItem("charm", [
    SPELL,
    {loc:'spellbook', examine:"Charm will make the target think you are his or her friend.",}
  ]),




  

  
  createItem("boots", [
    TAKABLE,
    WEARABLE,
    { loc:"lounge", pronouns:PRONOUNS.plural, examine:"Some old boots.", }
  ]),
  

  
  createItem("knife", [
    TAKABLE,
    WEAPON,
    { loc:"lounge", sharp:false, examine:function(item) {
      if (item.sharp) {
        msg("A really sharp knife.");
      }
      else {
        msg("A blunt knife.");
      } },
    }
  ]),


  createItem("glass cabinet", [
    CONTAINER,
    { loc:"lounge", examine:"A cabinet with a glass front", locked:true, transparent:true, }
  ]),


  createItem("cardboard box", [
    CONTAINER,
    { loc:"lounge", examine:"A big cardboard box.", closed:false, hereVerbs:['Examine', 'Close'], }
  ]),


  createItem("ornate doll", [
    TAKABLE,
    { loc:"glass cabinet", examine:"A fancy doll, eighteenth century." }
  ]),



  createItem("camera", [
    TAKABLE,
    { loc:"lounge", examine:"A cheap digital camera.", alias:"hat", listalias:"microscope" }
  ]),

  
  
  createItem("Mary", [
    NPC_OBJECT(true),
    { loc:"lounge", examine:"An attractive young lady.", askoptions:{
      house:"'I like it,' says Mary.",
      garden:"'Needs some work,' Mary says with a sign.",
    } }
  ]),

  createItem("TS_Test", [
    TURNSCRIPT(true, function(self) {
      msg('Turn script!');
    }),
  ]),

 
  createItem("coin", [
    TAKABLE,
    { loc:"lounge", examine: "A gold coin."  }
  ]),
  
];