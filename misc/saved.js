

const SPELL = {
  spellVerbs:['About', 'Cast'],
  cast:function(self) {
    msg('You cast <i>' + self.name + '</i>.');
  },
  icon:function() {
    return ('<img src="images/spell12.png" />');
  },
  getVerbs:function() {
    return (this.loc === "spellbook" ? ["About", "Cast"] : ["About", "Learn"]);
  },
}

const LASTING_SPELL = function() {
  var res = SPELL;
  return res;
}  

const INSTANT_SPELL = function() {
  var res = SPELL;
  return res;
}  

const WEAPON = function() {
  var res = TAKEABLE;
  res.icon = function() {
    return ('<img src="images/weapon12.png" />');
  };
  return res;
}  

const MONSTER = function() {
  var res = {};
  return res;
}  
const MULTI_MONSTER = function() {
  var res = {};
  return res;
}  
const MONSTER_ATTACK = function() {
  var res = {};
  return res;
}  





createRoom("spellbook", {
  examine:'A ancient tomb.',
});

createItem("charm", 
  SPELL,
  {loc:'spellbook', examine:"Charm will make the target think you are his or her friend.",}
);





const INVENTORIES = [
  {name:'Items Held', alt:'itemsHeld', test:isHeldNotWorn },
  {name:'Items Worn', alt:'itemsWorn', test:isWorn },
  {name:'Spells known', alt:'spells', 
    test:function(item) {
      return item.loc === "spellbook";
    }
  },
  {name:'Items Here', alt:'itemsHere', test:isHere },
];

