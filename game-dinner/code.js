"use strict"




createItem("dinner_timetable", AGENDA_FOLLOWER(), {
  //suspended:true,
  agenda:[
    'wait',
    'run:stepped:starter',
    'run:stepped:main',
    'run:stepped:desert',
  ],
  stepped:function(arr) { return !respond({course:arr[0], actor:w.Kyle}, this.steps) },
  steps:[
    {
      test:function(p) { return p.course === 'starter' },
      responses:[
        {
          test:function() { return !w.soup_can.opened },
          script:function() {
            w.soup_can.opened = true
            msg("Kyle opens the soup can.")
          },
        },
        {
          test:function() { return w.bowls.state === 0 },
          script:function() {
            w.bowls.state = 1
            msg("Kyle pours soup into the two bowls.")
          },
        },
        {
          test:function() { return w.bowls.state === 1 },
          script:function() {
            w.bowls.state = 2
            msg("Kyle microwaves the two bowls.")
          },
        },
        {
          test:function() { return w.bowls.state === 2 },
          script:function() {
            w.bowls.state = 3
            msg("Kyle serves the two bowls of delicious soup.")
          },
        },
        {
          msg:"Kyle eats the soup.",
          failed:true,
        },
      ],
    },
    {
      test:function(p) { return p.course === 'main' },
      responses:[
        {
          msg:"Kyle produces the main course.",
          failed:true,
        },
      ],
    },
    {
      failed:true,
    }      
  ],
})