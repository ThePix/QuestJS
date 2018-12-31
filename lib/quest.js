  createRoom("academy_lower_courtyard", [{
    desc:"Academy, Lower Courtyard",
    alias:"Academy, Lower Courtyard" inside:"",
    north:"academy_upper_courtyard",
    up:"academy_upper_courtyard",
    west:"academy_ritual_observation_platform",
  }]);

  createRoom("academy_upper_courtyard", [{
    desc:"Academy, Upper Courtyard",
    alias:"Academy, Upper Courtyard" inside:"",
    south:"academy_lower_courtyard",
    down:"academy_lower_courtyard",
    east:"academy_hall_of_nature",
  }]);

  createRoom("academy_great_hall", [{
    desc:"Academy, Great Hall",
    alias:"Academy, Great Hall" inside:"true",
    north:"academy_hall_of_nature",
    west:"academy_battlements",
  }]);

  createRoom("academy_room_of_potency", [{
    desc:"Academy, Room of Potency",
    alias:"Academy, Room of Potency" inside:"true",
  }]);

  createRoom("academy_lecture_hall", [{
    desc:"Academy, Lecture Hall",
    alias:"Academy, Lecture Hall" inside:"true",
    south:"academy_hall_of_nature",
  }]);

  createRoom("academy_hall_of_nature", [{
    desc:"Academy, Hall of Nature",
    alias:"Academy, Hall of Nature" inside:"true",
    west:"academy_upper_courtyard",
    north:"academy_lecture_hall",
    south:"academy_great_hall",
  }]);

  createRoom("academy_dormitory", [{
    desc:"Academy, Dormitory",
    alias:"Academy, Dormitory" inside:"true",
    east:"academy_battlements",
  }]);

  createRoom("academy_battlements", [{
    desc:"Academy, Battlements",
    alias:"Academy, Battlements" inside:"",
    east:"academy_great_hall",
    west:"academy_dormitory",
  }]);

  createRoom("academy_ritual_observation_platform", [{
    desc:"Academy, Ritual Observation Platform",
    alias:"Academy, Ritual Observation Platform" inside:"true",
    east:"academy_lower_courtyard",
    south:"academy_ritual_room_a",
    north:"academy_ritual_room_b",
  }]);

  createRoom("academy_ritual_room_a", [{
    desc:"Academy, Ritual Room A",
    alias:"Academy, Ritual Room A" inside:"true",
    north:"academy_ritual_observation_platform",
  }]);

  createRoom("academy_ritual_room_b", [{
    desc:"Academy, Ritual Room B",
    alias:"Academy, Ritual Room B" inside:"true",
    south:"academy_ritual_observation_platform",
  }]);

  createRoom("academy_cleansing_room", [{
    desc:"Academy, Cleansing Room",
    alias:"Academy, Cleansing Room" inside:"true",
  }]);

  createRoom("market_square", [{
    desc:"Market Square",
    alias:"Market Square" inside:"",
    north:"alchemy_shop",
  }]);

  createRoom("alchemy_shop", [{
    desc:"Alchemy Shop",
    alias:"Alchemy Shop" inside:"true",
    south:"market_square",
  }]);

  createRoom("bridge", [{
    desc:"Bridge",
    alias:"Bridge" inside:"",
  }]);

  createRoom("spooky_glade", [{
    desc:"Spooky Glade",
    alias:"Spooky Glade" inside:"",
  }]);

  createRoom("fallen_tree", [{
    desc:"Fallen Tree",
    alias:"Fallen Tree" inside:"",
  }]);

  createRoom("enchanted_glade", [{
    desc:"Enchanted Glade",
    alias:"Enchanted Glade" inside:"",
  }]);

  createRoom("standing_stones", [{
    desc:"Standing Stones",
    alias:"Standing Stones" inside:"",
  }]);

  createRoom("dancing_lights", [{
    desc:"Dancing Lights",
    alias:"Dancing Lights" inside:"",
  }]);

  createRoom("beside_cliff_face", [{
    desc:"Beside Cliff face",
    alias:"Beside Cliff face" inside:"",
  }]);

  createRoom("into_the_swamp", [{
    desc:"Into The Swamp",
    alias:"Into The Swamp" inside:"",
  }]);

  createRoom("broken_road", [{
    desc:"Broken Road",
    alias:"Broken Road" inside:"",
  }]);

  createRoom("the_ford", [{
    desc:"The Ford",
    alias:"The Ford" inside:"",
  }]);

  createRoom("the_living_bridge", [{
    desc:"The Living Bridge",
    alias:"The Living Bridge" inside:"",
  }]);

  createRoom("lily_pond", [{
    desc:"Lily Pond",
    alias:"Lily Pond" inside:"",
  }]);

  createRoom("giant_tree", [{
    desc:"Giant Tree",
    alias:"Giant Tree" inside:"",
  }]);

  createRoom("bridge", [{
    desc:"Bridge",
    alias:"Bridge" inside:"",
  }]);

