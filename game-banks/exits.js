"use strict";


exit_list = [
  {name:'northwest', abbrev:'NW'}, 
  {name:'forward', abbrev:'F'}, 
  {name:'northeast', abbrev:'NE'}, 
  {name:'in', abbrev:'In', alt:'enter|i', niceDir:"inside"}, 
  {name:'up', abbrev:'U', niceDir:"above"},
  
  {name:'port', abbrev:'P'}, 
  {name:'Look', abbrev:'Lk', nocmd:true}, 
  {name:'starboard', abbrev:'S'}, 
  {name:'out', abbrev:'Out', alt:'exit|o', niceDir:"outside"}, 
  {name:'down', abbrev:'Dn', alt:'d', niceDir:"below"}, 

  {name:'southwest', abbrev:'SW'}, 
  {name:'aft', abbrev:'A'}, 
  {name:'southeast', abbrev:'SE'}, 
  {name:'Wait', abbrev:'Z', nocmd:true}, 
  {name:'Help', abbrev:'?', nocmd:true}, 
];
