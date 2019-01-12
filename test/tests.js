"use strict";

test.tests = function() {

  test.title("Simple object commands");
  test.assertCmd("i", "You are carrying a knife.");
  test.assertCmd("get coin", "You try to pick up the coin, but it just will not budge.");
  test.assertCmd("get straw boater", "Kyle has it.");
  test.assertCmd("get box", "You can't take it.");
  test.assertCmd("get knife", "You have it.");
  test.assertCmd("x tv", "It's just scenery.");
  test.assertCmd("get tv", "You can't take it.");
  test.assertCmd("give knife to boots", "Realistically, the boots are not interesting in anything you might give them.");

  test.title("Simple object commands (boots)");
  test.assertCmd("wear boots", "You don't have them.");
  test.assertCmd("remove boots", "You don't have them.");
  test.assertCmd("get boots", "You take the boots.");
  test.assertCmd("inv", "You are carrying a knife and some boots.");
  test.assertCmd("get boots", "You have them.");
  test.assertCmd("wear boots", "You put on the boots.");
  test.assertCmd("inventory", "You are carrying a knife and some boots (worn).");
  test.assertCmd("wear boots", "You're wearing them.");
  test.assertCmd("remove boots", "You take the boots off.");
  test.assertCmd("drop boots", "You drop the boots.");
  
  test.title("Simple object commands (book)");
  test.assertCmd("get the book", "You take the book.");
  test.assertCmd("read the book", "It is not in a language you understand.");
  test.assertCmd("drop book", "You drop the book.");
  
  test.assertCmd("s", "You can't go south.");
  test.assertCmd("d", "You can't go down.");

  test.title("Simple object commands (bricks)");
  test.assertCmd("get the bricks", "You take seven bricks.");
  test.assertCmd("drop 3 bricks", "You drop three bricks.");
  test.assertCmd("inv", "You are carrying a knife and four bricks.");
  test.assertCmd("drop 4 bricks", "You drop four bricks.");
  test.assertCmd("inv", "You are carrying a knife.");
  test.assertCmd("get 10 bricks", "You take seven bricks.");
  test.assertCmd("e", ["You head east.", "A clean room.", "You can see a trapdoor, a camera, a big kitchen table and a garage door here.", "You can go north or west.", "A fresh smell here!"]);
  test.assertCmd("put 2 bricks on to the table", "Done.");
  test.assertCmd("inv", "You are carrying a knife and five bricks.");
  test.assertCmd("look", ["A clean room.", "You can see a trapdoor, a camera, a big kitchen table (with two bricks on it) and a garage door here.", "You can go north or west."]);
  test.assertCmd("get the bricks", "You take two bricks.");
  test.assertCmd("w", ["You head west.", "A smelly room with an old settee and a tv.", "You can see a book, some boots, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), a cardboard box, a coin, a small key, a flashlight, Kyle (wearing a straw boater) and a garage key here.", "You can go up, west or east."]); 
  test.assertCmd("drop bricks", "You drop seven bricks.");  

  
  test.title("Wear/remove");
  
  test.assertCmd("u", ["You head up.", "A large room, with a big bed and a wardrobe.", "You can see underwear, some jeans, a shirt, a coat and a jumpsuit here.", "You can go down.",]);

  test.assertCmd("get all", ["Underwear: You take the underwear.", "Jeans: You take the jeans.", "Shirt: You take the shirt.", "Coat: You take the coat.", "Jumpsuit: You take the jumpsuit.", ]);
  test.assertCmd("wear underwear", "You put on the underwear.");
  test.assertCmd("wear jeans", "You put on the jeans.");
  test.assertCmd("wear shirt", "You put on the shirt.");
  test.assertCmd("remove underwear", "You can't take off your underwear whilst wearing your jeans.");
  test.assertCmd("remove jeans", "You take the jeans off.");
  test.assertCmd("remove underwear", "You take the underwear off.");
  test.assertCmd("wear jumpsuit", "You can't put a jumpsuit on over your shirt.");
  test.assertCmd("remove shirt", "You take the shirt off.");  
  test.assertCmd("wear jumpsuit", "You put on the jumpsuit.");
  test.assertCmd("wear coat", "You put on the coat.");
  test.assertCmd("wear underwear", "You can't put underwear on over your jumpsuit.");
  test.assertCmd("remove coat", "You take the coat off.");  
  test.assertCmd("drop all", ["Knife: You drop the knife.", "Underwear: You drop the underwear.", "Jeans: You drop the jeans.", "Shirt: You drop the shirt.", "Coat: You drop the coat.", "Jumpsuit: You're wearing it.", ]);
  test.assertCmd("remove jumpsuit", "You take the jumpsuit off.");  
  test.assertCmd("drop jumpsuit", "You drop the jumpsuit.");  
  test.assertCmd("get knife", "You take the knife.");  

  
  
  test.assertCmd("d", ["You head down.", "A smelly room with an old settee and a tv.", "You can see a book, some boots, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), a cardboard box, a coin, a small key, a flashlight, Kyle (wearing a straw boater), a garage key and seven bricks here.", "You can go up, west or east.",]);  
  
  test.title("NPC commands 1");
  
  test.assertCmd("w", ["You head west.", "An old-fashioned room.", "You can see a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Lara and a brick here.", "You can go up or east.",]);  
  
  test.assertCmd("lara,get brick", "'I'm not picking up any bricks,' says Lara indignantly.");
  test.assertCmd("lara,e", "'I'm not going east,' says Lara indignantly. 'I don't like that room.'");
  test.menuResponseNumber = 1;
  test.assertEqual(2, w.Lara.getTopics().length);
  test.assertCmd("speak to lara", "You tell Lara she looks very attractive. 'Why thank you!' she replies, smiling at last.");
  test.assertEqual(1, w.Lara.getTopics().length);
  test.assertCmd("lara,e", "Lara heads east.");
  
  test.assertCmd("e", ["You head east.", "A smelly room with an old settee and a tv.", "You can see a book, some boots, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), a cardboard box, a coin, a small key, a flashlight, Kyle (wearing a straw boater), Lara, a garage key and seven bricks here.", "You can go up, west or east.",]);
  test.assertCmd("lara,get boots", "Lara takes the boots.");
  test.assertCmd("lara,wear boots", "'I'm not doing that!' says Lara indignantly.");
  test.assertCmd("lara,drop boots", "Lara drops the boots.");
  test.assertCmd("lara,w", "Lara heads west.");
  
  
  
  test.title("NPC commands 2");
  test.assertCmd("boots,get coin", "You can tell the boots to do what you like, but there is no way they'll do it.");
  test.assertCmd("kyle,get coin", "He tries to pick up the coin, but it just will not budge.");
  test.assertCmd("kyle,get knife", "You have it.");
  test.assertCmd("kyle,get box", "Kyle can't take it.");
  test.assertCmd("kyle,get cover", "Kyle can't take it; it's part of the book.");

  test.title("NPC commands (boots)");
  test.assertCmd("kyle, wear boots", "He doesn't have them.");
  test.assertCmd("kyle, remove boots", "He doesn't have them.");
  test.assertCmd("kyle, get boots", "Kyle takes the boots.");
  test.assertCmd("kyle, get boots", "Kyle has them.");
  test.assertCmd("kyle,give boots to box", "Realistically, the cardboard box is not interesting in anything he might give it.");
  test.assertCmd("kyle, get boots", "Kyle has them.");
  test.assertCmd("kyle, wear boots", "Kyle puts on the boots.");
  test.assertCmd("kyle, wear boots", "He's wearing them.");
  test.assertCmd("kyle, remove boots", "Kyle takes the boots off.");
  test.assertCmd("kyle, put boots in box", "Done.");

  test.title("NPC commands (book)");
  test.assertCmd("tell kyle to get the book", "Kyle takes the book.");
  test.assertCmd("tell kyle to read the book", "It is not in a language he understands.");
  test.assertCmd("tell kyle to drop the book", "Kyle drops the book.");

  test.title("NPC commands (torch)");
  test.assertCmd("kyle, get torch", "Kyle takes the flashlight.");
  test.assertEqual(false, w.flashlight.switchedon);
  test.assertCmd("kyle, turn on the torch", "Kyle switches the flashlight on.");
  test.assertEqual(true, w.flashlight.switchedon);
  test.assertCmd("kyle, turn the torch off", "Kyle switches the flashlight off.");
  test.assertEqual(false, w.flashlight.switchedon);
  test.assertCmd("kyle, drop torch", "Kyle drops the flashlight.");

  test.title("NPC commands (go)");
  test.assertCmd("kyle, go ne", "Kyle can't go northeast.");
  test.assertCmd("kyle, go e", "Kyle heads east.");
  test.assertCmd("kyle, get torch", "You can't see anything you might call 'kyle'.");
  
  test.assertCmd("get torch", "You take the flashlight.");
  test.assertCmd("get garage", "You take the garage key.");
  
  test.assertCmd("e", ["You head east.", "A clean room.", "You can see a trapdoor, a camera, a big kitchen table, a garage door and Kyle (wearing a straw boater) here.", "You can go north or west."]);
  test.assertCmd("kyle,n", "Kyle tries the garage door, but it is locked.");
  
  test.assertCmd("kyle,get all", ["Trapdoor: Kyle can't take it.", "Camera: Kyle takes the camera.", "Big_kitchen_table: Kyle can't take it.", "Garage_door: Kyle can't take it."]);
  test.assertCmd("kyle, drop picture box", "Kyle drops the camera.");
  test.assertCmd("kyle, open trapdoor", "Kyle opens the trapdoor.");
  test.assertCmd("kyle, down", "You watch Kyle disappear through the trapdoor.");

  test.title("The charger");
  test.assertCmd("open garage", ["You unlock the garage door.", "You open the garage door."]);
  test.assertCmd("n", ["An empty garage.", /You can see/, "You can go south."]);
  test.assertCmd("x charger", "A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is closed.");
  test.assertCmd("push button", "You push the button, but nothing happens.");
  test.assertCmd("put torch in compartment", "The compartment is closed.");
  test.assertCmd("x compartment", "The compartment is just the right size for the torch. It is closed.");
  test.assertCmd("open compartment", "You open the compartment.");
  test.assertCmd("x charger", "A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is empty.");
  test.assertCmd("x compartment", "The compartment is just the right size for the torch. It is open.");
  test.assertCmd("put torch in compartment", "Done.");
  test.assertCmd("put key in compartment", "The compartment is full.");
  test.assertCmd("x charger", "A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment contains a flashlight.");
  test.assertCmd("push button", "You push the button, but nothing happens.");
  test.assertCmd("close compartment", "You close the compartment.");
  test.assertCmd("push button", "You push the button. There is a brief hum of power, and a flash.");
  test.assertCmd("get torch", "You can't see anything you might call 'torch'.");
  test.assertCmd("open compartment", "You open the compartment.");
  test.assertCmd("get torch", "You take the flashlight.");
  test.assertCmd("open compartment", "It already is.");
  test.assertCmd("put knife in compartment", "Done.");
  test.assertCmd("close compartment", "You close the compartment.");
  test.assertCmd("push button", "There is a loud bang, and the knife is destroyed.");
  test.assertCmd("open compartment", "You open the compartment.");
  test.assertCmd("x charger", "A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is empty.");
  

  test.title("Clone");
  var count = Object.keys(w).length;

  var clone = cloneObject(w.book);
  test.assertEqual(count + 1, Object.keys(w).length);
  test.assertEqual(w.book, clone.clonePrototype);
  test.assertEqual(w.book.examine, clone.examine);

  var clone2 = cloneObject(clone);
  test.assertEqual(count + 2, Object.keys(w).length);
  test.assertEqual(w.book, clone2.clonePrototype);
  test.assertEqual(w.book.examine, clone2.examine);

  
  test.title("Save/Load");
  // Set up some changes to be saved
  w.boots.counter = 17;
  w.boots.unusualString = "Some interesting text";
  w.boots.notableFlag = true;
  w.boots.examine = "This will not get saved";
  
  w.book.mutableExamine = true;
  w.book.examine = "This WILL get saved";
  
  clone.cloneCounter = 29;
  
  var s = saveLoad.saveTheWorld("Comment!!!");

  // Now change them again, these changes should get over-written
  w.boots.counter = 42;
  w.boots.unusualString = "Some boring text";
  w.boots.notableFlag = false;
  w.boots.examine = "This will remain";
  w.book.examine = "This will not remain";
  var clone3 = cloneObject(clone);  // should not be there later

  saveLoad.loadTheWorld(s);
  test.assertEqual(count + 2, Object.keys(w).length);
  test.assertEqual(17, w.boots.counter);
  test.assertEqual("Some interesting text", w.boots.unusualString);
  test.assertEqual(true, w.boots.notableFlag);
  test.assertEqual("This will remain", w.boots.examine);
  test.assertEqual("This WILL get saved", w.book.examine);
  
  test.assertEqual(29, w[clone.name].cloneCounter);
  
};