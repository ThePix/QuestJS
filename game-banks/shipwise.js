"use strict";



lang.exit_list = [
  {name:'forward-port', abbrev:'FP', niceDir:"forward-port", type:'compass', key:103, x:-1 ,y:1, z:0, opp:'aft-starboard', symbol:'&#129132;'}, 
  {name:'forward', abbrev:'F', niceDir:"forward", type:'compass', key:104, x:0 ,y:1, z:0, opp:'aft', symbol:'&#129129;'}, 
  {name:'forward-starboard', abbrev:'FS', niceDir:"forward-starboard", type:'compass', key:105, x:1 ,y:1, z:0, opp:'aft-port', symbol:'&#129133;'}, 
  {name:'in', abbrev:'In', alt:'enter|i', niceDir:"inside", type:'inout', opp:'out', symbol:'&#8628;'}, 
  {name:'up', abbrev:'U', niceDir:"above", type:'vertical', key:107, x:0 ,y:0, z:1, opp:'down', symbol:'&#8613;'},
  
  {name:'port', abbrev:'P', niceDir:"port", type:'compass', key:100, x:-1 ,y:0, z:0, opp:'starboard', symbol:'&#129128;'}, 
  {name:'Look', abbrev:'Lk', type:'nocmd', key:101, symbol:'&#128065;'}, 
  {name:'starboard', abbrev:'S', niceDir:"starboard", type:'compass', key:102, x:1 ,y:0, z:0, opp:'port', symbol:'&#129130;'}, 
  {name:'out', abbrev:'Out', alt:'exit|o', niceDir:"outside", type:'inout', opp:'in', symbol:'&#8625;'}, 
  {name:'down', abbrev:'Dn', alt:'d', niceDir:"below", type:'vertical', key:109, x:0 ,y:0, z:-1, opp:'up', symbol:'&#8615;'}, 

  {name:'aft-port', abbrev:'AF', niceDir:"aft-port", type:'compass', key:97, x:-1 ,y:-1, z:0, opp:'forward-starboard', symbol:'&#129135;'}, 
  {name:'aft', abbrev:'A', niceDir:"aft", type:'compass', key:98, x:0 ,y:-1, z:0, opp:'forward', symbol:'&#129131;'}, 
  {name:'after-starboard', abbrev:'AS', niceDir:"after-starboard", type:'compass', key:99, x:1 ,y:-1, z:0, opp:'forward-port', symbol:'&#129134;'}, 
  {name:'Wait', abbrev:'Z', type:'nocmd', key:110, symbol:'&#9208;'}, 
  {name:'Help', abbrev:'?', type:'nocmd', symbol:'&#128712;'}, 
]