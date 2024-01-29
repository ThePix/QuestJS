"use strict"

/*
The WAIT command causes a turn (3 months) to pass.
It is handled in four phases, with the results output at the end

initTurn    Initialise stuff
beforeTurn  Calculate bonuses
doTurn      Apply bonuses to determine world state
afterTurn   React to the new world state

*/

findCmd('Wait').script = function() {
  for (const s of ['initTurn', 'beforeTurn', 'doTurn', 'afterTurn']) {
    for (const key in w) {
      const o = w[key]
      if (o[s]) o[s]()
    }
  }

  if (home.output) {
    msg(home.output.join('|'))
  }
  else {
    msg('Not much happens.')
  }
  
  return world.SUCCESS
}

/*
Something that progresses over the course of the game, tracked with the progress
attribute.

You should give it alias, examine and efficiency attributes, and also flag it to
appear in whatever inventory. Set discovered to true to have it going from the start
*/
const PROGRESSABLE = function() {
  const res = NPC()
  res.loc = 'me'
  res.progress = 0
  res.invShow = function() { return this.discovered},
  res.initTurn = function() {
    this.bonus = 0
  }
  res.beforeTurn = function() {
    if (!this.discovered) return
    
    this.progress += this.efficiency * (100 + this.bonus) / 100
    home.output.push('Science marches on!')
  }
  return res;
}



const createDiscovery = function(name, data) {
  
  const o = createItem(name, data)
  if (!o.beforeTurn) {
    o.beforeTurn = function() {
      if (this.active) w[this.bonusTo].bonus += this.bonusValue
    }
  }

  createItem(o.name + '_convTopicQ', TOPIC(), {
    loc:o.belongsTo,
    alias:sentenceCase(o.alias),
    showTopic:true,
    discoveryName:o.name,
    hideAfter:false,
    isVisible:function(loc) { return w[this.loc].discovered },
    script:function(options) {
      msg(w[options.topic.discoveryName].question)
      if (!w[options.topic.discoveryName].choices) {
        w[options.topic.discoveryName].choices = [
          {
            alias:'Yes',
            properNoun:true,
            script:function() {
              w[options.topic.discoveryName].active = true
              msg(options.topic.alias + ": Enabled")
            }
          },      
          {
            alias:'No',
            properNoun:true,
            script:function() {
              w[options.topic.discoveryName].active = false
              msg(options.topic.alias + ": Disabled")
            }
          },      
        ]
      }
      showMenuDiag(w[options.topic.discoveryName].question, w[options.topic.discoveryName].choices, function(result) {
        log(result)
        result.script()
      })
    },
  })
}


