"use strict"





rpg.signalResponse_destroy = function() {
  this.msg("{nv:item:be:true} dispelled.", {item:this})
  rpg.destroy(this)
}