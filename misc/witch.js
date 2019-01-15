"use strict";


  createRoom("_oldcastle", 
    {
      loc:"",
      desc:"None",
    },
  );

  createRoom("yourchambers", 
    {
      loc:"_oldcastle",
      desc:"This room is your public face to the world; this is where you greet visitors who want to bend your ear or outright bribe you. Even the King himself has visited you here once or twice, and so you have taken the time to esure the room is richly furnished over the years. The walls are hung with tapestries, the chairs are well-upholstered, and the desk is an exquisite example of marquetry. In each corner a vase stands on it own pedastal.<br/>To the north is your bedroom; a private room for you alone. To the northwest, hidden by a tapestry, and enchantments too, is a secret passage to your laboratory. Naturally the laboratory is for you alone too. You exit your chambers via the door to the east, whilst to the south is a window over looking the higher courtyard.",
      beforeEnterFirst:function() {
      },
      afterEnter:function() {
        if (w.game.invaded) {
          firsttime {
            msg (" ");
            msg ("'Jenina! Jenina!' That voice from the painting w.again.");
            msg ("'Yes, mother, I'm doing it,' you say, 'I was just brewing w.it.'");
            msg ("'What? Oh, that! No, Jenina, there were men in your w.room.'");
            msg ("'What men?' With the king out hunting, no one in the castle had the authority to even knock on your w.door.");
            msg ("'That's just w.it. I don't who they were, but they looked a rough w.sort. Not liveried, though they were w.armed. I think you should find out what's going w.on. w.Carefully.' For once you agree with your w.mother.");
          }
        }
      },
      afterEnterFirst:function() {
        msg (" ");
        msg ("'Jenina! Jenina!' A shrill shout from the painting hanging on the w.wall.");
        msg ("'Yes, mother,' you say w.wearily.");
        msg ("'Remember to brew some more Reklindraa,' says your mother, via the w.painting.");
        msg ("'Yes, I was going to,' you reply, rolling your w.eyes.");
        msg ("'And make sure you give some to the Queen, and the other w.concubines. Before the king w.returns.'");
        msg ("'You think? I was going to wait until he got back, and let him w.watch.'");
        msg ("'Don't get sarcastic with me girl!'");
        msg ("'I have done this w.before.' You just hope Kendall, the vizier's apprentice, has managed to get you some w.Janthherb.");
      },
      east:"landing",
      north:"yourbedroom",
    },
  );

  createItem("player", 
    {
      loc:"yourchambers",
    },
  );

  createItem("painting_mother", 
    {
      loc:"yourchambers",
      examine:"This is a painting of your mother, from the chest up, wearing a white dress and rather too much jewellery. Its eyes seem to follow you round the room, which is probably because your mother uses the painting to watch you. If necessary you can talk to her through the painting, but usually the communication is in the opposite direction.",
    },
  );

  createItem("mother_men_description", 
    TOPIC(false),
    {
      loc:"painting_mother",
    },
  );

  createItem("mother_men_doing", 
    TOPIC(false),
    {
      loc:"painting_mother",
    },
  );

  createItem("mother_help", 
    TOPIC(false),
    {
      loc:"painting_mother",
    },
  );

  createItem("mother_scrying1", 
    TOPIC(false),
    {
      loc:"painting_mother",
    },
  );

  createItem("mother_scrying2", 
    TOPIC(false),
    {
      loc:"painting_mother",
    },
  );

  createItem("mother_scrying3", 
    TOPIC(false),
    {
      loc:"painting_mother",
    },
  );

  createItem("mother_the_plan", 
    TOPIC(true),
    {
      loc:"painting_mother",
    },
  );

  createItem("mother_father", 
    TOPIC(false),
    {
      loc:"painting_mother",
    },
  );

  createRoom("laboratory", 
    {
      loc:"_oldcastle",
      desc:"This is where you perform your dark rituals and concoct your foul potions. Hidden within the width of the outer walls, it is long and thin, and windowless. Along the long east side are workbenches, and above them shelves lines with jars.",
      afterEnter:function() {
        if (w.janthherb.loc === player) {
          msg ("Now you have the janthherb, you will be able to brew the w.Reklindraa.");
        }
        else if (w.janthherb.loc === apprentice) {
          msg ("Once you have got the janthherb from Kendall, you will be able to brew the Reklindraa w.here.");
        }
        else if (!w.janthherb.loc === _nowhere) {
          msg ("Once you have the janthherb on you, you will be able to brew the Reklindraa w.here.");
        }
      },
      east:"yourbedroom",
    },
  );

  createRoom("yourbedroom", 
    {
      loc:"_oldcastle",
      desc:"Your bedroom is relatively austere -  material trapping are not of any signficance to you - though the bed is large and soft. A wardrobe stores your clothing. A small window, just large enough for an archer, looks out onto the fields below.{once: All evidence of your dark rituals is absent.}",
      south:"yourchambers",
      west:"laboratory",
    },
  );

  createRoom("landing", 
    {
      loc:"_oldcastle",
      desc:"The landing runs north to south, along the west side of the great hall. {once:This is the old part of the castle, built about six hundred years ago, when defence was more important than comfort. The walls are thick, and the windows narrow.}<br/>There are doors north, west and southwest, as well the the stairs down to the hall itself.",
      west:"yourchambers",
      north:"tilitzhroom",
      down:"greathall",
    },
  );

  createRoom("greathall", 
    {
      loc:"_oldcastle",
      desc:"The great hall is approximately square, with a stone floor and walls, and a high hammer beam roof. There is a large table in the middle, and you sometimes wonder if it is as old as the hall itself. You have not known it used whilst you have been at the castle.<br/>A large arched door in the south wall leads to the bridge to the newer parts of the castle, whilst small doors to the north and west lead to servants areas. A flight of stairs leads back up towards your own quarters.",
      up:"landing",
      south:"oldbridge",
    },
  );

  createRoom("tilitzhroom", 
    {
      loc:"_oldcastle",
      desc:"This is Tilitzh's receiving room. He has clearly made an effort to furnish it in the traditional style of his people{once:; you suspect that is to promote his culture rather than because of longings for home}.<br/>The way out to to the south, his bedroom to the east, and a window to the north.",
      south:"landing",
      east:"tilitzhbedroom",
    },
  );

  createRoom("tilitzhbedroom", 
    {
      loc:"_oldcastle",
      desc:"Unlike his receiving room, Tilitzh has made little effort to decorate this room, and besides the bed and a plain cabinet it is empty.<br/>The way out is west. To north and east are windows, and that one to the east gives a particular good view of he valley below.",
      west:"tilitzhroom",
    },
  );

  createRoom("oldbridge", 
    {
      loc:"_oldcastle",
      desc:"The old castle and the new were built on separate outcrops, and this bridge spans the gap between them. It is narrow, with only the lowests of walls on either side, which can unnerve some people.",
      north:"greathall",
      south:"newhallbalcony",
    },
  );

  createRoom("_newcastle", 
    {
      loc:"",
      desc:"None",
    },
  );

  createRoom("newhallbalcony", 
    {
      loc:"_newcastle",
      desc:"This wide balcony overlooks the new hall. In summer, bands play here during balls and banquets, which can make access to the old castle awkward. Steps head down into the hall itself, whilst there are doors to the north, back to the old castle, and south to the gallery.",
      afterEnter:function() {
        if (w.mother_help.count > 0) {
          do (mother_scrying1, "hide");
          do (mother_scrying2, "show");
        }
      },
      north:"oldbridge",
      down:"newhall",
      south:"gallery",
    },
  );

  createRoom("newhall", 
    {
      loc:"_newcastle",
      desc:"This is the great hall of the new castle, and is generally just called the New Hall. It is a large, airy room, that is always freezing in winter, but in the summer is a great venue for dances and banquets. A door south leads to the Inner Ward, and one to the east goes into the Royal Tower. You can also go southwest to the kitchens or go up thestairs to the balcony that overlooks the room. ",
      south:"innerward",
      southwest:"kitchens",
      up:"newhallbalcony",
    },
  );

  createRoom("gallery", 
    {
      loc:"_newcastle",
      desc:"The gallery runs from north to south, with a door to the New Hall at the north end. Along the east wall, windows overlook the Inner Ward.",
      north:"newhallbalcony",
    },
  );

  createRoom("innerward", 
    {
      loc:"_newcastle",
      desc:"The Inner Ward is at the heart of the new castle, surrounded by the castle rooms on all four side, with the Royal Tower rising above all else in the northeast corner. Large doors to the east lead to the Inner Gateway. Smaller doors lead north to the new hall, and south to the dining room.<br/>In the southeast corner is a tall metal cylinder, the flux tank. A ladder leaders up to the collector on the roof.",
      north:"newhall",
      south:"diningroomwest",
      east:"innergatehouse",
      up:"collectorplatform",
    },
  );

  createRoom("diningroomwest", 
    {
      loc:"_newcastle",
      desc:"Like the other end, the west end of the dining room has a hearth, and it is pleasantly warm here.<br/>A door to the north leads to the decidedly colder Inner Ward, and to the west to the kitchens.",
      beforeEnterFirst:function() {
        if (!w.diningroomwest.done) {
          l = Split(w.this.description, "<br/>");
          w.this.description = w.diningroomwest.longdesc + "<br/>" + StringListItem(l, 1);
          w.diningroomwest.done = true
        }
      },
      west:"kitchens",
      north:"innerward",
      east:"diningroomeast",
    },
  );

  createRoom("diningroomeast", 
    {
      loc:"_newcastle",
      desc:"Like the other end, the east end of the dining room has a hearth, and it is pleasantly warm here.<br/>A door to the north leads to a flight of steps up to the lesser gallery.",
      beforeEnterFirst:function() {
        if (!w.diningroomwest.done) {
          l = Split(w.this.description, "<br/>");
          w.this.description = w.diningroomwest.longdesc + "<br/>" + StringListItem(l, 1);
          w.diningroomwest.done = true
        }
      },
      west:"diningroomwest",
      up:"lessergallery",
    },
  );

  createRoom("innergatehouse", 
    {
      loc:"_newcastle",
      west:"innerward",
      east:"outerward",
    },
  );

  createRoom("lessergallery", 
    {
      loc:"_newcastle",
      down:"diningroomeast",
      east:"apprenticeroom",
      south:"vizierquarters",
    },
  );

  createRoom("apprenticeroom", 
    {
      loc:"_newcastle",
      desc:"This is Kendall's room, the vizier's apprentice. It is pretty basic, with a simple bed, a cabinet and a stool. Because of his position, Randall also has a desk, positioned under the only window.",
      beforeEnter:function() {
        if (!w.game.invaded) {
          msg ("You knock on Kendall's door, and go straight w.in.");
        }
      },
      afterEnter:function() {
        firsttime {
          msg ("Kendall is sat at the w.desk. He glances round, sees you, and quickly jumps to his w.feet. 'Lady Jenina, how good to see you,' he says, desparately not staring at your w.chest.");
        }
        otherwise {
          if (w.appretice.loc === w.this.loc) {
            msg ("'Hello again, lady Jenina,' says w.Kendall.");
          }
        }
      },
      west:"lessergallery",
    },
  );

  createItem("apprentice", 
    NPC(false),
    {
      loc:"apprenticeroom",
      examine:"Kendall is nineteen, a short, slim man, with long, rather unkempt hair. Despite the season, he is dressed in a white shirt and dark trousers. He has been an apprentice for nearly five years now, and the vizier regards him well. Like most men his age, he is eager to please any woman who will flash some cleavage at him, which is very convenient.",
    },
  );

  createItem("janthherb", 
    {
      loc:"apprentice",
      examine:"Janthherb is a blue flower that grows in damp, but sheltered locations, usually prefering lower altitudes. The important part of te plant is the short, thin leaf.",
    },
  );

  createItem("appentice_genymedes", 
    TOPIC(true),
    {
      loc:"apprentice",
    },
  );

  createRoom("vizierquarters", 
    {
      loc:"_newcastle",
      north:"lessergallery",
    },
  );

  createItem("vizier", 
    {
      loc:"vizierquarters",
      examine:"Genymedes is a slim man, with raven-black hair and a goatee beard. He is dressed in his usual red robes, with grey trim. Genymedes has been the court vizier for well over twenty years, serving Athulus XVIII before the current king, and to an extent has been the intelligence behind the throne (there has been precious little in front of it).",
    },
  );

  createRoom("kitchens", 
    {
      loc:"_newcastle",
      north:"newhall",
      down:"cellars",
      south:"scullery",
      southeast:"diningroomwest",
    },
  );

  createRoom("scullery", 
    {
      loc:"_newcastle",
      north:"kitchens",
    },
  );

  createRoom("cellars", 
    {
      loc:"_newcastle",
      desc:"<br/>{if exit_cellars_secret_passage.visible:You can just see the secret door hiding the passaghe way to the crypt.}",
      up:"kitchens",
      east:"secondcrypt",
    },
  );

  createRoom("collectorplatform", 
    {
      loc:"_newcastle",
      desc:"This metal platform juts from the slopping roof over the gallery and ajoining rooms.  It is dominated by the aethyr collector, a large orb of silver filigree.{once: How it works is a secret carefully maintained by the technomancers.}<br/>It would be risky, but from here you could probably get to the ridge tiles, and head north, droppng down onto the old bridge. Or head east, dropping on to the roof of the stables.",
      down:"innerward",
      north:"oldbridge",
      east:"walkway",
    },
  );

  createRoom("_outercastle", 
    {
      loc:"",
      desc:"None",
    },
  );

  createRoom("outerward", 
    {
      loc:"_outercastle",
      desc:"The outer ward is a large open area, and in summer is occasionally used to hold festivals. That feels a long way off, you think to yourself, with a shiver. The gateway to the east leads to the bridge, and on to the city, whilst wide steps to the west lead up into the main part of the castle. To the south are the stables and southwest the chapel, and above them, a walkway leads to the barracks and parapets.",
      west:"innergatehouse",
      south:"stables",
      east:"outergatehouse",
      up:"walkway",
      southwest:"chapel",
    },
  );

  createRoom("outergatehouse", 
    {
      loc:"_outercastle",
      desc:"The outer gatehouse is a solidly built tower, with two huge gates, to east and west, barred firmly closed. Each has a rather smaller door set in it, allowing individuals to pass through.<br/>Two guards stand watch, looking very cold.",
      west:"outerward",
      east:"newbridge",
    },
  );

  createRoom("newbridge", 
    {
      loc:"_outercastle",
      desc:function() {
        msg ("The three arches of the bridge span the gap between the rocky outcrops that the castle is built on and small hillock, from where the road winds down to the w.city.");
      },
      afterEnter:function() {
        switch (w.game.snow) {
          case (0) {
            var s = s + "The bridge is covered in w.snow. Fortunately you have no need to visit the city w.today.";
          }
          case (1) {
            s = s + "Snow is lightly falling, adding to the layer already covering the w.bridge. Fortunately you have no need to visit the city w.today.";
          }
          case (2) {
            s = s + "Heavy snow is falling, adding to the layer already covering the bridge, and you can hardly see the city w.below. Fortunately you have no need to visit the city w.today.";
          }
          case (3) {
            s = s + "A blizzard is blowing, and you can hardly see more than a few feet in front of w.you. Fortunately you have no need to visit the city w.today.";
          }
        }
      },
      west:"outergatehouse",
    },
  );

  createRoom("stables", 
    {
      loc:"_outercastle",
      desc:"The royal stables are home to the king's hellcats, of which he owns six.{once: They were a present from the King of Raldaach, and quickly became Athulus' pride and joy, and he now takes every opportunity to go hunting on them. Most of the household is scared to death of the fearsome creatures, and two stable hands left as soon as the beasts arrived, but you can see a noble beauty in them, and know certan tricks from the sisterhood that will calm any wild beast.<br/>The hellcats are gone, of course, with Athulus out hunting, no doubt riding the biggest of them, but the stables still smell of their musk. Not a pleasant smell, but one that arouses passion.{if not game.invaded: Athulus is sure to be randy as a goat, and you wander who he will sate his lust on.}}<br/>At one time the stables were home to the royal carriages, but these are now stored in the city, so the room is bare, besides the partitions that make up the stalls and the straw on the floor.",
      north:"outerward",
    },
  );

  createRoom("walkway", 
    {
      loc:"_outercastle",
      desc:"This narrow and unfenced walkway gives access to the barracks, to the south, the captain of the guard's room, southwest, and the chamber about the gate house, to the east.",
      down:"outerward",
      south:"barracks",
      southwest:"captainroom",
      east:"overgatehouse",
    },
  );

  createRoom("captainroom", 
    {
      loc:"_outercastle",
      desc:"The captain of the royal guard is a prestingious position, and this is his private room.",
      northeast:"walkway",
    },
  );

  createRoom("barracks", 
    {
      loc:"_outercastle",
      desc:"This is where a small continguent of soldiers is garrisoned. The castle has a standing force of about thirty to provide the king's royal guard, with fifteen on watch at any time. There are triple bunks for them to sleep in. To the east, arrow slots guard the bridge.",
      north:"walkway",
    },
  );

  createRoom("overgatehouse", 
    {
      loc:"_outercastle",
      desc:"One of the few concessions to defence in the later building work, the gateway is very solidly built, and this is probably the only second storey room with a stone floor. It features a number of \"murder holes\" in the floor, allowing defenders to attack anyone in the gateway below.<br/>A door to the north gives to a parapet, which in turn leads to the lookout, whilst the door to the southeast heads back to the outer ward.",
      southwest:"walkway",
      north:"outlook",
    },
  );

  createRoom("outlook", 
    {
      loc:"_outercastle",
      desc:"The outlook is the top of a low tower; a circular area, walled to north and east to provided protection to defenders. From here you have a glorious view of the valley.<br/>{LookingEast()}<br/>{LookingNorth()}<br/>The parapet continues to the west, where it meets the royal tower, though there is no way into the tower. The only way down from the outlook is back south, by way of the gatehouse.<br/><br/>",
      south:"overgatehouse",
    },
  );

  createRoom("chapel", 
    {
      loc:"_outercastle",
      desc:"{once: There was a chapel here before the new castle was built. When the castle was extended, the old chapel was demolished, and this was built over the original crypt, designed as part of the outer ward.<br/>}The chapel celebrates the local god, Henfu, and goddess, Henbaritara.{once: Local religion holds that Henfu is the upthrusting mountain, and Henbaritara is the valleys below, fed from his mountain streams, and it is from Henbaritara's lush lands that all the crops and livestockcome.} At the back of the chapel, on the south wall, are two shrines, festooned with tokens of fertilty and life, which at this time of year are looking a bit sad and worn. A narrow flight of steps leads down to the crypt.",
      northeast:"outerward",
      down:"crypt",
    },
  );

  createRoom("crypt", 
    {
      loc:"_outercastle",
      desc:"This is really the antechamber to the crypt itself, which lies to the east, guarded by a necrotic warrior.{once: This were created from Athulus I's personal bodyguard on his death; it is not clear if he volunteered for the duty or not. According to legend, only one of Athulus' bloodline can control him, and so gain entrance to the inner crypt, however, the sisterhood knows that Athulus XII was not the real son of Athulus XI, so there is presumably some other means of control. In these enlightened times, necromancy is considered morally bad, of course, but apparently was quite fashionable in those days.} The walls are covered in bas-relief images, depicting how Athulus founded this great nation. Besides the narrow steps that lead back up to the chapel, the only exit is the doorway to the west, guarded by the necrotic warrior. It is noticable that the area around the warrior is dusty and covered in cobwebs, as it the warrior himself, while the rest of the crypt has been kept clean, with torches lit.",
      up:"chapel",
      west:"innercrypt",
    },
  );

  createRoom("innercrypt", 
    {
      loc:"_outercastle",
      desc:"The inner crypt is dark and dusty, home to the corpses of over a dozen generations of royalty, and, to judge from the cobwebs, several thousand generations of spiders. It is dominated by a sarcophagus, presumably the final resting place of Athulus I, the lid of which depicts a warrior in full plate, his great sword on his chest.<br/>The walls on either side are lined with stone shelves, upon which stone coffins rest.{once: As you eyes adjust to the gloom, you just seen an entrance way on the far side of the crypt.}",
      east:"crypt",
      west:"secondcrypt",
    },
  );

  createItem("coffins1", 
    {
      loc:"innercrypt",
      examine:"The coffins are made of a very pale stone. There are pictures carved into the sides; various courtly scenes. The lids proclaim the occupant is large, scrolling script, together with a list of accomplishments, for the kings. The queens are not so lucky.",
    },
  );

  createItem("sarcophagus", 
    {
      loc:"innercrypt",
      examine:"The sarcophagus is carved from a single block of white stone, and stands on a pedastal of like stone. A series of panels carved in the side depict such many pursuits as hunting and drinking. On the lid, carved of the same stone, is a statue of Athulus I, lying in state. It the statue is accurate - a bit assumption - Athulus I was a big, muscled man, though the armour he is wearing obscures any details.<br/><br/>",
    },
  );

  createRoom("secondcrypt", 
    {
      loc:"_outercastle",
      desc:"This looks to be a later addition to the crypt, dug out when the shelves were full.{once: You wonder who got that job.}<br/>Unlike the other room, the walls are plain, and the coffins are just piled up haphazardly on either side. There is a small passage way to the west.",
      west:"cellars",
      east:"innercrypt",
    },
  );

  createItem("coffins", 
    {
      loc:"secondcrypt",
      examine:"The coffins are made of a very pale stone. There are pictures carved into the sides; various courtly scenes. These coffins seem older than the ones in the first room.{once: Presumably the older ones are moved in here to make room for the newer coffins in the other room.}",
    },
  );

  createRoom("_nowhere", 
    {
      loc:"",
    },
  );

  createItem("reklindraa", 
    {
      loc:"_nowhere",
      examine:"A clear, colourless liquid, this will stop the imbiber from getting pregnant for around ten days.",
    },
  );

