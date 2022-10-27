"use strict"




rpg.signalResponse_destroy = function() {
  this.msg("{nv:item:be:true} dispelled.", {item:this})
  rpg.destroy(this)
}





quest.create('A carrot for Lara', [
  {
    text:'Go find a carrot.',
    intro:'The rabbit, who you instictive feel is called Lara, claims she will fade away unless given a carrot.',
    //test:function(chr) { return w.carrot.loc === chr.name},
  },
  {
    text:'Give the carrot to Lara.', 
    intro:'Now you have the carrot you better give it to Lara quickly before she fades away.',
    //test:function(chr) { return w.carrot.loc === 'rabbit'},
    label:'carrot given',
  },
])

