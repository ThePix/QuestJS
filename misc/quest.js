"use strict";


  createItem("environment", 
    {
      loc:"",
      examine:"This should never be seen!",
    },
  );

  createItem("e_building", 
    {
      loc:"environment",
    },
  );

  createItem("wall", 
    {
      loc:"e_building",
      examine:"The walls are not important.",
    },
  );

  createItem("ceiling", 
    {
      loc:"e_building",
      examine:"You stare at the ceiling for a while.",
    },
  );

  createItem("e_cave", 
    {
      loc:"environment",
    },
  );

  createItem("cave_wall", 
    {
      loc:"e_cave",
      examine:"The cave walls are cold and damp.",
    },
  );

  createItem("e_forest", 
    {
      loc:"environment",
    },
  );

  createItem("tree", 
    {
      loc:"e_forest",
      examine:"You look carefully at the tree.  A tall thing with leaves. One of many in the forest.",
    },
  );

  createItem("e_inside", 
    {
      loc:"environment",
    },
  );

  createItem("e_outside", 
    {
      loc:"environment",
    },
  );

  createItem("sky", 
    {
      loc:"e_outside",
      examine:function(isMultiple) {
          if (w.player.worldcursed) {
            msg ("The sky is orange and deeply w.threatening.");
          }
          else {
            msg ("The sky is blue, with little fluffy w.clouds.");
          }
        },
    },
  );

  createItem("e_forest_river", 
    {
      loc:"environment",
    },
  );

  createItem("water", 
    {
      loc:"e_forest_river",
      examine:"The river is fast flowing, and somewhat brown. You can see branches and other debris being swept along.",
    },
  );

  createItem("e_forest_road", 
    {
      loc:"environment",
    },
  );

  createItem("road", 
    {
      loc:"e_forest_road",
      examine:"The road was built of flat stones many centuries ago, but has been poorly maintained. Many sones are missing, or sunken in the mire, and nowadays the road is uneven and rutted, and muddy too after recent rains.",
    },
  );

  createItem("e_necropolis", 
    {
      loc:"environment",
    },
  );

  createItem("ossuary_jar", 
    {
      loc:"e_necropolis",
      examine:function(isMultiple) {
          msg ("The ossuary jars are all much w.alike. About six inches wides, and twice that in height, and made of pottery, they are glazed in bright colours, though much faded w.now.");
          if (w.player.status === "Lore") {
            msg ("Though the tradition has now ended, it used to be the custom to bury the dead in temporary tombs, and then recover the bones a year w.later. These jars would then be the final resting place of those w.bones.");
          }
        },
    },
  );

  createItem("stone_shelf", 
    {
      loc:"e_necropolis",
      examine:"The shelves are single blocks of stone, about an inch thick, supported at each end.",
    },
  );

  createItem("ceiling1", 
    {
      loc:"e_necropolis",
      examine:"The ceiling is vaulted stone.",
    },
  );

  createItem("wall1", 
    {
      loc:"e_necropolis",
      examine:"The walls are cut stone, worn and darkened with age.",
    },
  );

  createItem("e_courtyard", 
    {
      loc:"environment",
    },
  );

  createItem("courtyard", 
    {
      loc:"e_courtyard",
      examine:"The courtyard is covered with stone flags, many look worn.",
    },
  );

  createItem("e_citadel", 
    {
      loc:"environment",
    },
  );

  createItem("e_marsh", 
    {
      loc:"environment",
    },
  );

  createItem("e_sewer", 
    {
      loc:"environment",
    },
  );

  createItem("water1", 
    {
      loc:"e_sewer",
      examine:"The water is brown and has \"things\" floating in it.",
    },
  );

  createItem("wall2", 
    {
      loc:"e_sewer",
      examine:"The walls of the sewer curve to form a pipe. They are built of stone, and stained a variety of unpleasant colours. Mould is a common feature.",
    },
  );

  createItem("mould", 
    {
      loc:"e_sewer",
      examine:"The mould is a yellowy-green colour, and grows in patchs all over the walls.",
    },
  );

  createItem("e_mountain", 
    {
      loc:"environment",
    },
  );

  createItem("e_town", 
    {
      loc:"environment",
    },
  );

  createItem("enviro_object", 
    {
      loc:"environment",
      examine:"You should never see this!",
    },
  );

  createItem("e_inner_citadel", 
    {
      loc:"environment",
    },
  );

  createRoom("start", 
    {
      loc:"",
      desc:function() {
    },
    },
  );

  createItem("player", 
    {
      loc:"start",
    },
  );

  createRoom("town", 
    {
      loc:"",
    },
  );

  createRoom("market_square", 
    {
      loc:"town",
      desc:function() {
        msg ("A dusty square of dirt, surrounded by several meagre buildings, including a shop to the w.east. The only buildings taller than a single storey are the tavern, <i>The Drunken Pig</i>, to the south, and a narrow tower to the w.west. A road of sorts heads north, towards a blood red citadel some leagues w.away. The only facilities the market square itself boasts is a horse trough; there is no sign of a market w.today.");
        if (w.stone_of_returning.loc === w.this.loc && w.stone_of_returning.visible) {
          msg ("Over near the horse trough is a flattish stone, pretty much exactly where you materialised after casting <i>Returning</i>.");
        }
      },
      north:"road_near_town",
      east:"town_shop",
      south:"tavern",
      west:"sage_tower",
      southwest:"town_street",
    },
  );

  createItem("magpie_town_square", 
    TOPIC(true),
    {
      loc:"market_square",
    },
  );

  createItem("horse_trough", 
    {
      loc:"market_square",
      examine:function(isMultiple) {
          if (w.this.sewer) {
            msg ("The horse trough is made of stone, and about as long as you are w.tall. It is full of bad-smelling w.water.");
          }
          else {
            msg ("The horse trough is made of stone, and about as long as you are w.tall. It is full of w.water.");
          }
          if (w.player.status === "Lore") {
            msg ("Curiously, the trough actually pre-dates the town, though this may not be its original w.location. It is an example of late Liome Era stonework, as the faded bas-relief images clearly w.show.");
          }
        },
    },
  );

  createItem("stone_of_returning", 
    {
      loc:"market_square",
      examine:"The Stone of Returning looks pretty ordinary, a pale grey, flat stone.",
    },
  );

  createRoom("tavern", 
    {
      loc:"town",
      desc:function() {
        var s = "The Drunken Pig is a small tavern in a small w.town. At this time of day, it is almost empty, but at night you can imagine it gets full very w.easily.";
        if (w.innkeeper.loc === w.this.loc) {
          s = s + " The innkeeper stands behind the bar, polishing a glass as he awaits an w.order.";
        }
        if (w.villager.loc === w.this.loc) {
          if (w.villager.revealed) {
            s = s + " A single customer stands near the bar, the old w.hag.";
          }
          else {
            s = s + " A single customer stands near the bar, a rather pretty w.woman.";
          }
        }
        msg (s + " The main exit is to the north out to the market square, but a side exit leads w.west.");
      },
      beforeEnter:function() {
      },
      afterEnter:function() {
        if (w.player.status === "KoboldGlamour" && w.innkeeper.loc === w.this.loc) {
          msg ("'We don't serve your kind in here,' says the innkeeper to w.you.");
          msg ("'w.What..?' Of course - you look like a kobold! You step outside, cancel the spell, and then walk back into the tavern, now looking like a w.human.");
          CancelSpell
        }
        if (w.innkeeper.loc === w.this.loc && w.player.sewer) {
          msg ("'By the gods, what <i>is</i> that smell?'");
          if (w.villager.loc === w.this.loc) {
            msg ("The villager sniffs the w.air. 'It's him,' she says, pointing an accusatory finger at w.you.");
          }
        }
      },
      north:"market_square",
      west:"town_street",
    },
  );

  createItem("innkeeper", 
    NPC(false),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"tavern",
    },
  );

  createItem("innkeeper_town", 
    TOPIC(true),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_sun_queen", 
    TOPIC(false),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_sage", 
    TOPIC(false),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_name", 
    TOPIC(true),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_prince_mandrin", 
    TOPIC(false),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_prince_mandrin2", 
    TOPIC(false),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_hooker", 
    TOPIC(false),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_feculi", 
    TOPIC(false),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_buy_wine", 
    TOPIC(true),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_buy_more_wine", 
    TOPIC(true),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_buy_beer", 
    TOPIC(true),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_buy_more_beer", 
    TOPIC(true),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_sage_monster", 
    TOPIC(false),
    {
      loc:"innkeeper",
    },
  );

  createItem("innkeeper_tandren", 
    TOPIC(true),
    {
      loc:"innkeeper",
    },
  );

  createItem("villager", 
    NPC(true),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"tavern",
    },
  );

  createItem("villager_town", 
    TOPIC(true),
    {
      loc:"villager",
    },
  );

  createItem("villager_sun_queen", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createItem("villager_sage", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createItem("villager_have_drink", 
    TOPIC(true),
    {
      loc:"villager",
    },
  );

  createItem("villager_name", 
    TOPIC(true),
    {
      loc:"villager",
    },
  );

  createItem("villager_naughty", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createItem("villager_fifty_gold", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createItem("villager_prince_mandrin", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createItem("villager_old_hag", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createItem("villager_hooker", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createItem("villager_feculi", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createItem("villager_feculi2", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createItem("villager_fun", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createItem("villager_sage_monster", 
    TOPIC(false),
    {
      loc:"villager",
    },
  );

  createRoom("town_shop", 
    {
      loc:"town",
      desc:"A small shop, poorly stocked as you would expect in the current economic environment. A curious little man stands behind the counter, optistically imaginatively you might buy something. Given he only sells weapon and armour, stuff you are clueless about, he is going to be disappointed.",
      afterEnter:function() {
        if (w.shopkeeper.loc === w.this.loc && w.player.sewer) {
          msg ("The shop keeper sniffs the air and gives you a strange w.look.");
        }
      },
      afterFirstEnter:function() {
        msg (" ");
        msg ("To make a purchase, either type <i>buy</i>\" to see a menu of goods available, or type <i>buy &gt;item></i> if you know exactly what you w.want.");
      },
      west:"market_square",
    },
  );

  createItem("shopkeeper", 
    NPC(false),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"town_shop",
    },
  );

  createRoom("sage_tower", 
    {
      loc:"town",
      desc:function() {
        var s = "The ground floor of the tower seems to be where the sage actually lives;";
        if (w.this.revealed) {
          s = s + " a hole in the ceiling shows there are upper levels, but there is no obvious way to climb w.up.";
        }
        else {
          s = s + " there is no obvious way to the high w.storeys.";
        }
        if (w.sage.loc === w.this.loc) {
          s = s + " The room is dominated by a table, at which the sage is sat, a large book in front of w.him.";
        }
        else if (!w.sage.attacked && w.nosage.nomore) {
          // ODD!!!
          w.sage.loc = this
          s = s + " The room is dominated by a table, at which the sage is once more sat, a large book in front of w.him.";
        }
        else {
          s = s + " The room is dominated by a table, at which the sage was sat earlier, a large book lies w.open.";
        }
        s = s + "To one side is a narrow w.bed. The rest of the room is dedicated to clutter - mostly w.books.";
        msg (s);
      },
      beforeEnter:function() {
        if (w.player.levelstatus === 3 && w.gem.loc === player) {
          CancelSpell
          w.player.maxpoints = 25
          w.player.levelstatus = 4
          LevelUp
        }
        w.sage.attacked = false
      },
      afterEnter:function() {
        if (w.player.status === "KoboldGlamour" && w.sage.loc === w.this.loc) {
          msg ("'Please don'w.t...' begs the sage, then; 'Wait, it's w.you. A good disguise, you even fooled me for a moment w.there.'");
        }
        w.sage_have_gem.display = (w.gem.loc = player);
      },
      afterFirstEnter:function() {
        msg ("'Ah, you here at last,' says the w.sage.");
        msg ("'You knew I was coming?'");
        var s = "'I knew someone was w.coming. You are here to fulfil the ancient w.prophecy. I'm a sage, you know; it is my job to know about these w.things.";
        if (w.this.alias === "Sage") {
          s = " My name is w.Leroulk.";
          w.this.alias = "Leroulk";
        }
        s = s + "' He pauses, then; 'A great evil has befallen our w.land. The Sun Queen has captured the Citadel, and sits on its throne, whilst the rightful ruler lies in her w.dungeon.'";
        msg (s);
      },
      east:"market_square",
    },
  );

  createItem("sage", 
    NPC(false),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"sage_tower",
    },
  );

  createItem("sage_why_me", 
    TOPIC(true),
    {
      loc:"sage",
    },
  );

  createItem("sage_offer_help", 
    TOPIC(true),
    {
      loc:"sage",
    },
  );

  createItem("sage_sun_queen", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("sage_citadel", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("sage_any_help", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("sage_army_wiped_out", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("sage_bad_prince", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("sage_get_inside", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("sage_moonstone", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("sage_weapon", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("spell_unlock", 
    INSTANT_SPELL(),
    {
      loc:"sage",
    },
  );

  createItem("spell_returning", 
    INSTANT_SPELL(),
    {
      loc:"sage",
      desc:"You feel as though you are being turned inside out, suddenly you are elsewhere...",
    },
  );

  createItem("sage_have_gem", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("moonstone_amulet", 
    {
      loc:"sage",
      examine:"This somewhat gaudy tricket holds the moonstone that you recovered from the necropolis. It will protect you from fire magic.",
    },
  );

  createItem("sage_prophecy", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("spell_lore", 
    LASTING_SPELL(),
    {
      loc:"sage",
      desc:"Somehow you feel more knowledgeable.",
    },
  );

  createItem("dagger", 
    WEAPON(),
    {
      loc:"sage",
    },
  );

  createItem("sage_you_are_puppet", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("sage_password", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("sage_red_sky", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("sage_returning", 
    TOPIC(false),
    {
      loc:"sage",
    },
  );

  createItem("magpie_upstairs", 
    TOPIC(true),
    {
      loc:"sage_tower",
    },
  );

  createItem("sage_tower_hole", 
    {
      loc:"sage_tower",
      examine:"The square hole in the ceiling is neatly cut and finished, and is perhaps just big enough to squeeze through - if there was a way up.",
    },
  );

  createItem("sage_tower_monster_from_below", 
    {
      loc:"sage_tower",
      examine:"It is hard to make out much at all of the monster in the room above, but it looks big and green, and it definitely has tentacles. You cannot see any eyes, but you somehow feel it is watching you.",
    },
  );

  createItem("sage_tower_string", 
    {
      loc:"sage_tower",
      examine:"The strings attached to the sage are pale brown and smooth. You count fourteen altogether, all taut, moving as the sage moves.",
    },
  );

  createItem("tome", 
    {
      loc:"sage_tower",
      examine:function(isMultiple) {
          msg ("The tome on the table is huge! It is bound in brown leather, and looks very w.old. It is opened to a page about three quarters of the way w.through. You lift up the w.book.");
          if (w.sage.loc === w.this.w.loc.loc) {
            msg ("'Do you mind,' objects the w.sage.");
            msg ("'I just want to see what it's w.called.'");
            msg ("'This is <i>The Eternal Word of Ismalodos, Seer to the Court of Gildesh</i>. You want to knowe the author too?' You w.nod. 'it was written by Ismalodos, Seer to the Court of w.Gildesh.'");
          }
          else {
            msg ("The front proclaims that this is <i>The Eternal Word of Ismalodos, Seer to the Court of Gildesh</i>, supposedly written by the seer w.hmself.");
          }
        },
    },
  );

  createItem("sage_bed", 
    {
      loc:"sage_tower",
      examine:"The sage's bed is a crude affair that looks curiously unused.",
    },
  );

  createItem("sage_books", 
    {
      loc:"sage_tower",
      pronouns:pronouns.plural,
      examine:function(isMultiple) {
          if (w.this.flag) {
            msg ("You look again at all those fake w.books...");
          }
          else {
            var s = "You look at the numerous books the sage w.owners. The subjects range from histories and memoirs to alchemy and w.astrology.";
            if (w.sage.loc === w.this.w.loc.loc) {
              s = s + " 'Please do not touch my books,' objects the sage, as you try to pick up a discourse on w.sanitation. It does not w.move. Ignoring the sage's complaints, you try another book, and w.another. You realise these are not real books; they are just wood, carved and painted to resemble w.books.";
            }
            else {
              s = s + " You try to pick up a discourse on w.sanitation. It does not w.move. You try another book, and w.another. You realise these are not real books; they are just wood, carved and painted to resemble w.books.";
            }
            msg (s);
            w.this.flag = true
          }
        },
    },
  );

  createRoom("road_approaching_town", 
    {
      loc:"town",
      desc:"You are stood on a road; a properly laid road, though not in a good state of repair. To the north is a town, or perhaps village would be a better word. A few dozen houses, a tavern and a tower. To the south, the road continues for some miles before disappearing in the hills.",
      beforeFirstEnter:function() {
        msg ("The market in Tandren is always a lively place, and today is no w.different. You wander amongst the brightly coloured stalls where traders are plying their wares, looking at trinkets and curios, with no particular w.plan. Of course, Grand {if w.player.shalazin_female:Mistress}{if not w.player.shalazin_female:Master} Shalazin wants fairy dust and salamder ears, but there will be time for that w.later.");
        msg ("'You want something special?' says a voice at your w.shoulder. You turn, a man in dark robes is w.there. 'I have some special items I think you will w.like. Not for all w.eyes...' Intrigued, you follow him to a secluded w.alley...");
        msg ("A sudden pain at the back of your head, darkness, w.confusion...");
        // ODD!!!
          spell_cancel("learnspell");
          w.player.startspell("learnspell");
          w.magpie.loc = this
          msg (" ");
          msg (" ");
          msg (" ");
          msg ("'w.Arg..' you w.say. 'w.What...' You look w.around. This is not the market in Tandren; it is not Tandren at w.all. 'w.Where...' Head hurting, you get to your feet, and look w.around.");
      },
      afterEnter:function() {
      },
      afterFirstEnter:function() {
        msg ("A magpie is stood by the side of the road, looking at w.you.");
        w.magpie.following = true
      },
      south:"road_south_of_town",
      north:"town_street",
    },
  );

  createRoom("road_south_of_town", 
    {
      loc:"town",
      desc:"The farmland has given way to forest. The road continues to the south, and looks like it does for many more miles. You could head south, return to Tandren, and abandon your chance of finding out what happened altogether, or head back north, towards the town.",
      north:"road_approaching_town",
      south:"start",
    },
  );

  createRoom("town_street", 
    {
      loc:"town",
      desc:"A narrow street between the houses, this connects the road to the south with the market square to the northeast. To the east is a tavern, <i>The Drunken Pig</i>. Besides that, the buildings are modest, single-story affairs.",
      beforeFirstEnter:function() {
      },
      east:"tavern",
      northeast:"market_square",
      south:"road_approaching_town",
    },
  );

  createRoom("sage_tower_upper", 
    {
      loc:"town",
      desc:function() {
        if (!w.sage_tower_monster.dead) {
          msg ("The upper floor of the sage's tower is circular, and dominated by a huge tentacled w.monstrosity.");
        }
        else {
          msg ("The upper floor of the sage's tower is circular, and dominated by the corpse of the huge tentacled w.monstrosity.");
        }
      },
      down:"sage_tower",
    },
  );

  createItem("sage_tower_monster", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"sage_tower_upper",
    },
  );

  createItem("stm_side_with_queen", 
    TOPIC(true),
    {
      loc:"sage_tower_monster",
    },
  );

  createItem("stm_heritary_no_reason", 
    TOPIC(false),
    {
      loc:"sage_tower_monster",
    },
  );

  createItem("stm_better_ruler", 
    TOPIC(false),
    {
      loc:"sage_tower_monster",
    },
  );

  createItem("stm_better_offer", 
    TOPIC(false),
    {
      loc:"sage_tower_monster",
    },
  );

  createItem("stm_queen_wants_you_dead", 
    TOPIC(false),
    {
      loc:"sage_tower_monster",
    },
  );

  createItem("stm_a_deal", 
    TOPIC(false),
    {
      loc:"sage_tower_monster",
    },
  );

  createItem("stm_is_female", 
    TOPIC(false),
    {
      loc:"sage_tower_monster",
    },
  );

  createRoom("forest_and_marsh_south", 
    {
      loc:"",
    },
  );

  createRoom("road_near_town", 
    {
      loc:"forest_and_marsh_south",
      desc:function() {
        var s = "On the outskirts of the small town, you can see mountains to the w.east. To the north, the road enters a forest, and beyond the forest, you can still see the very top of the w.citadel.";
        if (w.goat.loc === w.this.loc) {
          msg (s + " A goat stands in the field to the w.west.");
        }
        else {
          msg (s);
        }
      },
      south:"market_square",
      north:"road_edge_forest",
    },
  );

  createItem("goat", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"road_near_town",
    },
  );

  createItem("goat_sage", 
    TOPIC(true),
    {
      loc:"goat",
    },
  );

  createItem("goat_army", 
    TOPIC(true),
    {
      loc:"goat",
    },
  );

  createItem("goat_doom", 
    TOPIC(false),
    {
      loc:"goat",
    },
  );

  createItem("goat_red_sky", 
    TOPIC(false),
    {
      loc:"goat",
    },
  );

  createItem("goat_troll_bridge", 
    TOPIC(true),
    {
      loc:"goat",
    },
  );

  createItem("goat_sage_monster", 
    TOPIC(false),
    {
      loc:"goat",
    },
  );

  createRoom("road_edge_forest", 
    {
      loc:"forest_and_marsh_south",
      desc:"The road enters the forest here, heading somewhat northeast. You can see elm, yew and oak trees; a rough track also heads west into the forest.",
      south:"road_near_town",
      northeast:"road_milepost",
      west:"forest_mushroom_circle",
    },
  );

  createRoom("road_milepost", 
    {
      loc:"forest_and_marsh_south",
      desc:"The road continues through the forest. A milepost is stood at the sideof the road.",
      southwest:"road_edge_forest",
      north:"road_bridge_south",
      east:"forest_dead_sheep",
    },
  );

  createItem("milepost1", 
    {
      loc:"road_milepost",
      examine:function(isMultiple) {
          msg ("The milepost looks very old, but you can just make out that it is one league to the town and two to the w.citadel.");
          if (w.player.status === "Lore") {
            msg ("This is the main road from Tandren to the Citadel, built about 200 years ago - though presumably there was already some kind of track - not long after Letros became part of Per-w.Haligolia.");
          }
        },
    },
  );

  createRoom("road_bridge_south", 
    {
      loc:"forest_and_marsh_south",
      desc:"At one time, the road crossed a river here. Recent rains have swollen the river dramatically, and a torrent flows down from the mountains - so bad, it has washed the bridge away.",
      south:"road_milepost",
      west:"forest_south_river",
      northeast:"forest_flooded",
    },
  );

  createItem("bridge_south", 
    {
      loc:"road_bridge_south",
      examine:"The bridge was made of wood. It looks like there was a central pier, and when that washed away the rest if the bridge quickly followed.",
    },
  );

  createItem("magpie_river", 
    TOPIC(true),
    {
      loc:"road_bridge_south",
    },
  );

  createRoom("forest_south_river", 
    {
      loc:"forest_and_marsh_south",
      desc:"This track through the forest is almost in river here. Your feet swelch through the mud.",
      east:"road_bridge_south",
      southwest:"forest_pile_bones",
    },
  );

  createRoom("forest_pile_bones", 
    {
      loc:"forest_and_marsh_south",
      desc:"A small clearing in the forest.  There is a neat pile of bones here. A track heads west, but quickly disappears under the swollen waters of the river. Tracks also go northeast and south.",
      northeast:"forest_south_river",
      south:"forest_mushroom_circle",
    },
  );

  createItem("pile_of_bones_forest", 
    {
      loc:"forest_pile_bones",
      examine:function(isMultiple) {
          if (w.player.status === "Lore") {
            msg ("The bones are human, and probably female with the width of the w.pelvis. Teeth marks suggest someone got eaten here, by a wolf in all likelihood, several years w.ago.");
          }
          else {
            msg ("You are not sure, but you think the bones may well be w.human. Teeth marks suggest someone got eaten w.here.");
          }
        },
    },
  );

  createRoom("forest_mushroom_circle", 
    {
      loc:"forest_and_marsh_south",
      desc:"There is a delightful mushroom here, where the forest starts to give way to marsh. A track of sorts leads across the boggy ground to the north west, and rather better tracks head north and east. ",
      north:"forest_pile_bones",
      east:"road_edge_forest",
      northwest:"marsh_south",
    },
  );

  createItem("mushroom_circle", 
    {
      loc:"forest_mushroom_circle",
      examine:function(isMultiple) {
          if (w.player.status === "Lore") {
            msg ("About a dozen mushrooms, varying in from about thumb-sized to head-sized, in a neat circle, as forms when a single specimen spawns a number of young at a distance from itself and then w.dies. The mushrooms are like fleshy umbrellas, green on top, grey underneath, and are definitely not w.edible.");
          }
          else {
            msg ("About a dozen mushrooms, varying in from about thumb-sized to head-sized, in a neat w.circle. The mushrooms are like fleshy umbrellas, green on top, grey w.underneath.");
          }
        },
    },
  );

  createRoom("marsh_south", 
    {
      loc:"forest_and_marsh_south",
      desc:function() {
        msg ("The river forms a delta as it reachs the sea, splitting up in to hundred of w.channels. The track you are following hopefully picks a route through the marsh that you can follow despite the height of the w.river.");
        if (w.mudman.loc === w.this.loc) {
          if (w.mudman.dead) {
            msg ("A pile of mud is all that remains of the w.mudman.");
          }
          else {
            msg ("A creature, approximately humanoid, and seemingly made of mud stands here preventing you going w.north.");
          }
        }
      },
      southeast:"forest_mushroom_circle",
      north:"marsh_north",
    },
  );

  createItem("mudman", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"marsh_south",
    },
  );

  createRoom("forest_high_bridge_south", 
    {
      loc:"forest_and_marsh_south",
      desc:function() {
        var s = "You are stood on the edge of a wide chasm, carved deep by the river, someway below w.you.";
        if (w.this.logfallen) {
          s = s + " No way are you getting across there!";
        }
        else {
          s = s + " As chance would have, a log has fallen across the chasm, and spans the w.gap. It would be precarious, but you could probably use it to get w.across.";
        }
        s = s + " A track emerges from the forest to the southwest, heading into the mountains to the w.east.";
        msg (s);
      },
      southwest:"forest_steep_track_south",
      north:"forest_high_bridge_north",
      east:"forest_waterfall",
    },
  );

  createItem("river2", 
    {
      loc:"forest_high_bridge_south",
      examine:"The river here is very fast flowing; all the rainwater from the mountains forced through a narrow channel.",
    },
  );

  createItem("chasm2", 
    {
      loc:"forest_high_bridge_south",
      examine:"The chasm is wide and deep, with a river at the bottom. Falling in it would probably be fatal.",
    },
  );

  createItem("log_bridge2", 
    {
      loc:"forest_high_bridge_south",
      examine:"The log is not an ideal way to cross the ravine, but looks possible with care. You can see signs someone has tried to secure the end to stop it moving. It does not look like it fell here naturally - there is no stump - but it would be no mean feat getting the log in place.",
    },
  );

  createRoom("forest_dead_sheep", 
    {
      loc:"forest_and_marsh_south",
      desc:"The track wided as it curves from west to northeast, rising as it does so. A sheep carcass lies beside it.",
      west:"road_milepost",
      northeast:"forest_shrine",
    },
  );

  createItem("dead_sheep", 
    {
      loc:"forest_dead_sheep",
      examine:function(isMultiple) {
          if (w.player.status === "Lore") {
            msg ("The sheep has been dead two to three w.weeks. It looks to have had its throat cut, but there is no sign of its being used for meat; was it the victim of a cultic sacrifice?");
          }
          else {
            msg ("The sheep has been dead a while, you guess, and it is providing quite a feast for the w.maggots.");
          }
        },
    },
  );

  createRoom("forest_shrine", 
    {
      loc:"forest_and_marsh_south",
      desc:"A clearing, with a small shrine set in the centre. The forest slopes here, rising to the northeast. You can see tracks heading wesy, southwest, east and north.",
      afterEnter:function() {
        if (w.player.status === "KoboldGlamour" && w.druid.loc === w.this.loc) {
          msg ("'Die, despoiler of forests,' cries the druid, raising her w.staff.");
          msg ("'Wait, w.wait...' you stammar, as you remember you look like a w.kobold. 'I'm not really a w.kobold. Look!' You quickly cancel the w.spell.");
          if (w.player.sewer) {
            msg ("She sniffs you cautiously; 'You don't smell like a kobold - in fact you smell considerably worse than they w.do.'");
          }
          else {
            msg ("She sniffs you cautiously; 'You do smell w.human.'");
          }
          CancelSpell
        }
      },
      southwest:"forest_dead_sheep",
      west:"forest_camp_site",
      north:"forest_steep_track_south",
    },
  );

  createItem("shrine_nature", 
    {
      loc:"forest_shrine",
      examine:function(isMultiple) {
          if (w.player.status === "Lore") {
            msg ("The shrine is carved from a rocky w.outcrop. It is typical of those of the nature goddess known as Tera in this w.area. The flowers left in offering suggest she is still worshiped w.here.");
          }
          else {
            msg ("The shrine is carved from a rocky w.outcrop. You do not recognise the god, but the flowers left in offering suggest she is still worshiped in this w.area.");
          }
        },
    },
  );

  createItem("druid", 
    NPC(true),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"forest_shrine",
    },
  );

  createItem("druid_shrine", 
    TOPIC(true),
    {
      loc:"druid",
    },
  );

  createItem("druid_spells", 
    TOPIC(true),
    {
      loc:"druid",
    },
  );

  createItem("druid_spell_to_defeat", 
    TOPIC(false),
    {
      loc:"druid",
    },
  );

  createItem("druid_tera", 
    TOPIC(false),
    {
      loc:"druid",
    },
  );

  createItem("spell_tongues", 
    LASTING_SPELL(),
    {
      loc:"druid",
    },
  );

  createItem("spell_truesight", 
    INSTANT_SPELL(),
    {
      loc:"druid",
    },
  );

  createItem("druid_tree_huggers_suck", 
    TOPIC(true),
    {
      loc:"druid",
    },
  );

  createItem("druid_staff", 
    WEAPON(),
    {
      loc:"druid",
    },
  );

  createItem("fox", 
    NPC(false),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"forest_shrine",
    },
  );

  createItem("fox_be_fox", 
    TOPIC(true),
    {
      loc:"fox",
    },
  );

  createItem("fox_sun_queen", 
    TOPIC(true),
    {
      loc:"fox",
    },
  );

  createItem("fox_citadel", 
    TOPIC(true),
    {
      loc:"fox",
    },
  );

  createItem("fox_druid", 
    TOPIC(true),
    {
      loc:"fox",
    },
  );

  createRoom("forest_camp_site", 
    {
      loc:"forest_and_marsh_south",
      desc:"A clearing that loks to have been used as a campsite, to judge by three patches of scorched ground. Tracks lead north and east.",
      east:"forest_shrine",
      north:"forest_flooded",
    },
  );

  createItem("scorch_marks_forest", 
    {
      loc:"forest_camp_site",
      examine:"It looks like people have been cooking here, you would guess on several occasions. The scorched patches are neat circles, surrounded by stones.",
    },
  );

  createRoom("forest_flooded", 
    {
      loc:"forest_and_marsh_south",
      desc:"The river has flooded it banks here, and to the north, the tree roots are all under water. The tracks going southwest and south are only slightly better, though the track east rises steeply and so is rather better.",
      south:"forest_camp_site",
      southwest:"road_bridge_south",
      east:"forest_steep_track_south",
    },
  );

  createRoom("forest_steep_track_south", 
    {
      loc:"forest_and_marsh_south",
      desc:"The forest rises steeply to the north east here. A steep track heads that way after crossing a stream on a narrow bridge. Tracks west and south slope downwards.",
      west:"forest_flooded",
      south:"forest_shrine",
      northeast:"forest_high_bridge_south",
    },
  );

  createItem("stream5", 
    {
      loc:"forest_steep_track_south",
      examine:"The stream is not deep, and unlike the river looks to be no higher than usual.",
    },
  );

  createItem("ancient_oak", 
    {
      loc:"forest_and_marsh_south",
      examine:"You are not sure how you know this tree is particularly old, but you are sure it is. It seems to have an aura of, well, majesty, as though it is lord of the forest.",
    },
  );

  createRoom("forest_waterfall", 
    {
      loc:"forest_and_marsh_south",
      desc:"This is the edge of the forest. To the north, the ground drops away into a narrow gorge, to the east a cliff face rises. A waterfall tumbles down into the gorge. Tracks lead west and south.",
      west:"forest_high_bridge_south",
    },
  );

  createRoom("forest_and_marsh_north", 
    {
      loc:"",
    },
  );

  createRoom("road_bridge_north", 
    {
      loc:"forest_and_marsh_north",
      desc:"This is the main road from the town to the citadel. It runs pretty straight north from here, and you can just se the blood red citadel. The route south... is not so good. The bridge has been washed away. A forest tack heads west.",
      west:"forest_shack",
      north:"road_milepost_north",
    },
  );

  createItem("bridge_north", 
    {
      loc:"road_bridge_north",
      examine:"The bridge was made of wood. It looks like there was a central pier, and when that washed away the rest if the bridge quickly followed.",
    },
  );

  createRoom("road_milepost_north", 
    {
      loc:"forest_and_marsh_north",
      desc:"The road here cuts straight through the forest, south to north. A milepost lies beside the road.",
      south:"road_bridge_north",
      north:"road_near_citadel",
      east:"forest_grave",
    },
  );

  createItem("milepost2", 
    {
      loc:"road_milepost_north",
      examine:"The milepost looks very old, but you can just make out that it is two leagues to the town and one to the citadel. Presumably that assumes the bridge is there...",
    },
  );

  createRoom("road_near_citadel", 
    {
      loc:"forest_and_marsh_north",
      desc:"The road here emerges from the forest, and it is not far to the gates of the citadel to the north.",
      north:"road_outside_citadel",
      south:"road_milepost_north",
      west:"forest_blasted_tree",
      east:"forest_mushroom",
    },
  );

  createRoom("road_outside_citadel", 
    {
      loc:"forest_and_marsh_north",
      desc:"You are stood outside the gates of the citadel, to the north. The road south heads back to the town.",
      south:"road_near_citadel",
      north:"citadel_first_gateway",
    },
  );

  createItem("magpie_look_over_gates", 
    TOPIC(true),
    {
      loc:"road_outside_citadel",
    },
  );

  createItem("gates", 
    {
      loc:"road_outside_citadel",
      pronouns:pronouns.plural,
      examine:function(isMultiple) {
          var s = "The gates of the citadel tower over you, perhaps four times your height, and wide enough to allow the biggest of wagons w.through. They are of ironwood, and are festooned with spikes to deter anyone considering a frontal w.attack.";
          if (w.this.isopen) {
            s = s + " The right gate stands w.open.";
          }
          msg (s);
        },
    },
  );

  createRoom("forest_shack", 
    {
      loc:"forest_and_marsh_north",
      desc:"A small clearing with a tumbledown shack off to the side. A small stream tumbles past, heading to the river to the south. The track north follows the stream. A plank of wood has been placed across the stream, and a rather better track heads east. A third track goes west.<br/>",
      west:"forest_giant_head",
      east:"road_bridge_north",
      north:"forest_duck_pond",
    },
  );

  createItem("tumbledown_shack", 
    {
      loc:"forest_shack",
      examine:function(isMultiple) {
          if (w.player.status === "Lore") {
            msg ("There really is not much left of the w.shack. Most of the front wall and all the right wall have gone, and of the roof there is only a few beams w.left. It would have been a simple structure when complete, probably home to a charcoal w.burner.");
          }
          else {
            msg ("There really is not much left of the w.shack. Most of the front wall and all the right wall have gone, and of the roof there is only a few beams w.left.");
          }
        },
    },
  );

  createItem("stream1", 
    {
      loc:"forest_shack",
      examine:"The stream is not deep, and unlike the river looks to be no higher than usual.",
    },
  );

  createRoom("forest_cairn", 
    {
      loc:"forest_and_marsh_north",
      desc:function() {
        msg ("A large open area, with a small cairn in the w.centre.  The only way is the track south w.east.");
        if (w.centaur.loc === w.this.loc) {
          if (w.centaur.dead) {
            msg ("The corpse of a centaur lies w.here.");
          }
          else {
            msg ("A centaur is tending the w.cairn.");
          }
        }
        if (MonsterPresent("Bugbear")) {
          if (w.centaur_corpse.loc === w.this.loc) {
            if (w.centaur.dead) {
              msg ("A bugbear is eating from the corpse of the centaur you w.killed.");
            }
            else {
              msg ("A bugbear is eating from the corpse of a w.centaur.");
            }
          }
          else {
            msg ("There is a bugbear, sniffing around the w.cairn.");
          }
        }
        else {
          if (w.centaur_corpse.loc === w.this.loc) {
            if (w.centaur.dead) {
              msg ("The corpse of the centaur you killed lies w.here.");
            }
            else {
              msg ("The corpse of a centaur lies w.here.");
            }
          }
        }
      },
      southeast:"forest_giant_head",
    },
  );

  createItem("centaur", 
    NPC(false),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"forest_cairn",
    },
  );

  createItem("centaur_cairn", 
    TOPIC(true),
    {
      loc:"centaur",
    },
  );

  createItem("centaur_battle", 
    TOPIC(false),
    {
      loc:"centaur",
    },
  );

  createItem("centaur_citadel", 
    TOPIC(true),
    {
      loc:"centaur",
    },
  );

  createItem("centaur_spell", 
    TOPIC(false),
    {
      loc:"centaur",
    },
  );

  createItem("centaur_frost_lord", 
    TOPIC(false),
    {
      loc:"centaur",
    },
  );

  createItem("centaur_secret_passage", 
    TOPIC(false),
    {
      loc:"centaur",
    },
  );

  createItem("cairn", 
    {
      loc:"forest_cairn",
      examine:function(isMultiple) {
          if (w.player.status === "Lore") {
            msg ("A carefully arranged pile of rocks, all about fist sized, and reaching to about waist w.height. It stands here to remember those who fell in battle when the so-called Frost Lord was defeated many decades w.ago.");
          }
          else {
            msg ("A carefully arranged pile of rocks, all about fist sized, and reaching to about waist w.height. You wonder what it w.signifies.");
          }
        },
    },
  );

  createRoom("forest_giant_head", 
    {
      loc:"forest_and_marsh_north",
      desc:"You are at the edge of the forest; the track south leads to the marsh. There is a giant stone head lying beside the path, tilted to one side. Tracks lead north west and east.",
      northwest:"forest_cairn",
      south:"marsh_north",
      east:"forest_shack",
    },
  );

  createItem("giant_head", 
    {
      loc:"forest_giant_head",
      examine:function(isMultiple) {
          if (w.player.status === "Lore") {
            msg ("The head is considerably taller than w.you. Rather crudely carved from dark stone, and somewhat weathered too, it depicts a rather thickset man with a heavy w.frown. Centuries ago this would have been part of a complete statue, one of a pair that stood guarding the entrance to the w.Citadel. A violent change of ownership, accompanied by a change in religion, led to the statues being destroyed, and the heads buried (the rest of the statues would have been broken up and probably used to make or repair roads). Over the years, the river has, it would seem, unearthed this w.one.");
          }
          else {
            msg ("The head is considerably taller than w.you. Rather crudely carved from dark stone, and somewhat weathered too, you guess it depicts a rather thickset man with a heavy w.frown.");
          }
        },
    },
  );

  createRoom("forest_blasted_tree", 
    {
      loc:"forest_and_marsh_north",
      desc:"A clearing in the forest. In the centre, a tree, blacked by a lightning strike presumably. Tracks lead north, east and southeast.",
      east:"road_near_citadel",
      southeast:"forest_duck_pond",
      north:"forest_dead_end",
    },
  );

  createItem("blasted_tree", 
    {
      loc:"forest_blasted_tree",
      examine:"The blasted tree is black and lifeless, and in a strange way a little sinster.",
    },
  );

  createRoom("forest_duck_pond", 
    {
      loc:"forest_and_marsh_north",
      desc:"The forest opens out somewhat by a pond. A track heads north west, another follows a stream from the pond southwards.",
      afterFirstEnter:function() {
        msg ("Three ducks fly up from the pond, startled by your w.movement.");
        if (w.player.status === "Tongues" && w.magpie.following) {
          msg ("'Stupid ducks,' mutters the w.magpie.");
        }
      },
      northwest:"forest_blasted_tree",
      south:"forest_shack",
    },
  );

  createItem("stream2", 
    {
      loc:"forest_duck_pond",
      examine:"The stream is not deep, and unlike the river looks to be no higher than usual.",
    },
  );

  createItem("pond", 
    {
      loc:"forest_duck_pond",
      examine:"The pond reminds you of feeding the ducks as a child, though there are no ducks here now.",
    },
  );

  createItem("duck", 
    {
      loc:"forest_duck_pond",
      examine:"You look up at the sky, but the ducks are far away now.",
    },
  );

  createRoom("forest_grave", 
    {
      loc:"forest_and_marsh_north",
      desc:"You can see a grave marker in the centre of this clearing. Tracks lead west and sloping upwards to the northeast.",
      northeast:"forest_mushroom",
      west:"road_milepost_north",
    },
  );

  createItem("grave_forest", 
    {
      loc:"forest_grave",
      examine:function(isMultiple) {
          if (w.player.status === "Tongues" && w.magpie.following && !GetBoolean(this, "flag")) {
            msg ("It is a simple grave marker, typical of the worshippers of Yon, indicates where a warrior fell many years w.ago. 'Something disturbing about a grave,' says the w.magpie. 'It's like humans saying they want to be eaten by worms and not proper w.animals.'");
            msg ("'Proper animals like you?'");
            msg ("'Well, among w.others.'");
            w.this.flag = true
          }
          else {
            msg ("It is a simple grave marker, typical of the worshippers of Yon, indicates where a warrior fell many years w.ago.");
          }
        },
    },
  );

  createRoom("forest_mushroom", 
    {
      loc:"forest_and_marsh_north",
      desc:"You are in a clearing dominated by a giant mushroom. The forest slopes, rising to the east, falling to the west. Tracks lead west, southwest and east.",
      southwest:"forest_grave",
      east:"forest_steep_track",
      west:"road_near_citadel",
    },
  );

  createItem("giant_mushroom", 
    {
      loc:"forest_mushroom",
      examine:"The mushroom is red with white spots, and almost as tall as you are. You recalled tales when you were a child of feyfolk living in mushrooms, but against all the laws of narrative there is no sign of a door or windows.",
    },
  );

  createRoom("forest_steep_track", 
    {
      loc:"forest_and_marsh_north",
      desc:"The track is steep here, and footing is tricky, what with everthing so wet and muddy. The track climbs to the east, falls to the west.",
      east:"forest_high_bridge_north",
      west:"forest_mushroom",
    },
  );

  createRoom("forest_high_bridge_north", 
    {
      loc:"forest_and_marsh_north",
      desc:function() {
        var s = "You are stood on the edge of a wide chasm, carved deep by the river, someway below w.you.";
        if (w.forest_high_bridge_south.logfallen) {
          s = s + " No way are you getting across there!";
        }
        else {
          s = s + " As chance would have, a log has fallen across the chasm, and spans the w.gap. It would be precarious, but you could probably use it to get w.across.";
        }
        s = s + " A track heads up to the north east, and downwards to the w.west.";
        msg (s);
      },
      northeast:"forest_track_ends",
      south:"forest_high_bridge_south",
      west:"forest_steep_track",
    },
  );

  createItem("river1", 
    {
      loc:"forest_high_bridge_north",
      examine:"The river here is very fast flowing; all the rainwater from the mountains forced through a narrow channel.",
    },
  );

  createItem("chasm1", 
    {
      loc:"forest_high_bridge_north",
      examine:"The chasm is wide and deep, with a river at the bottom. Falling in it would probably be fatal.",
    },
  );

  createItem("log_bridge1", 
    {
      loc:"forest_high_bridge_north",
      examine:"The log is not an ideal way to cross the ravine, but looks possible with care. You can see signs someone has tried to secure the end to stop it moving. It does not look like it fell here naturally - there is no stump - but it would be no mean feat getting the log in place.",
    },
  );

  createRoom("forest_track_ends", 
    {
      loc:"forest_and_marsh_north",
      desc:function() {
        var s = "The track just peters out w.here. Ahead, a cliff face marks the start of the w.mountains. ";
        if (w.player.agility > w.exit_to_mountain_track.agility) {
          s = s + "You think you just could climb the cliff to the w.northeast.";
        }
        else {
          s = s + "If you were a little more agile, you could probably climb the cliff to the w.northeast.";
        }
        msg (s);
      },
      southwest:"forest_high_bridge_north",
      climb:"mountain_track",
    },
  );

  createItem("magpie_scout_cliff", 
    TOPIC(true),
    {
      loc:"forest_track_ends",
    },
  );

  createItem("cliff_fface", 
    {
      loc:"forest_track_ends",
      examine:"The cliff face is the start of the mountains.",
    },
  );

  createRoom("forest_dead_end", 
    {
      loc:"forest_and_marsh_north",
      desc:function() {
        if (w.this.revealed) {
          msg ("The forest thins out as it approaches the rocky outcrop upon which the citadel w.stands. The track from the south leads into a narrow cave to the w.north.");
        }
        else {
          msg ("The forest thins out as it approaches the rocky outcrop upon which the citadel w.stands. The track from the south just stops w.here.");
        }
      },
      south:"forest_blasted_tree",
      north:"forest_narrow_cave",
    },
  );

  createRoom("forest_narrow_cave", 
    {
      loc:"forest_and_marsh_north",
      desc:"The cave is long, and slopes upwards to the north. It is relatively smooth under foot, and the walls as well show some signs of working; it looks like the cave has been enlarged by someone as it continues to the east.",
      south:"forest_dead_end",
      east:"citadel_guardroom_store",
    },
  );

  createItem("magpie_fly_on", 
    TOPIC(true),
    {
      loc:"forest_narrow_cave",
    },
  );

  createRoom("mountain_track", 
    {
      loc:"forest_and_marsh_north",
      desc:"You are now some way above the forest, on a narrow track that cuts northeast. To the east, the mountains rise higher, but you can see the Citadel to the west, with the forest to its south. The river, from its start in the mountains, cuts a winding path through the forest, through the salt marshes and into the sea on the horizon. Even Applebrook is just visible to the southwest, the sage's tower visible over the treetops.",
      southwest:"forest_track_ends",
      northeast:"mountain_slope",
    },
  );

  createRoom("mountain_slope", 
    {
      loc:"forest_and_marsh_north",
      desc:"The mountain track from the southwest stops here at a small cave, lying northwest, beside a small stream that tumbles down the mountain.",
      southwest:"mountain_track",
      northwest:"mountain_cave",
    },
  );

  createItem("stream3", 
    {
      loc:"mountain_slope",
      examine:"The stream is not deep, and unlike the river looks to be no higher than usual.",
    },
  );

  createRoom("mountain_cave", 
    {
      loc:"forest_and_marsh_north",
      desc:"The cave is about the size of a large room, and shows clear signs of habitation, not least of all the witch stood wstirring a cauldron.",
      afterEnter:function() {
        if (w.player.status === "KoboldGlamour" && w.witch.loc === w.this.loc) {
          msg ("'You want to be careful wandering into people's home looking like that,' says the w.witch.");
          msg ("'What? oh, the glamour' You cancel the spell, so you look human whilst talking to w.her.");
          CancelSpell
        }
      },
      southeast:"mountain_slope",
    },
  );

  createItem("witch", 
    NPC(true),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"mountain_cave",
    },
  );

  createItem("witch_whats_cooking", 
    TOPIC(true),
    {
      loc:"witch",
    },
  );

  createItem("witch_kobolds_are_sentient", 
    TOPIC(false),
    {
      loc:"witch",
    },
  );

  createItem("witch_any_spare", 
    TOPIC(false),
    {
      loc:"witch",
    },
  );

  createItem("witch_where_find_kobold", 
    TOPIC(false),
    {
      loc:"witch",
    },
  );

  createItem("witch_name", 
    TOPIC(true),
    {
      loc:"witch",
    },
  );

  createItem("witch_kobold_glamour", 
    TOPIC(false),
    {
      loc:"witch",
    },
  );

  createItem("spell_kobold_glamour", 
    LASTING_SPELL(),
    {
      loc:"witch",
      desc:"You cast the spell; you do not feel any different, but your hards look green and scaly now, so presumably it worked,",
    },
  );

  createItem("witch_sun_queen", 
    TOPIC(true),
    {
      loc:"witch",
    },
  );

  createItem("cauldron", 
    {
      loc:"mountain_cave",
      examine:"The cauldron is huge, black and metal. It hangs from the roof of the cave by a chain attached to its handle. Under it a fire smoulders gently.",
    },
  );

  createRoom("marsh_north", 
    {
      loc:"forest_and_marsh_north",
      desc:"You are pretty much over the river now. The ground is still boggy, but you can see the track heads clearly into firmer ground, in the forest to the north. A rather more muddy path leads further into the marsh to the west.",
      south:"marsh_south",
      north:"forest_giant_head",
      west:"marsh_central",
    },
  );

  createRoom("marsh_central", 
    {
      loc:"forest_and_marsh_north",
      desc:"This is a wide open area, from were you have a good view of the Citadel to the north west, rising above the forest, while to the south the river heads west wards to the sea. The ground is boggy, but it looks like you could pick your way east or northwest.",
      east:"marsh_north",
      northwest:"marsh_west",
    },
  );

  createRoom("marsh_west", 
    {
      loc:"forest_and_marsh_north",
      desc:"The marsh here borders the sea to the west. The ground is as boggy as ever, but only the hardiest of grasses can live in the brackish water. To the northeast, a huge pipe, wider than you are high, juts out from the rock , into the marsh, discharging it content. From the smell, you guess this is the sewer from the Citadel. Nevertheless, you could pick a way across to the northwest.",
      southeast:"marsh_central",
      northeast:"sewers_outlet",
      northwest:"marsh_far_west",
    },
  );

  createItem("pipe", 
    {
      loc:"marsh_west",
      examine:function(isMultiple) {
          msg ("The pipe is metal and heavily w.corroded. You can see that it goes only a short way into to the rock, beond that the tunnel is cut directly into the w.stone.");
        },
    },
  );

  createRoom("marsh_far_west", 
    {
      loc:"forest_and_marsh_north",
      desc:"The salt marshes extend out into the sea here, and the only way is back to the southeast. This is a bleak, wind-swept place.",
      southeast:"marsh_west",
    },
  );

  createItem("hydra", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"marsh_far_west",
      examine:function(isMultiple) {
          picture ("w.hydra.png");
        },
    },
  );

  createRoom("sewers_outlet", 
    {
      loc:"forest_and_marsh_north",
      desc:"You are knee-deep in raw sewage. To the southwest, you can see light and the promise of fresh air, to the west, more of what you are currently stood in.",
      southwest:"marsh_west",
      east:"sewers_tunnel",
    },
  );

  createRoom("sewers_tunnel", 
    {
      loc:"forest_and_marsh_north",
      desc:function() {
        var s = "The sewer runs quite a distance from east to w.west.";
        if (!w.giant_rat.dead) {
          s = s + " A giant rats prevents you going w.east.";
        }
      },
      west:"sewers_outlet",
      east:"sewers_nexus",
    },
  );

  createItem("giant_rat", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"sewers_tunnel",
      examine:function(isMultiple) {
          msg ("");
          picture ("w.giant_rat.png");
        },
    },
  );

  createRoom("sewers_nexus", 
    {
      loc:"forest_and_marsh_north",
      desc:"You estimate you are now under the Citadel itself. The main tunnel runs from the northeast, to the east, on a gentle slope,  and there are several small pipes connecting to this tunnel, though none of them big enough for you to crawl along. There is, however, a ladder leading upwards.",
      west:"sewers_tunnel",
      northeast:"sewers_end",
      up:"citadel_menagerie",
    },
  );

  createItem("ladder", 
    {
      loc:"sewers_nexus",
      examine:"The ladder is metal, filthy and secured to the wall.",
    },
  );

  createRoom("sewers_end", 
    {
      loc:"forest_and_marsh_north",
      desc:"This is the end of the main sewer tunnel, though many smaller pipes discharge into here.",
      southwest:"sewers_nexus",
      up:"citadel_cellars",
    },
  );

  createItem("ladder1", 
    {
      loc:"sewers_end",
      examine:"The ladder is metal and secured to the wall.",
    },
  );

  createRoom("outer_citadel", 
    {
      loc:"",
      beforeEnter:function() {
    },
    },
  );

  createRoom("citadel_first_gateway", 
    {
      loc:"outer_citadel",
      desc:"The gateway was clearly built for something big. It is well over twice your height, and almost as wide. You notice some holes in the ceiling, and there are four sets of slots in walls where portcullises can be dropped. North takes you into the citadel, south back out.",
      north:"citadel_first_courtyard",
      south:"road_outside_citadel",
    },
  );

  createItem("murder_hole1", 
    {
      loc:"citadel_first_gateway",
      examine:"The holes are about the size of your fist, and are probably to allow defenders to drop boiling oil or whatever on to any intruder.",
    },
  );

  createItem("kobold_guard", 
    NPC(false),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"citadel_first_gateway",
      examine:function(isMultiple) {
          picture ("w.kobold_warrior.png");
          if (w.player.status === "Lore") {
            msg ("Kobolds are reptilian humanoids, who would only come up to your shoulder if stood up straight, with w.green. scaled w.skin. Cunning and cruel, they breed quickly and grow fast, and the Sun Queen uses them extensively as foot w.soldiers.");
          }
          else {
            msg ("The kobold is a skulking humanoid, who would only come up to your shoulder if he stood up w.straight. His skin is green and scaled, and he is dressed in ragged w.clothes. His teeth look sharp, his eyes w.cruel.");
          }
        },
    },
  );

  createItem("gates1", 
    {
      loc:"citadel_first_gateway",
      examine:function(isMultiple) {
          var s = "The gates of the Citadel tower over you, perhaps four times your height, and wide enough to allow the biggest of wagons w.through. ";
          if (w.gates.isopen) {
            msg (s + "The left gate stands open");
          }
          else if (w.this.locked) {
            msg (s + "A heavy bar keeps the gates w.locked.");
          }
        },
    },
  );

  createItem("heavy_bar", 
    {
      loc:"citadel_first_gateway",
      examine:function(isMultiple) {
          if (w.gates.locked) {
            msg ("The heavy bar is made of iron wood, and lies across almost the full width of the gateway, held inplace by ironwork, keeping the gates firmly w.locked.");
          }
          else {
            msg ("The heavy bar is made of iron wood, and would be almost the full width of the w.gateway. It is lying on the ground to the right of the w.gates.");
          }
        },
    },
  );

  createRoom("citadel_first_courtyard", 
    {
      loc:"outer_citadel",
      desc:"This courtyard is almost as big as the market square in town, but the blood red stone of the citadel rising on all sides around you makes it feel quite oppressive. The huge gateway is to the south, and there are two doors almost as big to the east and south east. A more reasonably-sized door is to the west. To the north, two stone stairways lead up to a higher area - little more than a balcony really. The bulk of the citadel lies that way.",
      south:"citadel_first_gateway",
      southeast:"citadel_coachhouse",
      east:"citadel_lair",
      west:"citadel_guardroom",
      north:"citadel_first_courtyard_upper",
      up:"citadel_first_courtyard_upper",
    },
  );

  createRoom("citadel_guardroom", 
    {
      loc:"outer_citadel",
      desc:"A long, narrow room with a low ceiling. The two windows are small, and look out on the courtyard; the only door is that way too, though there is a trapdoor in the floor. A long table with a dozen crude stools set under it are the only furniture.",
      east:"citadel_first_courtyard",
      down:"citadel_guardroom_store",
    },
  );

  createItem("guardroom_table", 
    {
      loc:"citadel_guardroom",
      examine:"The table is crudeky made from four long planks of wood, nails to a number pof cross beams, with legs attached.",
    },
  );

  createItem("guardroom_stool", 
    {
      loc:"citadel_guardroom",
      examine:"A simple three-legged stool.",
    },
  );

  createRoom("citadel_guardroom_store", 
    {
      loc:"outer_citadel",
      desc:function() {
        var s = "A dark and dusty room with a vaulted ceiling, strewn with w.debris. A ladder leads up to a w.trap.";
        if (w.exit_from_store.visible) {
          s = s + " To the west is the secret door you came through, cunningly hidden in the w.wall.";
        }
        msg (s);
      },
      west:"forest_narrow_cave",
      up:"citadel_guardroom",
    },
  );

  createRoom("citadel_barracks", 
    {
      loc:"outer_citadel",
      desc:"The far side of this long, narrow room is lined with bunk beds, fourteen in total. There are narrow slit windows between them. On the near side of the room, the larger windows look on to the courtyard. Doors to the northeast and southeast.",
      beforeFirstEnter:function() {
        Generate (kobold, this, crude_spear, "Sneering kobold");
        Generate (kobold, this, crude_spear, "Stupid kobold");
        Generate (kobold, this, crude_spear, "Lazy kobold");
      },
      east:"citadel_first_courtyard_upper",
      south:"citadel_gatehouse",
      up:"citadel_lower_ramparts",
    },
  );

  createItem("bunkbeds", 
    {
      loc:"citadel_barracks",
      examine:"The bunks are nothing special; made of wood, padded with straw-filled bags.",
    },
  );

  createRoom("citadel_coachhouse", 
    {
      loc:"outer_citadel",
      desc:"This is the coachhouse - where the Sun Queen keeps her coach and various machines of war. The only door is to the northwest.",
      northwest:"citadel_first_courtyard",
    },
  );

  createItem("machines_of_war", 
    {
      loc:"citadel_coachhouse",
      examine:"You can see three ballistas (giant crossbows), a sling, and a covered battering ram. They all look used, but carefully maintained and ready for action.",
    },
  );

  createItem("coach", 
    {
      loc:"citadel_coachhouse",
      examine:"The coach is black, lined in red, and has places for six horses. It is open-topped, and for a moment you wonder what she does in poor weather, before remembering she is the Sun Queen. Presumable she can ensure it us not inclement.",
    },
  );

  createRoom("citadel_lair", 
    {
      loc:"outer_citadel",
      desc:"This is where the Sun Queen keeps the fearsome beasts she uses to terrorise the land and to dominate the battlefield. A large room, to storeys high. the floor is strew with straw, and there are barrels of water at various points. The room smells of death and blood. Probably just the creatures' last meal. Besides the huge doors to the west, a flight of wooden steps leads up to a door to the north.",
      west:"citadel_first_courtyard",
      up:"citadel_beastmasters_quarters",
      north:"citadel_beastmasters_quarters",
    },
  );

  createItem("fire_bull", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"citadel_lair",
    },
  );

  createRoom("citadel_first_courtyard_upper", 
    {
      loc:"outer_citadel",
      south:"citadel_first_courtyard",
      down:"citadel_first_courtyard",
      southeast:"citadel_beastmasters_quarters",
      west:"citadel_barracks",
      north:"citadel_second_gateway",
    },
  );

  createItem("gargoyle", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"citadel_first_courtyard_upper",
    },
  );

  createRoom("citadel_gatehouse", 
    {
      loc:"outer_citadel",
      desc:"This long room extends the width of a citadel, going right across the gateway. You can see four portcullises here, raised out of the way, plus the associated mechanisms for each. Numerous slit windows overlook the forest, giving archers a relatively safe position to shoot potential attackers.",
      north:"citadel_barracks",
    },
  );

  createRoom("citadel_beastmasters_quarters", 
    {
      loc:"outer_citadel",
      desc:"This is the quarters of the beastmaster, and this would seem to be a position of some standing. She has her own bed, and the room is relatively well-appointed, with a wardrobe, with a mirror on it, and a painting on the wall. It does smell somewhat of beasts, but perhaps she is so used to it she does not notice. Doors to west and south.",
      northwest:"citadel_first_courtyard_upper",
      south:"citadel_lair",
    },
  );

  createItem("beastmaster", 
    NPC(true),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"citadel_beastmasters_quarters",
    },
  );

  createRoom("citadel_lower_ramparts", 
    {
      loc:"outer_citadel",
      desc:"The ramparts run around three sides of the courtyard, all except the north side where the bulk of the citadel rises up. From here you can see the forest, giving way to bog, and then the ocean as you look westward; to the east, the moutains. That might be a chimney in the town you can just see over the trees to the south.",
      down:"citadel_barracks",
    },
  );

  createRoom("monster_store", 
    {
      loc:"outer_citadel",
    },
  );

  createItem("kobold", 
    NPC(false),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"monster_store",
    },
  );

  createItem("iron_dagger", 
    {
      loc:"monster_store",
      examine:"A simple iron dagger.",
    },
  );

  createItem("crude_spear", 
    {
      loc:"monster_store",
      examine:"This spear is a metal blade tied to a straightish branch, and then tarred to seal the rope.",
    },
  );

  createItem("kobold_shaman", 
    NPC(false),
    {
      loc:"monster_store",
    },
  );

  createItem("kobold_shaman_ice_blast", 
    {
      loc:"kobold_shaman",
    },
  );

  createItem("kobold_shaman_lightning", 
    {
      loc:"kobold_shaman",
    },
  );

  createItem("kobold_shaman_staff", 
    {
      loc:"kobold_shaman",
    },
  );

  createItem("kobold_champion", 
    NPC(false),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"monster_store",
    },
  );

  createRoom("citadel_second_gateway", 
    {
      loc:"outer_citadel",
      desc:"This second gate is rather more modest than the first, merely one and a half times your height, and wide eough for three men to walk abreast. To the south the balcony overlooking the first courtyard, to the north another courtyard.",
      north:"citadel_second_courtyard",
      south:"citadel_first_courtyard_upper",
    },
  );

  createRoom("citadel_second_courtyard", 
    {
      loc:"outer_citadel",
      desc:"The second courtyard is perhaps a little larger than the first. The great towers of the central citadel loom over you to the east, and a further gateway gives access. Another smaller gateway heads north. To the west, it looks like a chapel forms one side of the courtyard, and there are also doors northwest and northeast.",
      beforeEnter:function() {
      },
      afterEnter:function() {
        if (!w.this.flag && w.player.worldcursed) {
          msg ("As you emerge from the chapel, you realise the sky is w.orange. Is it sunset already?");
          w.this.flag = true
        }
      },
      south:"citadel_second_gateway",
      north:"citadel_menagerie",
      northeast:"citadel_quartermaster",
      southeast:"citadel_smithy",
      west:"citadel_chapel",
    },
  );

  createRoom("citadel_menagerie", 
    {
      loc:"outer_citadel",
      desc:"This small courtyard is a menagerie. Cages along three sides hold a variety of bizarre and, in most cases, unpleasant creatures. The only exit is back through the gateway to the south. A series of channels in the floor run from the cages to a grating in the centre of square.",
      south:"citadel_second_courtyard",
      down:"sewers_nexus",
    },
  );

  createItem("grating", 
    {
      loc:"citadel_menagerie",
      examine:"A metal grating, covering a hole in the ground.",
    },
  );

  createRoom("citadel_smithy", 
    {
      loc:"outer_citadel",
      northwest:"citadel_second_courtyard",
    },
  );

  createRoom("citadel_quartermaster", 
    {
      loc:"outer_citadel",
      southwest:"citadel_second_courtyard",
    },
  );

  createItem("quarterrmaster", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"citadel_quartermaster",
    },
  );

  createRoom("citadel_chapel", 
    {
      loc:"outer_citadel",
      desc:"This chapel is dedicated to the worship of the Sun Queen, and there are statues of her in various poses down the sides. Simple wooden benches offer seating for woshipers. To the south, is the apse, with the chapel alter, and to the north, the rear of the chapel. There is also a door to the west as well as the way back to the courtyard to east.",
      beforeEnter:function() {
        if (w.player.levelstatus === 1) {
          CancelSpell
          w.player.maxpoints = 15
          w.player.levelstatus = 2
          LevelUp
        }
      },
      west:"citadel_chapel_quarters",
      east:"citadel_second_courtyard",
      south:"citadel_chapel_apse",
      north:"citadel_chapel_rear",
    },
  );

  createRoom("citadel_chapel_apse", 
    {
      loc:"outer_citadel",
      desc:"The is a raised area at the front of the chapel, with an alter made of ornate bronze, and a pair of matching lecturns. The only way is back to the central area to the north.",
      north:"citadel_chapel",
    },
  );

  createRoom("citadel_chapel_quarters", 
    {
      loc:"outer_citadel",
      east:"citadel_chapel",
    },
  );

  createRoom("citadel_chapel_rear", 
    {
      loc:"outer_citadel",
      desc:"This area appears to be used for ritual magic. The floor has an ornate circle inscribed in it, and there are traces of blood near the centre. The main chapel is to the south, but there is a doorway, and stairs leading downwards to the west.",
      beforeEnter:function() {
        if (w.player.levelstatus === 2 && w.gem.loc === player) {
          CancelSpell
          w.player.maxpoints = 20
          w.player.levelstatus = 3
          LevelUp
        }
      },
      south:"citadel_chapel",
      down:"necropolis_entrance",
      west:"necropolis_entrance",
    },
  );

  createRoom("necropolis", 
    {
      loc:"",
    },
  );

  createRoom("necropolis_octagon", 
    {
      loc:"necropolis",
      desc:"This sizeable chamber is octagonal, with a high vaulted roof. Six of the eight corners have niches, with one or more ossuary jars. There are arched openings to north and east.",
      east:"necropolis_entrance",
      north:"necropolis_great_gallery_overlook",
    },
  );

  createItem("ghost", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"necropolis_octagon",
    },
  );

  createRoom("necropolis_great_gallery_overlook", 
    {
      loc:"necropolis",
      desc:function() {
        var s = "You are stood on a balcony overlooking an enormous chamber - the Great w.Vault. It is probably bigh enough to hold two sizeable houses, one on top of the other, you would w.guess.";
        s = s + " A wide ledge runs both ways round the vault, to chambers to northwest and northeast, and then beyond them to another chamber on the opposite side, and stairs lead down from there to the vault w.itself.";
        if (!GetBoolean(mummy, "dead")) {
          s = s + " Is something moving in the west chamber?";
        }
        if (!GetBoolean(zombie1, "dead")) {
          s = s + " You think you can see at least one thing moving in the east w.chamber.";
        }
        if (!GetBoolean(lich, "dead")) {
          s = s + " You can definitely see some kind of armour-wearing skeleton in the w.vault.";
        }
        s = s + " It would not be easy, but you might be able to climb down to the vault w.floor.";
        msg (s);
      },
      south:"necropolis_octagon",
      northwest:"necropolis_west",
      northeast:"necropolis_east",
    },
  );

  createItem("magpie_necropolis_scout", 
    TOPIC(true),
    {
      loc:"necropolis_great_gallery_overlook",
    },
  );

  createRoom("necropolis_west", 
    {
      loc:"necropolis",
      desc:"The ledge from the southeast curves on round to the northeast, but there is a chamber here, the walls of which are lined with stone shelves, crowded with ossuary jars.",
      northeast:"necropolis_hall_ancient_stone",
      southeast:"necropolis_great_gallery_overlook",
    },
  );

  createItem("mummy", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"necropolis_west",
    },
  );

  createRoom("necropolis_east", 
    {
      loc:"necropolis",
      desc:"The ledge from the southwest curves on round to the northwest, but there is a chamber here, the walls of which are lined with stone shelves, crowded with ossuary jars.",
      northwest:"necropolis_hall_ancient_stone",
      southwest:"necropolis_great_gallery_overlook",
    },
  );

  createItem("zombie1", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"necropolis_east",
    },
  );

  createItem("zombie2", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"necropolis_east",
    },
  );

  createRoom("necropolis_hall_ancient_stone", 
    {
      loc:"necropolis",
      desc:"The ledges running round the vault meet here. Again this chamber is filled with shelves of ossuary jars. Wide steps to the south lead down to the floor of the vault, while at the north end is a stone table. You can imagine this would have looked magnificent in days long gone, but no longer.",
      south:"necropolis_great_gallery",
      down:"necropolis_great_gallery",
      southwest:"necropolis_west",
      southeast:"necropolis_east",
    },
  );

  createItem("lich", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"necropolis_hall_ancient_stone",
    },
  );

  createRoom("necropolis_great_gallery", 
    {
      loc:"necropolis",
      desc:"You feel dwarfed by the size of the Great Vault, now you are stood in it.",
      afterFirstEnter:function() {
        msg ("'You come to steal my gem?' hisses the w.lich. 'Many have tried, all have w.failed. Some serve me still,' it waves a skeltal claw to the overlooking chamber to the w.east. 'Soon you will w.too.'");
      },
      north:"necropolis_hall_ancient_stone",
      up:"necropolis_hall_ancient_stone",
    },
  );

  createItem("stone_table", 
    CONTAINER(open),
    {
      loc:"necropolis_great_gallery",
      examine:"A large table, with six thick legs, all of white stone.",
    },
  );

  createItem("lich_spell_book", 
    {
      loc:"stone_table",
      examine:"A large book, bound in beige leather.",
    },
  );

  createItem("spell_teleport", 
    INSTANT_SPELL(),
    {
      loc:"lich_spell_book",
    },
  );

  createItem("spell_mark", 
    INSTANT_SPELL(),
    {
      loc:"lich_spell_book",
      desc:"You cast <i>Mark</i>, storing this location for further use.",
    },
  );

  createItem("curved_dagger", 
    WEAPON(),
    {
      loc:"stone_table",
      examine:"This silver dagger has a blade that curves one way, then the other. It looks fancy, but would not be great in battle; its purpose was probably ceremonial. Probably worth quite a bit, though.",
    },
  );

  createItem("gem", 
    {
      loc:"stone_table",
      examine:function(isMultiple) {
            var s = "The gem is about two inches across, cut with 22 facets, with a bluish hue that looks green from certain w.angles.";
            if (w.player.intelligence > 4) {
              s = s + " You can sense magic with in, lots of magic, but there is corruption w.too. Perhaps it has been in the possession of the lich too w.long.";
              w.this.corruptionnoted = true
            }
            else if (w.player.intelligence > 2) {
              s = s + " You can sense magic with w.in.";
            }
            msg (s);
          },
    },
  );

  createRoom("necropolis_entrance", 
    {
      loc:"necropolis",
      desc:"A large, rectangular room, with a vaulted roof, and a stone floor. Stone benches are fitted along the longer sides, north and south. Stairs to the east lead up to the chapel, while the main complex of the necropolis is west.",
      beforeFirstEnter:function() {
        msg ("As everyone knows, a necropolis is just somewhere to entomb the w.dead. Spooky, to be sure, but no reason to suppose there will be anything to worry about down here apart from the occasion w.rat.");
        w.game.necropolis_visited = true
      },
      beforeEnter:function() {
      },
      afterEnter:function() {
      },
      afterFirstEnter:function() {
        msg ("Traditionally the dead are dedicated to the air and the earth; a year exposed to the air in a death-tower, then the bones are collected in an ossuary jar, and placed in the w.necropolis. This room is where relatives of the deceased might sit and w.remember.");
      },
      up:"citadel_chapel_rear",
      east:"citadel_chapel_rear",
      west:"necropolis_octagon",
    },
  );

  createRoom("nighttime", 
    {
      loc:"",
    },
  );

  createItem("bugbear", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"nighttime",
    },
  );

  createItem("spider", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"nighttime",
    },
  );

  createItem("shambling_mound", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"nighttime",
    },
  );

  createItem("spectre", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"nighttime",
    },
  );

  createItem("centaur_corpse", 
    {
      loc:"nighttime",
      examine:"The centaur's corpse is half eaten, and buzzing with flies.",
    },
  );

  createRoom("inner_citadel", 
    {
      loc:"",
    },
  );

  createItem("fire_elemental", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"inner_citadel",
    },
  );

  createItem("slug", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"inner_citadel",
    },
  );

  createItem("imp", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"inner_citadel",
    },
  );

  createItem("lava_elemental", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"inner_citadel",
    },
  );

  createItem("lava_golem", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"inner_citadel",
    },
  );

  createItem("tentacled_horror", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"inner_citadel",
    },
  );

  createRoom("citadel_cellars", 
    {
      loc:"inner_citadel",
      down:"sewers_end",
      up:"lower_gallery",
    },
  );

  createItem("manhole_cover", 
    {
      loc:"citadel_cellars",
      examine:"A metal disk, covering a hole in the ground.",
    },
  );

  createRoom("throne_room", 
    {
      loc:"inner_citadel",
      desc:function() {
        if (w.this.revealed) {
          var s = "This is a large room, with a high w.ceiling. Two columns of bare pillars run down each side, and from the walls hang ancient w.tapestries. The door to the east leads to the throne room, and back to the west is the w.gallery.";
        }
        else {
          s = "This is a large room, with a high ceiling, ornately w.painted. Two columns of pillars, intricately carved, and inlaid with gilt, run down each side, and from the walls hang magnificent w.tapestries. The door to the east leads to the throne room, and back to the west is the w.gallery.";
        }
        if (w.sun_queen.loc === w.this.loc && !w.sun_queen.dead) {
          if (w.general_halidaar.loc === w.this.loc && !w.general_halidaar.dead) {
            s = s + " The Sun Queen is here, sat on the throne, talking to one of her w.generals.";
          }
          else {
            s = s + " The Sun Queen is here, sat on the w.throne.";
          }
        }
        else {
          if (w.general_halidaar.loc === w.this.loc && !w.general_halidaar.dead) {
            s = s + " One of the Sun Queen's generals is w.here.";
          }
        }
        if (w.bodyguard.loc === w.this.loc && !w.bodyguard.dead) {
          s = s + " A half-orc bodyguasrd stands beside the w.throne.";
        }
        msg (s);
      },
      west:"audience_chamber",
      north:"private_chambers",
    },
  );

  createItem("sun_queen", 
    NPC(true),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"throne_room",
    },
  );

  createItem("sun_queen_prophecy", 
    TOPIC(true),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_massacre", 
    TOPIC(true),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_red_sky", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_kobolds", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_kobolds_choose_evil", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_kobolds_inherently_evil", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_stole_throne", 
    TOPIC(true),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_might_is_right", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_might_does_not_make_right", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_divine_right", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_job", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_sage_defeated", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_sage_defeated_lie", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("sun_queen_illusion", 
    TOPIC(false),
    {
      loc:"sun_queen",
    },
  );

  createItem("ac_throne", 
    {
      loc:"throne_room",
      examine:function(isMultiple) {
          if (w.throne_room.revealed) {
            msg ("The throne is made of dark wood; the soft padding on the seat, arms and back is covered in dark w.leather.");
          }
          else {
            msg ("The throne is gold; animals are depicted in the legs and the high w.back.");
          }
        },
    },
  );

  createItem("general_halidaar", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"throne_room",
    },
  );

  createItem("general_kobolds", 
    TOPIC(true),
    {
      loc:"general_halidaar",
    },
  );

  createItem("general_sun_queen", 
    TOPIC(true),
    {
      loc:"general_halidaar",
    },
  );

  createItem("general_incident", 
    TOPIC(false),
    {
      loc:"general_halidaar",
    },
  );

  createItem("general_real_name", 
    TOPIC(true),
    {
      loc:"general_halidaar",
    },
  );

  createItem("weapon_falchion", 
    WEAPON(),
    {
      loc:"general_halidaar",
    },
  );

  createItem("bodyguard", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"throne_room",
      examine:function(isMultiple) {
          picture ("w.half_orc.png");
          msg ("The Queen's bodyguard is a half-w.orc.");
        },
    },
  );

  createItem("bodyguard_name", 
    TOPIC(true),
    {
      loc:"bodyguard",
    },
  );

  createItem("bodyguard_sun_queen", 
    TOPIC(false),
    {
      loc:"bodyguard",
    },
  );

  createItem("bodyguard_ruler", 
    TOPIC(false),
    {
      loc:"bodyguard",
    },
  );

  createItem("bodyguard_prophecy", 
    TOPIC(false),
    {
      loc:"bodyguard",
    },
  );

  createItem("minstrel", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"throne_room",
    },
  );

  createItem("lute", 
    {
      loc:"minstrel",
      examine:"When you planned to get a shed load of loot, this was not what you had in mind.",
    },
  );

  createRoom("audience_chamber", 
    {
      loc:"inner_citadel",
      desc:function() {
        if (w.this.revealed) {
          msg ("This is a large room, with a high w.ceiling. Two columns of bare pillars run down each side, and from the walls hang ancient w.tapestries. The door to the east leads to the throne room, and back to the west is the w.gallery.");
        }
        else {
          msg ("This is a large room, with a high ceiling, ornately w.painted. Two columns of pillars, intricately carved, and inlaid with gilt, run down each side, and from the walls hang magnificent w.tapestries. The door to the east leads to the throne room, and back to the west is the w.gallery.");
        }
      },
      east:"throne_room",
      west:"gallery_east",
    },
  );

  createItem("ac_pillars", 
    {
      loc:"audience_chamber",
      examine:function(isMultiple) {
          if (w.audience_chamber.revealed) {
            msg ("The pillars are made of cylindrical blocks of grey w.stone.");
          }
          else {
            msg ("The pillars are made of cylindrical blocks of obsidian, the surfaces intricately carved in geometric patterns, set off with gold w.leaf.");
          }
        },
    },
  );

  createItem("ac_tapestries", 
    {
      loc:"audience_chamber",
      examine:function(isMultiple) {
          if (w.audience_chamber.revealed) {
            msg ("The tapestries are so faded it is hard to make out what they w.depict.");
          }
          else {
            msg ("There are ten tapestries around the room, five on each of the long w.walls. Each is finely wrought in colourful thread, and all depict great battles involving wizards, armies and terrible w.beasts.");
          }
        },
    },
  );

  createItem("ac_ceiling", 
    {
      loc:"audience_chamber",
      examine:function(isMultiple) {
          if (w.audience_chamber.revealed) {
            msg ("The ceiling features a number of large wooden w.beams.");
          }
          else if (w.player.status === "Lore") {
            if (w.illusionist.lookedat) {
              msg ("The ceiling is fancifully painted with various gods from the Dubelan pantheon, floating on w.clouds. Kalini, the goddess of love, looks strangely like the w.wizard.");
            }
            else {
              msg ("The ceiling is fancifully painted with various gods from the Dubelan pantheon, floating on w.clouds.");
            }
            w.this.lookedat = true
          }
          else {
            if (w.illusionist.lookedat) {
              msg ("The ceiling is fancifully painted with various gods, floating on w.clouds. One of the goddesses looks strangely like the w.wizard.");
            }
            else {
              msg ("The ceiling is fancifully painted with various gods, floating on w.clouds.");
            }
            w.this.lookedat = true
          }
        },
    },
  );

  createItem("illusionist", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"audience_chamber",
    },
  );

  createItem("illusionist_illusion", 
    TOPIC(false),
    {
      loc:"illusionist",
    },
  );

  createItem("illusion", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"illusionist",
      examine:function(isMultiple) {
            picture ("w.fire_elemental.png");
            msg ("A nasty w.monster.");
          },
    },
  );

  createRoom("gallery_west", 
    {
      loc:"inner_citadel",
      east:"gallery_east",
      north:"stairs_junction",
    },
  );

  createRoom("gallery_east", 
    {
      loc:"inner_citadel",
      east:"audience_chamber",
      west:"gallery_west",
    },
  );

  createRoom("kitchens", 
    {
      loc:"inner_citadel",
      west:"lower_gallery",
    },
  );

  createItem("cook", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"kitchens",
    },
  );

  createRoom("stairs_junction", 
    {
      loc:"inner_citadel",
      desc:"This is a small chamber that connects the gallery to the south to a spiral staircase, running both up and down.",
      south:"gallery_west",
      down:"lower_gallery",
      up:"observatory",
    },
  );

  createRoom("observatory", 
    {
      loc:"inner_citadel",
      down:"stairs_junction",
    },
  );

  createItem("astrologer", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"observatory",
    },
  );

  createItem("astro_sun_queen", 
    TOPIC(true),
    {
      loc:"astrologer",
    },
  );

  createItem("astro_astrology", 
    TOPIC(true),
    {
      loc:"astrologer",
    },
  );

  createItem("astro_odd_eyes", 
    TOPIC(false),
    {
      loc:"astrologer",
    },
  );

  createItem("astro_citadel", 
    TOPIC(false),
    {
      loc:"astrologer",
    },
  );

  createItem("astro_food", 
    TOPIC(false),
    {
      loc:"astrologer",
    },
  );

  createRoom("lower_gallery", 
    {
      loc:"inner_citadel",
      up:"stairs_junction",
      east:"kitchens",
      down:"citadel_cellars",
    },
  );

  createRoom("dungeon", 
    {
      loc:"inner_citadel",
      desc:function() {
        msg ("The dungeons are dark, damp and malodorous; the very deepest part of the w.Citadel. The floor is covered in w.straw. The stone walls have numerousiron stubs set into them, from which chains w.hang.");
        if (w.prince_mandrin.loc === w.this.loc) {
          if (w.prince_mandrin.freed) {
            msg ("Prince Mandrin is here, keen to be w.away.");
          }
          else {
            msg ("A single prisoner is held in the w.chains. This must be the Prince, you w.realise.");
          }
        }
      },
      afterFirstEnter:function() {
        msg ("'Please don't hurt me,' begs Prince w.Mandrin. 'Wait you're w.not... Please, say you've come to rescue me!'");
      },
    },
  );

  createItem("prince_mandrin", 
    NPC(false),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"dungeon",
      examine:function(isMultiple) {
          msg ("Prince Mandrin looks to be around w.eighteen. He is a large man, to put it mildly; a little taller than yourself, but broad too, not to say w.fat. he has dark hair, and has not been shaved in at least a w.week. He is dressed in fine clothes; matching blue waistcoat and trousers with gold w.twist. However, they look rather dirty and w.crumpled. There is a haunted look to his w.eyes.");
        },
    },
  );

  createItem("prince_sun_queen", 
    TOPIC(true),
    {
      loc:"prince_mandrin",
    },
  );

  createItem("prince_army", 
    TOPIC(true),
    {
      loc:"prince_mandrin",
    },
  );

  createItem("prince_social_policies", 
    TOPIC(true),
    {
      loc:"prince_mandrin",
    },
  );

  createItem("prince_grandfather_mandrin", 
    TOPIC(false),
    {
      loc:"prince_mandrin",
    },
  );

  createRoom("private_chambers", 
    {
      loc:"inner_citadel",
      south:"throne_room",
    },
  );

  createRoom("nowhere", 
    {
      loc:"",
      desc:"Null",
    },
  );

  createItem("wyvern", 
    {
      loc:"nowhere",
      examine:"The wyvern circles overhead, keeping a careful watch. Its size is hard to judge, but must be comparable to a horse; its scales are black, except the belly, where they are bright white.",
    },
  );

  createItem("map", 
    {
      loc:"nowhere",
    },
  );

  createItem("plan", 
    {
      loc:"nowhere",
    },
  );

  createItem("hero_male", 
    NPC(false),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"nowhere",
      examine:function(isMultiple) {
      },
    },
  );

  createItem("hm_what_doing", 
    TOPIC(false),
    {
      loc:"hero_male",
    },
  );

  createItem("hero_female", 
    NPC(true),
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"nowhere",
    },
  );

  createItem("spell_clean", 
    INSTANT_SPELL(),
    {
      loc:"nowhere",
    },
  );

  createItem("spell_blue", 
    LASTING_SPELL(),
    {
      loc:"nowhere",
      desc:"Your skin turns a pale blue colour.",
    },
  );

  createItem("spell_cancel", 
    INSTANT_SPELL(),
    {
      loc:"nowhere",
    },
  );

  createItem("spell_green", 
    LASTING_SPELL(),
    {
      loc:"nowhere",
      desc:"Your skin turns a pale green colour.",
    },
  );

  createItem("spell_orange", 
    LASTING_SPELL(),
    {
      loc:"nowhere",
      desc:"Your skin turns a bright orange colour.",
    },
  );

  createItem("magpie", 
    MULTI_MONSTER(),
    MONSTER(),
    MONSTER_ATTACK(),
    {
      loc:"nowhere",
    },
  );

  createItem("magpie_why_follow", 
    TOPIC(true),
    {
      loc:"magpie",
    },
  );

  createItem("magpie_sage", 
    TOPIC(false),
    {
      loc:"magpie",
    },
  );

  createItem("magpie_dark", 
    TOPIC(false),
    {
      loc:"magpie",
    },
  );

  createItem("magpie_teleport", 
    TOPIC(false),
    {
      loc:"magpie",
    },
  );

  createItem("magpie_returning", 
    TOPIC(false),
    {
      loc:"magpie",
    },
  );

