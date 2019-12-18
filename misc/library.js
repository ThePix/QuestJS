"use strict";


  createItem("injuries", 
    {
      loc:"",
    },
  );

  createItem("PotentialInjuries", 
    {
      loc:"",
      :"
      ",
    },
  );

  createItem("destroyed", 
    {
      loc:"PotentialInjuries",
      max:"2",
      follow:"head_only",
      healedmsg:"Light... Lucy could start to make out some shapes.",
      overrides:"spanking;flayed",
      health:function() {
        list add (list, "It was dark.");
      },
    },
  );

  createItem("head_only", 
    {
      loc:"PotentialInjuries",
      max:"4",
      follow:"no_arms;no_legs",
      healedmsg:"Lucy could move her head; she had a complete torso... but no limbs.",
      overrides:"spanking;flayed",
      health:function() {
        switch (this.state) {
          case (4) {
            list add (list, "Lucy had a head, but beyond that...");
          }
          case (3) {
            list add (list, "Lucy had a head, but beyond that... A faint tingling from her torso suggested something there.");
          }
          case (2) {
            list add (list, "Lucy had a head, and a severely mangled torso.");
          }
          case (1) {
            list add (list, "Lucy had a head, and a rather mangled torso.");
          }
        }
      },
    },
  );

  createItem("burnt_torso", 
    {
      loc:"PotentialInjuries",
      max:"8",
      healedmsg:"Lucy's torso was fully healed.",
      health:function() {
        switch ((this.state + 1) / 2) {
          case (4) {
            list add (list, "Lucy's torso was a twisted cinder of black flesh; how was she even breathing.");
          }
          case (3) {
            list add (list, "Lucy's torso was a charred lump of black flesh.");
          }
          case (2) {
            list add (list, "Lucy's torso was a mass of black blisters.");
          }
          case (1) {
            list add (list, "Lucy's torso was heavily burnt.");
          }
        }
      },
    },
  );

  createItem("burnt_head", 
    {
      loc:"PotentialInjuries",
      max:"6",
      healedmsg:"Lucy's head was fully healed.",
      health:function() {
        switch ((this.state + 1) / 2) {
          case (3) {
            list add (list, "Lucy's head was a charred lump.");
          }
          case (2) {
            list add (list, "Lucy's face was a mass of black blisters, her hair all gone.");
          }
          case (1) {
            list add (list, "Lucy's face was heavily burnt, much of her hair was gone.");
          }
        }
      },
    },
  );

  createItem("no_arms", 
    {
      loc:"PotentialInjuries",
      max:"4",
      healedmsg:"Lucy's arms were fully healed.",
      overrides:"burnt_hands",
      health:function() {
        switch (this.state) {
          case (4) {
            list add (list, "Lucy's arms were just stumps.");
          }
          case (3) {
            list add (list, "Lucy's arms ended at the elbow.");
          }
          case (2) {
            list add (list, "Lucy's arms ended at the wrist.");
          }
          case (1) {
            list add (list, "Lucy's arms ended with blobs instead of hands.");
          }
        }
      },
    },
  );

  createItem("burnt_hands", 
    {
      loc:"PotentialInjuries",
      max:"2",
      healedmsg:"Lucy's hands were fully healed.",
      health:function() {
        switch (this.state) {
          case (2) {
            list add (list, "Lucy's hands were blacked stumps.");
          }
          case (1) {
            list add (list, "Lucy's hands were heavily burnt.");
          }
        }
      },
    },
  );

  createItem("broken_hands", 
    {
      loc:"PotentialInjuries",
      max:"2",
      healedmsg:"Lucy's hands were fully healed.",
      health:function() {
        switch (this.state) {
          case (2) {
            list add (list, "Lucy's hands were a wreck of broken bones.");
          }
          case (1) {
            list add (list, "The broken bones in Lucy's hands were painful.");
          }
        }
      },
    },
  );

  createItem("no_legs", 
    {
      loc:"PotentialInjuries",
      max:"3",
      healedmsg:"Lucy's legs were fully healed.",
      overrides:"burnt_feet;mildly_hurt_feet",
      health:function() {
        switch (this.state) {
          case (4) {
            list add (list, "Lucy's legs were just stumps.");
          }
          case (3) {
            list add (list, "Lucy's legs ended at the knee.");
          }
          case (2) {
            list add (list, "Lucy's legs ended at the ankle.");
          }
          case (1) {
            list add (list, "Lucy's legs ended with blobs instead of feet.");
          }
        }
      },
    },
  );

  createItem("burnt_feet", 
    {
      loc:"PotentialInjuries",
      max:"2",
      follow:"mildly_hurt_feet",
      healedmsg:"They were not completely healed, but Lucy thought her feet were good enough to walk on.",
      overrides:"mildly_hurt_feet",
      health:function() {
        switch (this.state) {
          case (2) {
            list add (list, "Lucy's feet were burnt stumps.");
          }
          case (1) {
            list add (list, "Lucy's feet were badly burnt.");
          }
        }
      },
    },
  );

  createItem("mildly_hurt_feet", 
    {
      loc:"PotentialInjuries",
      max:"2",
      healedmsg:"Lucy's feet were fully healed.",
      health:function() {
        list add (list, "Lucy's feet were painful.");
      },
    },
  );

  createItem("spanking", 
    {
      loc:"PotentialInjuries",
      max:"10",
      healedmsg:"The bruising the spanking had now all healed.",
      health:function() {
        var s = StringListItem(Split("no;slight;noticeable;bad;severe;terrible;horrible", ";"), (this.state+1) / 2);
        list add (list, "She had some " + s + " bruising on her {random:ass:buttocks:backside}.");
      },
    },
  );

  createItem("brutal_fucking", 
    {
      loc:"PotentialInjuries",
      max:"3",
      healedmsg:"Her pussy no longer felt painfully stretched.",
      health:function() {
        var s = StringListItem(Split("no;somewhat;painfully;severely"), this.state + 1);
        list add (list, "Her pussy felt " + s + " over-stretched.");
      },
    },
  );

  createItem("flaying", 
    {
      loc:"PotentialInjuries",
      max:"16",
      healedmsg:"The whip marks on her back and ass had now all healed.",
      overrides:"spanking",
      health:function() {
        if (this.state > 6) {
          var s = StringListItem(Split("covered in whip marks;criss-crossed with cuts;a mess of cuts from the whip;dripping blood from the deep whip-slashes", ";"), (this.state-7) / 3);
          list add (list, "Her back and {random:ass:buttocks:backside} were " + s + ".");
        }
        else {
          s = StringListItem(Split("no;slight;noticeable;bad;severe;terrible", ";"), (this.state+1) / 2);
          list add (list, "She had some " + s + " whip marks on her back and {random:ass:buttocks:backside}.");
        }
      },
    },
  );

  createItem("stubbed_toe", 
    {
      loc:"PotentialInjuries",
      max:"2",
      health:function() {
        list add (list, "Her stubbed toe was throbbing.");
      },
    },
  );

  createRoom("flinders", 
    {
      loc:"",
    },
  );

  createItem("ash_flinders", 
    {
      loc:"flinders",
      pronouns:pronouns.plural,
      examine:"A pile of ashes that used to be ####.",
      takemsg:"Lucy wondered why she would want to pick up a load of ashes.",
    },
  );

  createItem("rust_flinders", 
    {
      loc:"flinders",
      pronouns:pronouns.plural,
      examine:"A pile of rusted metal that used to be ####.",
      takemsg:"Lucy wondered why she would want to pick up a useless load of rusted metal.",
    },
  );

  createItem("cloth_flinders", 
    {
      loc:"flinders",
      pronouns:pronouns.plural,
      examine:"A whole bunch of rags that used to be ####.",
      takemsg:"Lucy wondered why she would want to pick up a load of rags.",
    },
  );

  createItem("paper_flinders", 
    {
      loc:"flinders",
      pronouns:pronouns.plural,
      examine:"A whole bunch of torn up paper that used to be ####.",
      takemsg:"Lucy wondered why she would want to pick up a load of ripped up paper.",
    },
  );

  createItem("wood_flinders", 
    {
      loc:"flinders",
      pronouns:pronouns.plural,
      examine:"A whole bunch of splintered wood that used to be ####.",
      takemsg:"Lucy wondered why she would want to pick up a load of broken wood. {i:Think of the splinters!}",
    },
  );

  createItem("glass_flinders", 
    {
      loc:"flinders",
      pronouns:pronouns.plural,
      examine:"Some broken bits of glass that used to be ####.",
      takemsg:"Lucy wondered why she would want to pick up a load of broken glass.",
    },
  );

  createItem("ceramic_flinders", 
    {
      loc:"flinders",
      pronouns:pronouns.plural,
      examine:"Some broken bits of glass that used to be ####.",
      takemsg:"Lucy wondered why she would want to pick up a load of broken glass.",
    },
  );

