"use strict";



lang.exit_list = [
  {name:'forward-port', abbrev:'FP', niceDir:"forward-port", type:'compass', key:103, x:-1 ,y:1, z:0, opp:'aft-starboard', symbol:'fa-arrow-left', rotate:45}, 
  {name:'forward', abbrev:'F', niceDir:"forward", type:'compass', key:104, x:0 ,y:1, z:0, opp:'aft', symbol:'fa-arrow-up'}, 
  {name:'forward-starboard', abbrev:'FS', niceDir:"forward-starboard", type:'compass', key:105, x:1 ,y:1, z:0, opp:'aft-port', symbol:'fa-arrow-up', rotate:45}, 
  {name:'in', abbrev:'In', alt:'enter', niceDir:"inside", type:'inout', opp:'out', symbol:'fa-sign-in-alt'}, 
  {name:'up', abbrev:'U', niceDir:"above", type:'vertical', key:107, x:0 ,y:0, z:1, opp:'down', symbol:'fa-arrow-up'},
  
  {name:'port', abbrev:'P', niceDir:"port", type:'compass', key:100, x:-1 ,y:0, z:0, opp:'starboard', symbol:'fa-arrow-left'}, 
  {name:'Look', abbrev:'Lk', type:'nocmd', key:101, symbol:'fa-eye'}, 
  {name:'starboard', abbrev:'S', niceDir:"starboard", type:'compass', key:102, x:1 ,y:0, z:0, opp:'port', symbol:'fa-arrow-right'}, 
  {name:'out', abbrev:'Out', alt:'exit|o', niceDir:"outside", type:'inout', opp:'in', symbol:'fa-sign-out-alt'}, 
  {name:'down', abbrev:'Dn', alt:'d', niceDir:"below", type:'vertical', key:109, x:0 ,y:0, z:-1, opp:'up', symbol:'fa-arrow-down'}, 

  {name:'aft-port', abbrev:'AF', niceDir:"aft-port", type:'compass', key:97, x:-1 ,y:-1, z:0, opp:'forward-starboard', symbol:'fa-arrow-down', rotate:45}, 
  {name:'aft', abbrev:'A', niceDir:"aft", type:'compass', key:98, x:0 ,y:-1, z:0, opp:'forward', symbol:'fa-arrow-down'}, 
  {name:'aft-starboard', abbrev:'AS', niceDir:"aft-starboard", type:'compass', key:99, x:1 ,y:-1, z:0, opp:'forward-port', symbol:'fa-arrow-right', rotate:45}, 
  {name:'Wait', abbrev:'Z', type:'nocmd', key:110, symbol:'fa-clock'}, 
  {name:'Help', abbrev:'?', type:'nocmd', symbol:'fa-info'}, 
]

