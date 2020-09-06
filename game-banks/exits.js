"use strict";



lang.exit_list = [
  {name:'northwest', abbrev:'NW', niceDir:"the northwest", type:'compass', key:103, x:-1 ,y:1, z:0, opp:'southeast'}, 
  {name:'forward', abbrev:'F', niceDir:"forward", type:'compass', key:104, x:0 ,y:1, z:0, opp:'aft'}, 
  {name:'northeast', abbrev:'NE', niceDir:"the northeast", type:'compass', key:105, x:1 ,y:1, z:0, opp:'southwest'}, 
  {name:'in', abbrev:'In', alt:'enter|i', niceDir:"inside", type:'inout', opp:'out'}, 
  {name:'up', abbrev:'U', niceDir:"above", type:'vertical', key:107, x:0 ,y:0, z:1, opp:'down'},
  
  {name:'port', abbrev:'P', niceDir:"port", type:'compass', key:100, x:-1 ,y:0, z:0, opp:'starboard'}, 
  {name:'Look', abbrev:'Lk', type:'nocmd', key:101}, 
  {name:'starboard', abbrev:'S', niceDir:"starboard", type:'compass', key:102, x:1 ,y:0, z:0, opp:'port'}, 
  {name:'out', abbrev:'Out', alt:'exit|o', niceDir:"outside", type:'inout', opp:'in'}, 
  {name:'down', abbrev:'Dn', alt:'d', niceDir:"below", type:'vertical', key:109, x:0 ,y:0, z:-1, opp:'up'}, 

  {name:'southwest', abbrev:'SW', niceDir:"the southwest", type:'compass', key:97, x:-1 ,y:-1, z:0, opp:'northeast'}, 
  {name:'aft', abbrev:'A', niceDir:"aft", type:'compass', key:98, x:0 ,y:-1, z:0, opp:'forward'}, 
  {name:'southeast', abbrev:'SE', niceDir:"the southeast", type:'compass', key:99, x:1 ,y:-1, z:0, opp:'northwest'}, 
  {name:'Wait', abbrev:'Z', type:'nocmd', key:110}, 
  {name:'Help', abbrev:'?', type:'nocmd'}, 
]