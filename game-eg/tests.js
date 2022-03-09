"use strict"

//test.printTitles = true
test.resetOnCompletion = false

test.tests = function() {
  
  test.title("parser.scoreObjectMatch");
  test.assertEqual(55, parser.scoreObjectMatch("me", w.Buddy, {}));
  test.assertEqual(-1, parser.scoreObjectMatch("me fkh", w.Buddy, {}));
  test.assertEqual(-1, parser.scoreObjectMatch("xme", w.Buddy, {}));
  
  test.assertEqual(60, parser.scoreObjectMatch("flashlight", w.flashlight, {}));
  test.assertEqual(16, parser.scoreObjectMatch("f", w.flashlight, {}));
  test.assertEqual(18, parser.scoreObjectMatch("fla", w.flashlight, {}));
  test.assertEqual(55, parser.scoreObjectMatch("torch", w.flashlight, {}));

  test.assertEqual(75, parser.scoreObjectMatch("torch", w.flashlight, {attName:'lightSource'}));
  test.assertEqual(55, parser.scoreObjectMatch("torch", w.flashlight, {attName:'silly'}));

  test.assertEqual(55, parser.scoreObjectMatch("torch", w.flashlight, {items:['glass_cabinet']}));
  test.assertEqual(100, parser.scoreObjectMatch("torch", w.flashlight, {items:['glass_cabinet', 'flashlight']}));
  
  test.assertEqual(60, parser.scoreObjectMatch("glass cabinet", w.glass_cabinet, {}));
  test.assertEqual(50, parser.scoreObjectMatch("glass", w.glass_cabinet, {}));
  test.assertEqual(50, parser.scoreObjectMatch("cabinet", w.glass_cabinet, {}));
  test.assertEqual(3, parser.scoreObjectMatch("cab", w.glass_cabinet, {}));
  
  
  test.title("Plurals")
  test.assertEqual('houses', lang.getPlural('house'))
  test.assertEqual('rays', lang.getPlural('ray'))
  test.assertEqual('ries', lang.getPlural('ry'))
  test.assertEqual('stadia', lang.getPlural('stadium'))
  test.assertEqual('tosses', lang.getPlural('toss'))
  test.assertEqual('potatoes', lang.getPlural('potato'))
  test.assertEqual('analyses', lang.getPlural('analysis'))
  
  
  
  
  test.title("parser.itemSetup")
  test.assertEqual(false, w.ham_and_cheese_sandwich.parserOptionsSet)
  parser.itemSetup(w.ham_and_cheese_sandwich)
  test.assertEqual(true, w.ham_and_cheese_sandwich.parserOptionsSet)
  test.assertEqual('ham and cheese sandwich', w.ham_and_cheese_sandwich.parserItemName)
  test.assertEqual(['egg', 'mayo'], w.ham_and_cheese_sandwich.synonyms)
  test.assertEqual(["ham", "ham and", "ham and cheese", "ham and sandwich", "ham cheese", "ham cheese sandwich", "ham sandwich", "and", "and cheese", "and cheese sandwich", "and sandwich", "cheese", "cheese sandwich", "sandwich"], w.ham_and_cheese_sandwich.parserItemNameParts)
  

  test.title("parser.findInList")
  test.assertEqual([], parser.findInList('book', [w.ham_and_cheese_sandwich, w.Buddy, w.glass_cabinet], {}))
  test.assertEqual([w.book], parser.findInList('book', [w.ham_and_cheese_sandwich, w.Buddy, w.book], {}))
  test.assertEqual([w.Buddy, w.book, w.boots], parser.findInList('b', [w.ham_and_cheese_sandwich, w.Buddy, w.book, w.boots], {}))
  test.assertEqual([w.book], parser.findInList('b', [w.ham_and_cheese_sandwich, w.Buddy, w.book], {attName:'read'}))

  test.title("parser.findInScope")
  let parserResult
  parserResult = parser.findInScope('book', [[w.ham_and_cheese_sandwich, w.Buddy, w.glass_cabinet]], {})
  test.assertEqual(0, parserResult[0].length)
  test.assertEqual(0, parserResult[1])
  parserResult = parser.findInScope('b', [[], [w.ham_and_cheese_sandwich, w.Buddy, w.book]], {attName:'read'})
  test.assertEqual(1, parserResult[0].length)
  test.assertEqual('book', parserResult[0][0].name)
  test.assertEqual(1, parserResult[1])
  parserResult = parser.findInScope('b', [[w.boots], [w.ham_and_cheese_sandwich, w.Buddy, w.book]], {attName:'read'})
  test.assertEqual(1, parserResult[0].length)
  test.assertEqual('boots', parserResult[0][0].name)
  test.assertEqual(2, parserResult[1])


  test.title("parser.findInScope with it")
  parser.pronouns = {it:w.book, him:w.Buddy}
  parserResult = parser.findInScope('it', [[w.boots], [w.ham_and_cheese_sandwich, w.Buddy, w.book]], {attName:'read'})
  test.assertEqual(1, parserResult[0].length)
  test.assertEqual('book', parserResult[0][0].name)
  test.assertEqual(1, parserResult[1])
  parserResult = parser.findInScope('him', [[w.boots], [w.ham_and_cheese_sandwich, w.Buddy, w.book]], {attName:'read'})
  test.assertEqual(1, parserResult[0].length)
  test.assertEqual('Buddy', parserResult[0][0].name)
  test.assertEqual(1, parserResult[1])
  
  
  test.title("parser.matchToName 1")
  let parserObjs = []
  parserResult = parser.matchToName('book', [[w.boots], [w.ham_and_cheese_sandwich, w.Buddy, w.book]], {attName:'read'}, parserObjs)
  test.assertEqual(1, parserResult)
  test.assertEqual(1, parserObjs.length)
  test.assertEqual([w.book], parserObjs[0])
  
  test.title("parser.matchToName 2")
  parserObjs = []
  parserResult = parser.matchToName('boo', [[w.boots], [w.ham_and_cheese_sandwich, w.Buddy, w.book]], {attName:'read'}, parserObjs)
  test.assertEqual(2, parserResult)
  test.assertEqual(1, parserObjs.length)
  test.assertEqual([w.boots], parserObjs[0])

  test.title("parser.matchToName 3")
  parserObjs = []
  parserResult = parser.matchToName('boo', [[], [w.boots, w.ham_and_cheese_sandwich, w.Buddy, w.book]], {}, parserObjs)
  test.assertEqual(1, parserResult)
  test.assertEqual(1, parserObjs.length)  // matched one word
  test.assertEqual(2, parserObjs[0].length)  // found two possible items
  test.assertEqual([w.boots, w.book], parserObjs[0])

  test.title("parser.matchToNames 1")
  parserResult = {objects:[], score:0}
  parser.matchToNames('boo', [[], [w.boots, w.ham_and_cheese_sandwich, w.Buddy, w.book]], {}, parserResult)
  test.assertEqual(1, parserResult.score)
  test.assertEqual([w.boots, w.book], parserResult.objects[0][0])

  test.title("parser.matchToNames 2")
  parserResult = {objects:[], score:0}
  parser.matchToNames('ham and cheese', [[], [w.boots, w.ham_and_cheese_sandwich, w.Buddy, w.book]], {multiple:true}, parserResult)
  test.assertEqual(1, parserResult.score)
  test.assertEqual([w.ham_and_cheese_sandwich], parserResult.objects[0][0])

  test.title("parser.matchToNames 3")
  parserResult = {objects:[], score:0}
  parser.matchToNames('book and coin', [[], [w.boots, w.ham_and_cheese_sandwich, w.Buddy, w.book, w.coin]], {multiple:true}, parserResult)
  test.assertEqual(1, parserResult.score)
  test.assertEqual([w.book], parserResult.objects[0][0])
  test.assertEqual([w.coin], parserResult.objects[0][1])
  
  test.title("parser.matchToNames 4")
  parserResult = {objects:[], score:0}
  parser.matchToNames('book and coin', [[], [w.boots, w.ham_and_cheese_sandwich, w.Buddy, w.book]], {multiple:true}, parserResult)
  test.assertEqual(parser.NO_OBJECT, parserResult.score)

  test.title("parser.matchToNames 5")
  parserResult = {objects:[], score:0}
  parser.matchToNames('book and coin', [[], [w.boots, w.ham_and_cheese_sandwich, w.Buddy, w.book, w.coin]], {}, parserResult)
  test.assertEqual(parser.DISALLOWED_MULTIPLE, parserResult.score)


  test.title("parser.matchToNames 5")
  parserResult = {objects:[], score:0}
  parser.matchToNames('ham and cheese', [[], [w.boots, w.ham_and_cheese_sandwich, w.Buddy, w.book]], {}, parserResult)
  test.assertEqual(1, parserResult.score)
  test.assertEqual([w.ham_and_cheese_sandwich], parserResult.objects[0][0])





  test.title("util.clamp")
  test.assertEqual(4, util.clamp(4, 0, 10))
  test.assertEqual(0, util.clamp(-4, 0, 10))
  test.assertEqual(10, util.clamp(14, 0, 10))
  test.assertEqual(0, util.clamp(0, 0, 10))
  test.assertEqual(10, util.clamp(10, 0, 10))
  
 
  
  
  test.title("sentenceCase");
  test.assertEqual("Simple text", sentenceCase("simple text"));
  
  test.title("titleCase");
  test.assertEqual("Simple Text", titleCase("simple text"));
  
  test.title("getName");
  test.assertEqual("book", lang.getName(w.book));
  test.assertEqual("the book", lang.getName(w.book, {article:DEFINITE}));
  test.assertEqual("A book", lang.getName(w.book, {article:INDEFINITE, capital:true}));
  w.book.owner = 'Buddy'
  test.assertEqual("your book", lang.getName(w.book, {article:DEFINITE}));
  test.assertEqual("Your book", lang.getName(w.book, {article:INDEFINITE, capital:true}));
  w.book.owner = 'Kyle'
  test.assertEqual("Kyle's book", lang.getName(w.book, {article:DEFINITE}));
  test.assertEqual("Kyle's book", lang.getName(w.book, {article:INDEFINITE, capital:true}));
  delete w.book.owner  
  
  test.assertEqual("you", lang.getName(w.Buddy));
  test.assertEqual("You", lang.getName(w.Buddy, {article:INDEFINITE, capital:true}));
  test.assertEqual("Five bricks", lang.getName(w.brick, {brick_count:5, capital:true, article:INDEFINITE}));
  test.assertEqual("a brick", lang.getName(w.brick, {brick_count:1, article:INDEFINITE}));
  test.assertEqual("seven bricks", lang.getName(w.brick, {loc:'lounge', article:INDEFINITE}));
  test.assertEqual("a lot of bricks", lang.getName(w.brick, {brick_count:'infinity', article:INDEFINITE}));

  
  test.title("random.fromArray");
  const ary = ["one", "two", "three"];
  let ary2 = [];
  for (let i = 0; i < 3; i++) {
    const res = random.fromArray(ary, true);
    if (ary2.includes(res)) test.fail("ary2 already has that value");
    ary2.push(res);
  }
  test.assertEqual(0, ary.length);
  
  test.title("random.int");
  for (let i = 0; i < 100; i++) {
    const res = random.int(10);
    test.assertEqual(true, res >= 0 && res <= 10);
  }
  
  test.title("random.chance");
  for (let i = 0; i < 100; i++) {
    test.assertEqual(true, random.chance(100));
    test.assertEqual(false, random.chance(0));
  }
  
  test.title("Random primed")
  random.prime(19)
  test.assertEqual(19, random.int())
  random.prime([3, 8])
  test.assertEqual(11, random.dice('2d6'))

  
  
  test.title("array.compare");
  test.assertEqual(false, array.compare([1, 2, 4, 6, 7], [1, 2, 3]));
  test.assertEqual(true, array.compare([1, 2, 4], [1, 2, 4]));
  test.assertEqual(false, array.compare([w.coin, w.boots, w.ring], [w.boots, w.ring]));
  test.assertEqual(true, array.compare([w.boots, w.ring], [w.boots, w.ring]));

  test.title("array.intersection");
  test.assertEqual([1, 2], array.intersection([1, 2, 4, 6, 7], [1, 2, 3]));
  test.assertEqual([1, 2], array.intersection([1, 2, 4, 6, 7], [3, 2, 1]));
  test.assertEqual([], array.intersection([], [1, 2, 3]));
  test.assertEqual([], array.intersection([1, 2, 4, 6, 7], []));
  test.assertEqual([w.boots, w.ring], array.intersection([w.coin, w.boots, w.ring], [w.boots, w.ring]));
  test.assertEqual([w.boots, w.ring], array.intersection([w.boots, w.ring], [w.boots, w.ring]));

  test.title("array.compareUnordered");
  test.assertEqual(false, array.compareUnordered([1, 2, 4, 6, 7], [1, 2, 3]));
  test.assertEqual(true, array.compareUnordered([1, 2, 4], [1, 2, 4]));
  test.assertEqual(true, array.compareUnordered([4, 1, 2], [1, 2, 4]));
  test.assertEqual(false, array.compareUnordered([4, 1, 2, 4], [1, 2, 4]));
  test.assertEqual(false, array.compareUnordered([w.coin, w.boots, w.ring], [w.boots, w.ring]));
  test.assertEqual(true, array.compareUnordered([w.boots, w.ring], [w.boots, w.ring]));
  test.assertEqual(true, array.compareUnordered([w.ring, w.boots], [w.boots, w.ring]));


  
  test.title("array.subtract");
  test.assertEqual([4, 6, 7], array.subtract([1, 2, 4, 6, 7], [1, 2, 3]));
  test.assertEqual(['4', '6', '7'], array.subtract(['1', '2', '4', '6', '7'], ['1', '2', '3']));
  test.assertEqual([w.coin, w.boots], array.subtract([w.coin, w.boots, w.ring], [w.ring]));
  
  const testAry = [w.boots, w.book, w.cardboard_box]

  test.title("array.next");
  test.assertEqual(w.cardboard_box, array.next(testAry, w.book));
  test.assertEqual(false, array.next(testAry, w.cardboard_box));
  test.assertEqual(w.boots, array.next(testAry, w.cardboard_box, true));


  test.title("array.nextFlagged");
  test.assertEqual(w.cardboard_box, array.nextFlagged(testAry, w.book, "container"));
  test.assertEqual(false, array.nextFlagged(testAry, w.book, "notcontainer"));
  test.assertEqual(false, array.nextFlagged(testAry, w.book, "wearable"));
  test.assertEqual(w.boots, array.nextFlagged(testAry, w.book, "wearable", true));
  test.assertEqual(false, array.nextFlagged(testAry, w.book, "notwearable", true));

  test.title("array.clone");
  const testAry2 = ['boots', 'book', 'cardboard_box', 'boots']
  test.assertEqual(['boots', 'book', 'cardboard_box', 'boots'], array.clone(testAry2));
  test.assertEqual(['boots', 'cardboard_box', 'book', 'boots'], array.clone(testAry2, {reverse:true}));
  test.assertEqual(['boots', 'book', 'cardboard_box'], array.clone(testAry2, {compress:true}));

  test.title("array.combos")
  test.assertEqual([], array.combos([]))
  test.assertEqual(['one'], array.combos(['one']))
  test.assertEqual(['one', 'one two', 'two'], array.combos(['one', 'two']))
  test.assertEqual([
    'boots','boots book','boots book cardboard_box','boots book shoes','boots cardboard_box','boots cardboard_box shoes','boots shoes',
    'book','book cardboard_box','book cardboard_box shoes','book shoes',
    'cardboard_box','cardboard_box shoes',
    'shoes'
  ], array.combos(['boots', 'book', 'cardboard_box', 'shoes']))


  test.title("util.getByInterval")
  const intervals = [2, 14, 4]
  test.assertEqual(0, util.getByInterval(intervals, 0))
  test.assertEqual(0, util.getByInterval(intervals, 1))
  test.assertEqual(1, util.getByInterval(intervals, 2))
  test.assertEqual(1, util.getByInterval(intervals, 15))
  test.assertEqual(2, util.getByInterval(intervals, 16))
  test.assertEqual(2, util.getByInterval(intervals, 19))
  test.assertEqual(false, util.getByInterval(intervals, 20))



  test.title("isUltimatelyHeldBy")
  test.assertEqual(true, w.ring.isUltimatelyHeldBy(w.jewellery_box))
  test.assertEqual(true, w.ring.isUltimatelyHeldBy(w.glass_cabinet))
  test.assertEqual(false, w.ring.isUltimatelyHeldBy(player))
  test.assertEqual(false, w.brick.isUltimatelyHeldBy(player))
  w.brick.countableLocs.Buddy = 3
  test.assertEqual(true, w.brick.isUltimatelyHeldBy(player))
  delete w.brick.countableLocs.Buddy


  test.title("exit.reverse")
  const ex1 = w.lounge.east
  const ex2 = w.lounge.up
  test.assertEqual('west', ex1.reverse())
  test.assertEqual('the east', ex1.nice())
  test.assertEqual('down', ex2.reverse())
  test.assertEqual('above', ex2.nice())


  test.title("formatList")
  test.assertEqual('', formatList([]))
  test.assertEqual('nothing', formatList([], {nothing:'nothing'}))
  test.assertEqual('one', formatList(['one']))
  test.assertEqual('one, two', formatList(['one', 'two']))
  test.assertEqual('one and two', formatList(['one', 'two'], {lastJoiner:'and'}))
  test.assertEqual('one, three, two', formatList(['one', 'two', 'three']))
  test.assertEqual('one, three and two', formatList(['one', 'two', 'three'], {lastJoiner:'and'}))
  settings.oxfordComma = true
  test.assertEqual('one', formatList(['one']))
  test.assertEqual('one and two', formatList(['one', 'two'], {lastJoiner:'and'}))
  test.assertEqual('one, three, and two', formatList(['one', 'two', 'three'], {lastJoiner:'and'}))
  settings.oxfordComma = false



  test.title("Text processor 1");
  test.assertEqual("Simple text", processText("Simple text"));
  test.assertEqual("Simple <i>text</i>", processText("Simple {i:text}"));
  test.assertEqual("Simple <span style=\"color:red\">text</span>.", processText("Simple {colour:red:text}."));
  test.assertEqual("Simple <span style=\"color:red\">text with <i>nesting</i></span>.", processText("Simple {colour:red:text with {i:nesting}}."));
  test.assertEqual("Simple text", processText("Simple {random:text}"));
  test.assertEqual("Simple text: no", processText("Simple text: {if:player:someOddAtt:yes:no}"));
  player.someOddAtt = 67;
  test.assertEqual("Simple text: 67", processText("Simple text: {show:player:someOddAtt}"));
  player.someOddAtt = 0;
  test.assertEqual("Simple text: 0", processText("Simple text: {show:player:someOddAtt}"));
  player.someOddAtt = undefined;
  test.assertEqual("Simple text: ", processText("Simple text: {show:player:someOddAtt}"));

  player.someOddAtt = 67;

  test.assertEqual("Simple text to show capitalisation.", processText("{cap:simple text to show capitalisation.}"));
  test.assertEqual("Simple Text To Show Capitalisation.", processText("{title:simple text to show capitalisation.}"));
  test.assertEqual("SIMPLE TEXT.", processText("{upper:Simple text.}"));
  test.assertEqual("simple text.", processText("{lower:Simple text.}"));


  test.title("Text processor 2");
  test.assertEqual("Simple text: no", processText("Simple text: {if:player:someOddAtt:50:yes:no}"));
  test.assertEqual("Simple text: yes", processText("Simple text: {if:player:someOddAtt:67:yes:no}"));
  test.assertEqual("Simple text: ", processText("Simple text: {if:player:someOddAtt:50:yes}"));
  test.assertEqual("Simple text: yes", processText("Simple text: {if:player:someOddAtt:67:yes}"));
  
  test.assertEqual("Simple text: yes", processText("Simple text: {ifMoreThan:player:someOddAtt:66:yes:no}"));
  test.assertEqual("Simple text: no", processText("Simple text: {ifMoreThan:player:someOddAtt:67:yes:no}"));
  test.assertEqual("Simple text: yes", processText("Simple text: {ifMoreThanOrEqual:player:someOddAtt:67:yes:no}"));
  test.assertEqual("Simple text: no", processText("Simple text: {ifMoreThanOrEqual:player:someOddAtt:68:yes:no}"));


  test.assertEqual("Simple text: no", processText("Simple text: {ifLessThan:player:someOddAtt:67:yes:no}"));
  test.assertEqual("Simple text: yes", processText("Simple text: {ifLessThan:player:someOddAtt:68:yes}"));
  test.assertEqual("Simple text: no", processText("Simple text: {ifLessThanOrEqual:player:someOddAtt:66:yes:no}"));
  test.assertEqual("Simple text: yes", processText("Simple text: {ifLessThanOrEqual:player:someOddAtt:67:yes}"));

  test.title("Text processor 2a");
  player.tpTest1 = function(params) { return lang.toWords(2 * params.val) }
  player.tpTest2 = function(params) { return 2 * params.val }
  player.tpTest3 = function(params) { return w.Lara }
  test.assertEqual("Simple text: sixteen", processText("Simple text: {show:player:tpTest1}", {val:8}))
  test.assertEqual("Simple text: yes", processText("Simple text: {if:player:tpTest2:16:yes:no}", {val:8}))
  test.assertEqual("Simple text: no", processText("Simple text: {if:player:tpTest2:15:yes:no}", {val:8}))
  test.assertEqual("Simple text: yes", processText("Simple text: {if:player:tpTest3:Lara:yes:no}", {val:8}))
  test.assertEqual("Simple text: no", processText("Simple text: {if:player:tpTest3:Kyle:yes:no}", {val:8}))

  settings.tpTest = 9
  test.assertEqual("Simple text: 9", processText("Simple text: {show:settings:tpTest}"))
  test.assertEqual("Simple text: nine", processText("Simple text: {number:settings:tpTest}"))
  test.assertEqual("Simple text: yes", processText("Simple text: {if:settings:tpTest:9:yes:no}", {val:8}))
  test.assertEqual("Simple text: no", processText("Simple text: {if:settings:tpTest:8:yes:no}", {val:8}))

  test.title("Text processor 2b show");
  test.assertEqual("Simple text: ", processText("Simple text: {show:item:att_does_not_exist}", {item:w.book}))
  // Test using a function
  w.book.tpStringTest = function() { return 'testy' }
  test.assertEqual("Simple text: testy", processText("Simple text: {show:item:tpStringTest}", {item:w.book}))
  // Test using params in function
  w.book.tpStringTest = function(options) { return 'testy=' + options.obj.name }
  test.assertEqual("Simple text: testy=Lara", processText("Simple text: {show:item:tpStringTest}", {item:w.book, obj:w.Lara}))
  // Test binding for this
  w.book.tpStringTest = function(options) { return 'testy=' + this.name }
  test.assertEqual("Simple text: testy=book", processText("Simple text: {show:item:tpStringTest}", {item:w.book}))
  player.someOddAtt = true;
  test.assertEqual("Simple text: true", processText("Simple text: {show:player:someOddAtt}"));


  test.title("Text processor 3");
  test.assertEqual("Simple text: yes", processText("Simple text: {if:player:someOddAtt:yes:no}"));
  test.assertEqual("Simple text: no", processText("Simple text: {ifNot:player:someOddAtt:yes:no}"));
  test.assertEqual("Simple text: seen first time only", processText("Simple text: {once:seen first time only}{notOnce:other times}"));

  const testObject = {someOddAtt:true, someOtherAttribute:5, falseAtt:false}
  test.assertEqual("Simple text: yes", processText("Simple text: {if:obj:someOddAtt:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: no", processText("Simple text: {if:obj:someUnknownAtt:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: yes", processText("Simple text: {if:obj:someOtherAttribute:5:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: no", processText("Simple text: {if:obj:someOtherAttribute:3:yes:no}", {obj:testObject}))

  test.assertEqual("Simple text: no", processText("Simple text: {ifIs:obj:someUnknownAtt:5:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: yes", processText("Simple text: {ifIs:obj:someOtherAttribute:5:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: no", processText("Simple text: {ifIs:obj:someOtherAttribute:3:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: no", processText("Simple text: {ifIs:obj:someOtherAttribute:true:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: yes", processText("Simple text: {ifIs:obj:someOddAtt:true:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: no", processText("Simple text: {ifIs:obj:someOddAtt:false:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: no", processText("Simple text: {ifIs:obj:someOddAtt:undefined:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: yes", processText("Simple text: {ifIs:obj:someOddThatDoesNotExistAtt:undefined:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: yes", processText("Simple text: {ifIs:obj:falseAtt:false:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: no", processText("Simple text: {ifIs:obj:falseAtt2:false:yes:no}", {obj:testObject}))

  test.assertEqual("Simple text: yes", processText("Simple text: {ifNotIs:obj:someOddAtt:undefined:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: no", processText("Simple text: {ifNotIs:obj:someOddThatDoesNotExistAtt:undefined:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: no", processText("Simple text: {ifNotIs:obj:falseAtt:false:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: yes", processText("Simple text: {ifNotIs:obj:falseAtt2:false:yes:no}", {obj:testObject}))

  test.assertEqual("Simple text: yes", processText("Simple text: {ifPlayer:Buddy:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: no", processText("Simple text: {ifPlayer:Lara:yes:no}", {obj:testObject}))
  test.assertEqual("Simple text: yes", processText("Simple text: {ifPlayer:obj:yes:no}", {obj:w.Buddy}))
  test.assertEqual("Simple text: no", processText("Simple text: {ifPlayer:obj:yes:no}", {obj:w.Lara}))




  test.title("Text processor 4");
  test.assertEqual("Simple text: other times", processText("Simple text: {once:seen first time only}{notOnce:other times}"));
  test.assertEqual("Simple text: other times", processText("Simple text: {once:seen first time only}{notOnce:other times}"));
  test.assertEqual("Simple text: p2=red", processText("Simple text: p2={show:p2}", {p1:"yellow", p2:"red"}))
  test.assertEqual("Simple text2: seen first time only", processText("Simple text2: {once:seen first time only:other times}"));
  test.assertEqual("Simple text2: other times", processText("Simple text2: {once:seen first time only:other times}"));



  test.title("Text processor 5: nm, nv, etc.");
  test.assertEqual("Kyle is a bear.", processText("{nv:chr:be} a bear.", {chr:'Kyle'}));
  test.assertEqual("Kyle is a bear.", processText("{nv:chr:be} a bear.", {chr:w.Kyle}));
  test.assertEqual("Kyle is your bear.", processText("{nv:Kyle:be} {pa:Buddy} bear."));
  test.assertEqual("Kyle is her bear.", processText("{nv:Kyle:be} {pa:Lara} bear."));
  test.assertEqual("There is Kyle.", processText("There is {nm:chr:a}.", {chr:w.Kyle}));
  test.assertEqual("There is a book.", processText("There is {nm:chr:a}.", {chr:w.book}));
  test.assertEqual("Kyle is here.", processText("{nm:chr:the:true} is here.", {chr:w.Kyle}));
  test.assertEqual("The book is here.", processText("{nm:chr:the:true} is here.", {chr:w.book}));
  test.assertEqual("It is your book.", processText("It is {nms:chr:the} book.", {chr:player}));
  test.assertEqual("It is Kyle's book.", processText("It is {nms:chr:the} book.", {chr:w.Kyle}));
  test.assertEqual("There are seven bricks.", processText("There are {nm:item:count}.", {item:w.brick, brick_count:7}));

  test.title("Text processor 5a: nm with COUNTABLE.");
  test.assertEqual("Five bricks", processText("{nm:item:count:true}", {item:w.brick, brick_count:5}))
  test.assertEqual("Five bricks", processText("{nm:item:a:true}", {item:w.brick, brick_count:5}))
  test.assertEqual("five bricks", processText("{nm:item:a}", {item:w.brick, item_count:5}))
  test.assertEqual("a brick", processText("{nm:item:a}", {item:w.brick, brick_count:1}))
  test.assertEqual("one brick", processText("{nm:item:count}", {item:w.brick, brick_count:1}))

  test.assertEqual("five bricks", processText("{nm:item:a}", {item:w.brick, count:5}))
  test.assertEqual("five bricks and one book", processText("{nm:item:a} and {nm:item2:count}", {item:w.brick, count:5, item2:w.book}))
  w.book.specialCount = 4
  test.assertEqual("five bricks and four books", processText("{nm:item:a} and {nm:item2:count:false:count_this}", {item:w.brick, count:5, item2:w.book, count_this:'specialCount'}))
  test.assertEqual("Lara looks at the four books thoughtfully.", processText("Lara looks at the {nm:item:false:false:count_this} thoughtfully.", {item:w.book, count_this:'specialCount'}))
  w.book.specialCount = 1
  test.assertEqual("Lara looks at the book thoughtfully.", processText("Lara looks at the {nm:item:false:false:count_this} thoughtfully.", {item:w.book, count_this:'specialCount'}))
  
  test.title("Text processor 5b: nm with COUNTABLE too.");
  w.book.getDisplayName = function(options) { return 'a ' + options.adj + ' tomb' }
  test.assertEqual("You see a mighty tomb", processText("You see {nm:item:a:false:adj}", {item:w.book, adj:'mighty'}))
  delete w.book.getDisplayName


  test.title("Text processor 6: show");
  test.assertEqual("Kyle is a bear.", processText("{Kyle.alias} is a bear."));
  test.assertEqual("Kyle is a bear.", processText("{show:Kyle:alias} is a bear."));
  test.assertEqual("Kyle is a bear.", processText("{Kyle:alias} is a bear."));
  test.assertEqual("You have $10.", processText("You have ${show:Buddy:money}."));
  test.assertEqual("You have $10.", processText("You have ${player.money}."));
  test.assertEqual("You have $10.", processText("You have ${Buddy.money}."));
  test.assertEqual("You have $10.", processText("You have ${player.money}."));

  test.title("Text processor 7: select");
  w.Kyle.colours = ['red', 'green', 'blue']
  w.Kyle.colour = 1
  test.assertEqual("Kyle is green.", processText("Kyle is {select:Kyle:colours:colour}."));
  test.assertEqual("Kyle is blue.", processText("Kyle is {select:Kyle:colour:green:blue:red}."));
  test.assertEqual("Kyle is blue.", processText("Kyle is {select:Kyle.colour:green:blue:red}."));
  w.Kyle.colour = 0
  test.assertEqual("Kyle is red.", processText("Kyle is {select:Kyle:colours:colour}."));
  test.assertEqual("Kyle is green.", processText("Kyle is {select:Kyle:colour:green:blue:red}."));
  w.Kyle.colour = 6
  test.assertEqual("Kyle is .", processText("Kyle is {select:Kyle:colours:colour}."));
  test.assertEqual("Kyle is .", processText("Kyle is {select:Kyle:colour:green:blue:red}."));
  w.Kyle.colour = 6
  test.assertEqual("Kyle is red.", processText("Kyle is {selectWrap:Kyle:colours:colour}."));
  test.assertEqual("Kyle is red.", processText("Kyle is {selectWrap:Kyle:colour:green:blue:red:yellow}."));
  w.Kyle.colour = 6
  test.assertEqual("Kyle is blue.", processText("Kyle is {selectEnd:Kyle:colours:colour}."));
  test.assertEqual("Kyle is red.", processText("Kyle is {selectEnd:Kyle:colour:green:blue:red}."));
  w.Kyle.colour = 0


  test.title("Text processor 8: dialogue");
  w.Kyle.dialogueStyle = 'color:magenta'
  test.assertEqual("Kyle says; <span style=\"color:magenta\">'Hello!'</span>", processText("Kyle says; {dialogue:char:Hello!}", {char:w.Kyle}))
  test.assertEqual("Kyle says; <span style=\"color:cyan\">'Hello!'</span>", processText("Kyle says; {dialogue::cyan:Hello!}"))
  test.assertEqual("Kyle says; <span style=\"text-decoration:underline;color:cyan\">'Hello!'</span>", processText("Kyle says; {dialogue:u:cyan:Hello!}"))
  test.assertEqual("Kyle says; <span style=\"font-style:italic;font-weight:bold;color:cyan\">'Hello!'</span>", processText("Kyle says; {dialogue:ib:cyan:Hello!}"))
  test.assertEqual("Kyle says; <span class=\"nonsense\">'Hello!'</span>", processText("Kyle says; {dialogue:.nonsense:Hello!}", {char:w.Kyle}))



  test.title("Text processor 9: rndalt");
  test.assertEqual("Kyle is here.", processText("{rndalt:Kyle} is here."));
  test.assertEqual("Kyle is here.", processText("{rndalt:npc} is here.", {npc:w.Kyle}));
  w.Kyle.alt = ['red', 'green', 'blue']
  random.prime(1)
  test.assertEqual("green is here.", processText("{rndalt:Kyle} is here."));



  test.title("Text processor 10: quest 5 style if")
  w.Kyle.flag = true
  test.assertEqual("Kyle is here. Lara is here.", processText("{if Kyle.flag:Kyle is here. }Lara is here."))
  test.assertEqual("Lara is here.", processText("{if not Kyle.flag:Kyle is not here. }Lara is here."))
  w.Kyle.flag = false
  test.assertEqual("Kyle is here. Lara is here.", processText("{if not Kyle.flag:Kyle is here. }Lara is here."))
  test.assertEqual("Lara is here.", processText("{if Kyle.flag:Kyle is not here. }Lara is here."))

  test.assertEqual("Kyle is here. Lara is here.", processText("{if Kyle.colour=0:Kyle is here. }Lara is here."))
  test.assertEqual("Kyle is here. Lara is here.", processText("{if Kyle.colour<>10:Kyle is here. }Lara is here."))
  test.assertEqual("Kyle is here. Lara is here.", processText("{if Kyle.colour !== 10:Kyle is here. }Lara is here."))
  test.assertEqual("Lara is here.", processText("{if Kyle.colour=10:Kyle is here. }Lara is here."))
  test.assertEqual("Lara is here.", processText("{if Kyle.colour != 0:Kyle is here. }Lara is here."))

  test.assertEqual("Kyle is here. Lara is here.", processText("{if Kyle.colour>=0:Kyle is here. }Lara is here."))
  test.assertEqual("Lara is here.", processText("{if Kyle.colour>=1:Kyle is here. }Lara is here."))
  test.assertEqual("Lara is here.", processText("{if Kyle.colour>0:Kyle is here. }Lara is here."))
  test.assertEqual("Kyle is here. Lara is here.", processText("{if Kyle.colour>-1:Kyle is here. }Lara is here."))


  test.title("Text processor 11: here");
  test.assertEqual("He is here. Lara is not.", processText("{ifHere:Kyle:He is here.} Lara is not."));
  test.assertEqual("He is here. Lara is not.", processText("{here Kyle:He is here.} Lara is not."));
  test.assertEqual(" Lara is not.", processText("{ifHere:Lara:He is here.} Lara is not."));
  test.assertEqual(" Lara is not.", processText("{here Lara:He is here.} Lara is not."));

  test.assertEqual("He is here. Lara is not.", processText("{ifNotHere:Lara:He is here.} Lara is not."));
  test.assertEqual("He is here. Lara is not.", processText("{nothere Lara:He is here.} Lara is not."));
  test.assertEqual(" Lara is not.", processText("{ifNotHere:Kyle:He is here.} Lara is not."));
  test.assertEqual(" Lara is not.", processText("{nothere Kyle:He is here.} Lara is not."));

  test.assertEqual("He is here. Lara is not.", processText("{ifHeld:knife:He is here.} Lara is not."));
  test.assertEqual(" Lara is not.", processText("{ifHeld:book:He is here.} Lara is not."));
  test.assertEqual("He is here. Lara is not.", processText("{ifNotHeld:book:He is here.} Lara is not."));
  test.assertEqual(" Lara is not.", processText("{ifNotHeld:knife:He is here.} Lara is not."));

  test.title("Text processor 12: pa2");
  test.assertEqual("'Please stop!' exclaims Kyle when you rip his book to shred.", processText("'Please stop!' exclaims {nm:chr1:the} when {nv:chr2:rip} {pa2:chr1:chr2} book to shred.", {chr1:w.Kyle, chr2:player}))
  test.assertEqual("'Please stop!' exclaims Kyle when Boris rips Kyle's book to shred.", processText("'Please stop!' exclaims {nm:chr1:the} when {nv:chr2:rip} {pa2:chr1:chr2} book to shred.", {chr1:w.Kyle, chr2:w.Boris}))
  test.assertEqual("'Please stop!' exclaims Kyle when Kyle rips his book to shred.", processText("'Please stop!' exclaims {nm:chr1:the} when {nv:chr2:rip} {pa2:chr1:chr2} book to shred.", {chr1:w.Kyle, chr2:w.Kyle}))


  test.title("Text processor 11: numbers");
  test.assertEqual("Lara is sixteen.", processText("Lara is {number:age}.", {age:16}))
  w.Lara.age = 17
  test.assertEqual("Lara is seventeen.", processText("Lara is {number:Lara:age}."))
  test.assertEqual("Lara is seventeen.", processText("Lara is {number:npc:age}.", {npc:w.Lara}))
  test.assertEqual("Lara is seventeenth.", processText("Lara is {ordinal:Lara:age}."))
  w.Buddy.age = 15
  test.assertEqual("Buddy is fifteen.", processText("Buddy is {number:player:age}."))
  
  test.title("Text processor 12: contents")
  test.assertEqual("You see nothing.", processText("You see {contents:cardboard_box:,:and:nothing}."))
  test.assertEqual("You see nothing.", processText("You see {contents:item:,:and:nothing}.", {item:w.cardboard_box}))
  test.assertEqual("You see nothing.", processText("You see {contents:item:,:and:nothing}.", {item:'cardboard_box'}))
  w.coin.loc = 'cardboard_box'
  w.small_key.loc = 'cardboard_box'
  w.canteen.loc = 'cardboard_box'
  test.assertEqual("You see a canteen, a coin and a small key.", processText("You see {contents:cardboard_box:,:and:nothing}."))
  test.assertEqual("You see a canteen - a coin - a small key.", processText("You see {contents:cardboard_box: -:-:nothing}."))
  w.coin.loc = 'lounge'
  w.small_key.loc = 'lounge'
  w.canteen.loc = 'lounge'


  test.title("Numbers");
  test.assertEqual("fourteen", lang.toWords(14));
  test.assertEqual("minus four hundred and three", lang.toWords(-403));
  test.assertEqual("ninety-seven", lang.toWords(97));
  test.assertEqual("fourteenth", lang.toOrdinal(14));
  test.assertEqual("four hundred and third", lang.toOrdinal(403));
  test.assertEqual("ninety-first", lang.toOrdinal(91));
  test.assertEqual("get 4 sticks", lang.convertNumbers("get four sticks"));
  test.assertEqual("get 14 sticks", lang.convertNumbers("get fourteen sticks"));
  test.assertEqual("get no sticks", lang.convertNumbers("get no sticks"));
  test.assertEqual("ninetieth", lang.toOrdinal(90));

  
  test.title("Numbers 2");
  test.assertEqual("(012,34)", displayNumber(1234, "(3,2)"));
  test.assertEqual("$1234", displayMoney(1234));
  test.assertEqual("$-1234", displayMoney(-1234));
  settings.moneyFormat = "!3.2! credits"
  test.assertEqual("012.34 credits", displayMoney(1234));
  test.assertEqual("-012.34 credits", displayMoney(-1234));
  settings.moneyFormat = "!+3.2! credits"
  test.assertEqual("+012.34 credits", displayMoney(1234));
  test.assertEqual("-012.34 credits", displayMoney(-1234));
  settings.moneyFormat = "!$1,2!($1,2)!"
  test.assertEqual("$12,34", displayMoney(1234));
  test.assertEqual("($12,34)", displayMoney(-1234));
  

  test.title("getDir");
  test.assertEqual("out", getDir("o"));
  test.assertEqual("down", getDir("dn"));
  test.assertEqual("out", getDir("exit"));
  test.assertEqual(false, getDir("bo"));
  
  
  test.title("date time")
  test.assertEqual("14 Feb 2019, 09:43", util.getDateTime())
  const dateTimeDict = util.getDateTimeDict()
  test.assertEqual("February", dateTimeDict.month)
  test.assertEqual(9, dateTimeDict.hour)
  test.assertEqual("It is 14 Feb 2019, 09:43", processText("It is {dateTime}"));
  test.assertEqual("-Two-Three-", processText("{hour:3:8:One}-{hour:5:10:Two}-{hour:9:10:Three}-{hour:10:99:Four}"));
  test.assertEqual(9, util.seconds(9))
  test.assertEqual(127, util.seconds(7, 2))
  test.assertEqual(127 + 3 * 3600, util.seconds(7, 2, 3))
  test.assertEqual(127 + 3 * 3600 + 2 * 24 * 3600, util.seconds(7, 2, 3, 2))

  test.assertEqual(true, util.isAfter('February 14, 2019 09:42:00'))
  test.assertEqual(false, util.isAfter('February 14, 2019 09:43:00'))
  test.assertEqual(false, util.isAfter('0943'))
  test.assertEqual(true, util.isAfter('0942'))


  test.title("msg function")
  test.assertOut(["Kyle is red."], function() {
    msg("Kyle is {select:Kyle:colours:colour}.")
  })
  test.assertOut(["Kyle is here.", "Lara is not"], function() {
    msg("Kyle is here.|Lara is not")
  })
  test.assertOut(["Kyle is here.|Lara is not"], function() {
    msg("Kyle is here.@@@vert@@@Lara is not")
  })
  



  test.title("msg function 2")
  test.fullOutputData = true
  let res
  res = test.function(function() { msg("Kyle is {select:Kyle:colours:colour}.") })
  test.assertEqual("default-p", res[0].cssClass)
  test.assertEqual("p", res[0].tag)
  test.assertEqual("Kyle is red.", res[0].text)
  
  res = test.function(function() { msg("#Kyle is {select:Kyle:colours:colour}.") })
  test.assertEqual("default-h default-h4", res[0].cssClass)
  test.assertEqual("h4", res[0].tag)
  test.assertEqual("Kyle is red.", res[0].text)

  res = test.function(function() { msg("#Kyle is {select:Kyle:colours:colour}.", {}, 'test') })
  test.assertEqual("test", res[0].cssClass)
  test.assertEqual("p", res[0].tag)
  test.assertEqual("#Kyle is red.", res[0].text)

  test.fullOutputData = false



  test.title("Change listeners")
  test.assertOut(["watchedStringAttribute changed from yellow to red"], function() {
    w.book.watchedStringAttribute = 'red'
    world.endTurn(world.FAILED)
  })
  test.assertOut([], function() {
    w.book.watchedNumberAttribute = 9
    world.endTurn(world.FAILED)
  })
  test.assertOut(["watchedNumberAttribute changed from 9 to 11"], function() {
    w.book.watchedNumberAttribute = 11
    world.endTurn(world.FAILED)
  })
  test.assertEqual("ChangeListenersUsedStrings=red~11", util.getChangeListenersSaveString())
  w.book.watchedNumberAttribute = 17
  w.book.watchedStringAttribute = 'cyan'
  util.setChangeListenersLoadString("ChangeListenersUsedStrings=cyan~17")
  test.assertEqual("cyan", util.changeListeners[0].oldValue)
  test.assertEqual(17, util.changeListeners[1].oldValue)
  



  test.title("tokenising")
  let res2 
  
  ary2 = ['ham', 'cheese']
  res2 = array.oneFromTokens(ary2, [w.book, w.boots, w.ham_and_cheese_sandwich, w.knife], {})
  test.assertEqual(0, ary2.length)
  test.assertEqual(w.ham_and_cheese_sandwich, res2[0])
  
  ary2 = ['ham', 'cheese', 'boots']
  res2 = array.oneFromTokens(ary2, [w.book, w.boots, w.ham_and_cheese_sandwich, w.knife], {})
  test.assertEqual(1, ary2.length)
  test.assertEqual(w.ham_and_cheese_sandwich, res2[0])

  ary2 = ['boots', 'ham', 'cheese']
  res2 = array.oneFromTokens(ary2, [w.book, w.boots, w.ham_and_cheese_sandwich, w.knife], {})
  test.assertEqual(2, ary2.length)
  test.assertEqual(w.boots, res2[0])

  ary2 = ['hat', 'boots', 'ham', 'cheese']
  res2 = array.oneFromTokens(ary2, [w.book, w.boots, w.ham_and_cheese_sandwich, w.knife], {})
  test.assertEqual(4, ary2.length)
  test.assertEqual(null, res2)

  test.title("tokenising 2")
  ary2 = ['ham', 'cheese']
  res2 = array.fromTokens(ary2, [w.book, w.boots, w.ham_and_cheese_sandwich, w.knife], {})
  test.assertEqual(1, res2.length)
  test.assertEqual('ham_and_cheese_sandwich', res2[0][0].name)

  ary2 = ['ham', 'cheese', 'boots']
  res2 = array.fromTokens(ary2, [w.book, w.boots, w.ham_and_cheese_sandwich, w.knife], {})
  test.assertEqual(2, res2.length)
  test.assertEqual('ham_and_cheese_sandwich', res2[0][0].name)
  test.assertEqual('boots', res2[1][0].name)

  ary2 = ['boots', 'ham', 'cheese']
  res2 = array.fromTokens(ary2, [w.book, w.boots, w.ham_and_cheese_sandwich, w.knife], {})
  test.assertEqual(2, res2.length)
  test.assertEqual('ham_and_cheese_sandwich', res2[1][0].name)
  test.assertEqual('boots', res2[0][0].name)





  test.title("errors")
  test.assertCmd("get sdjfghfg", "There doesn't seem to be anything you might call 'sdjfghfg' here.")
  test.assertCmd("map", "Sorry, no map available.")


  test.title("Look at scenery")
  test.assertCmd("look at settee", "It's just scenery.")
  test.assertCmd("x old settee", "It's just scenery.")
  test.assertCmd("examine couch", "It's just scenery.")
  test.assertCmd("look at tv", "It's just scenery.")
  test.assertCmd("look at rug", "It might have been blue at one time. Maybe.")
  



  test.title("Look inside")
  test.assertCmd("look inside cabinet", "Inside the glass cabinet you can see a jewellery box and an ornate doll.")
  w.jewellery_box.closed = false
  test.assertCmd("look inside cabinet", "Inside the glass cabinet you can see a jewellery box (containing a ring) and an ornate doll.")
  
  test.assertCmd("look inside box", "Inside the cardboard box you can see nothing.")
  test.assertCmd("look inside boots", "There's nothing to see inside.")
  test.assertCmd("look inside book", "The book has pages and pages of text, but you do not even recognise the alphabet.")

  test.assertCmd("smell", "You can't smell anything here.")
  test.assertCmd("listen", "You can't hear anything of note here.")
  test.assertCmd("smell knife", "The knife has no smell.")
  test.assertCmd("listen to knife", "The knife is not making any noise.")
  test.assertCmd("read knife", "Nothing worth reading there.")
  test.assertCmd("smash knife", "The knife is not something you can break.")
  test.assertCmd("look out knife", "Not something you can look out of.")
  test.assertCmd("switch on knife", "You can't turn it on.")
  test.assertCmd("switch off knife", "You can't turn it off.")
  test.assertCmd("exits", "You think you can go east, south, up or west.")
  
  test.title("Drop all")
  test.assertCmd("drop all", "You drop the knife.");
  test.assertCmd("drop all", "Nothing there to do that with.");
  test.assertCmd("get knife", "You take the knife.");


  
  test.title("Concatenated commands")
  test.assertCmd("drop knife, and then get it", ["You drop the knife.", "You take the knife."]);
  test.assertCmd("get book.read it.drop book", ["You take the book.", "It is not in a language you understand.", "Abandoning later commands: drop book"]);
  
  test.assertCmd("drop book.read it.drop book", ["You drop the book.", "You don't have it.", "You don't have it."]);
  test.assertCmd("*drop book.read it.drop book", ["Comment: drop book.read it.drop book"]);
  
  

  test.title("Simple object commands");
  test.assertCmd("i", "You are carrying a knife.");
  test.assertCmd("get coin", "You try to pick up the coin, but it just will not budge.");
  test.assertCmd("get straw boater", "Kyle has it.");
  test.assertCmd("get cabinet", "You can't take it.");
  test.assertCmd("get the cabinet", "You can't take it.");
  test.assertCmd("get a cabinet", "You can't take it.");
  test.assertCmd("get knife", "You've got it already.");
  test.assertCmd("x tv", "It's just scenery.");
  test.assertCmd("get tv", "You can't take it.");
  test.assertCmd("give knife to boots", "Realistically, the boots are not interested in anything you might give them.");


  test.title("Simple object commands (eat)");
  test.assertCmd("eat knife", "The knife is not something you can eat.");
  test.assertEqual(["Examine", "Take"], w.ham_and_cheese_sandwich.getVerbs())
  test.assertCmd("get sandwich", "You take the ham and cheese sandwich.");
  test.assertCmd("x sandwich", "It is just your typical, every day ham and cheese sandwich.")
  test.assertCmd("x sandwich", "It is just your typical, every day ham and cheese sandwich.")
  test.assertCmd("x ham and cheese sandwich", "It is just your typical, every day ham and cheese sandwich.")
  test.assertCmd("x sandwich and knife", [
    "It is just your typical, every day ham and cheese sandwich.",
    "A blunt knife.",
  ])
  test.assertCmd("x ham and cheese sandwich, knife", [
    "It is just your typical, every day ham and cheese sandwich.",
    "A blunt knife.",
  ])

  test.assertEqual(["Examine", "Drop", "Eat"], w.ham_and_cheese_sandwich.getVerbs())
  test.assertCmd("drink sandwich", "The ham and cheese sandwich is not something you can drink.");
  test.assertCmd("ingest sandwich", ["You eat the ham and cheese sandwich.", "That was great!"]);
  
  test.title("Simple object commands (drink the sandwich?)")
  w.ham_and_cheese_sandwich.loc = player.name
  w.ham_and_cheese_sandwich.isLiquid = true
  world.update()
  test.assertEqual(["Examine", "Drop", "Drink"], w.ham_and_cheese_sandwich.getVerbs())
  test.assertCmd("drink sandwich", ["You eat the ham and cheese sandwich.", "That was great!"]);


  
  test.title("Simple object commands (boots)");
  test.assertEqual(["Examine", "Take"], w.boots.getVerbs())
  test.assertCmd("wear boots", "You don't have them.");
  test.assertCmd("remove boots", "You don't have them.");
  test.assertCmd("get boots", "You take the boots.");
  test.assertEqual(["Examine", "Drop", "Wear"], w.boots.getVerbs())
  test.assertCmd("inv", "You are carrying some boots and a knife.");
  test.assertCmd("get boots", "You've got them already.");
  test.assertCmd("wear boots", "You put on the boots.");
  test.assertEqual(["Examine", "Remove"], w.boots.getVerbs())
  test.assertCmd("inventory", "You are carrying some boots (worn) and a knife.");
  test.assertCmd("wear boots", "You are already wearing them.");
  test.assertCmd("remove boots", "You take the boots off.");
  test.assertEqual(["Examine", "Drop", "Wear"], w.boots.getVerbs())
  test.assertCmd("drop boots", "You drop the boots.");
  test.assertEqual(["Examine", "Take"], w.boots.getVerbs())
  
  
  test.title("Simple object commands (book)");
  test.assertEqual(["Examine", "Take"], w.book.getVerbs())
  test.assertCmd("get the book", "You take the book.");
  test.assertEqual(["Examine", "Drop", "Read"], w.book.getVerbs())
  test.assertCmd("wear book", "You can't wear it.");
  test.assertCmd("remove book", "You are not wearing it.");
  test.assertCmd("read the book", "It is not in a language you understand.");
  test.assertCmd("give it to kyle", "'Oh!' says Kyle. 'Is this a book?'");
  
  test.assertCmd("kyle, read the book", "It is not in a language he understands.");
  test.assertCmd("kyle, drop book", "Kyle drops the book.");
  test.assertEqual(["Examine", "Take"], w.book.getVerbs())

  test.title("Simple object commands (container)");
  test.assertEqual(["Examine", "Open"], w.glass_cabinet.getVerbs())
  test.assertEqual(["Examine", "Take", "Close"], w.cardboard_box.getVerbs())
  test.assertCmd("open box", "It already is.");
  test.assertCmd("close box", "You close the cardboard box.");
  test.assertEqual(["Examine", "Take", "Open"], w.cardboard_box.getVerbs())
  test.assertCmd("close box", "It already is.");
  test.assertCmd("open box", "You open the cardboard box. It is empty.");
  test.assertEqual(["Examine", "Take", "Close"], w.cardboard_box.getVerbs())

  test.title("Simple object commands (bricks)");
  test.assertCmd("get the bricks", "You take seven bricks.");
  test.assertCmd("inv", "You are carrying seven bricks and a knife.");
  test.assertCmd("drop 3 bricks", "You drop three bricks.");
  test.assertCmd("inv", "You are carrying four bricks and a knife.");
  test.assertCmd("drop 4 bricks", "You drop four bricks.");
  test.assertCmd("inv", "You are carrying a knife.");
  test.assertCmd("get 10 bricks", "You take seven bricks, that is all there is.");
  test.assertCmd("e", ["You head east.", "The kitchen", "A clean room, a clock hanging on the wall. There is a sink in the corner.", "You can see a big kitchen table (with a jug on it), a camera and a trapdoor here.", "You can go north or west.", "A fresh smell here!"]);
  test.assertCmd("put 2 bricks on to the table", "Done.");
  test.assertCmd("inv", "You are carrying five bricks and a knife.");
  test.assertCmd("look", ["The kitchen", "A clean room, a clock hanging on the wall. There is a sink in the corner.", "You can see a big kitchen table (with two bricks and a jug on it), a camera and a trapdoor here.", "You can go north or west."]);
  test.assertCmd("get the bricks", "You take two bricks.");
  
  test.assertCmd("put 12 bricks on to the table", "Done.");
  test.assertCmd("look", ["The kitchen", "A clean room, a clock hanging on the wall. There is a sink in the corner.", "You can see a big kitchen table (with seven bricks and a jug on it), a camera and a trapdoor here.", "You can go north or west."]);
  test.assertCmd("drop 2 bricks", "You don't have any.");
  test.assertCmd("put 2 bricks on to the table", "You don't have any.");
  
  test.assertCmd("get 90 bricks", "You take seven bricks, that is all there is.");
  
  test.assertCmd("get clock", "You take the clock.");
  test.assertCmd("look", ["The kitchen", "A clean room. There is a sink in the corner.", "You can see a big kitchen table (with a jug on it), a camera and a trapdoor here.", "You can go north or west."]);
  test.assertCmd("drop clock", "You drop the clock.");
  test.assertCmd("look", ["The kitchen", "A clean room. There is a sink in the corner.", "You can see a big kitchen table (with a jug on it), a camera, a clock and a trapdoor here.", "You can go north or west."]);
  test.assertCmd("w", ["You head west.", "The lounge", "A smelly room with an old settee and a tv. There is a tatty rug on the floor.", "You can see a book, some boots, a canteen, a cardboard box, a coin, a flashlight, a garage key, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater) and a small key here.", "You can go east, south, up or west."]);
 

  test.title("Simple object commands (bricks and a box)");
  test.assertEqual(false, parser.isContained(w.brick));
  test.assertCmd("drop bricks in box", "Done.");
  test.assertEqual(true, parser.isContained(w.brick));
  
  test.assertCmd("get bricks", "You take seven bricks.");
  test.assertEqual(false, parser.isContained(w.brick));  
  test.assertCmd("drop three bricks in box", "Done.");
  test.assertEqual(true, parser.isContained(w.brick));
  test.assertCmd("drop bricks", "You drop four bricks.");
  test.assertEqual(true, parser.isContained(w.brick));
  test.assertCmd("get bricks", "You take four bricks.");
  test.assertEqual(true, parser.isContained(w.brick));
  test.assertCmd("get bricks", "You take three bricks.");
  test.assertEqual(false, parser.isContained(w.brick));
  
  
  test.title("Simple object commands (bricks and a held box)");
  test.assertCmd("get box", "You take the cardboard box.");
  test.assertCmd("drop bricks in box", "Done.");
  test.assertCmd("get bricks from box", "Done.");
  test.assertCmd("drop three bricks in box", "Done.");
  test.assertCmd("drop bricks", "You drop four bricks.");
  
  test.assertCmd("get bricks", "You take four bricks.");
  
  test.assertCmd("get bricks", "You take three bricks.");
  test.assertCmd("drop box", "You drop the cardboard box.");

  test.title("Simple object commands (cabinet and key)")
  test.assertCmd("open small key", "The small key can't be opened.")
  test.assertCmd("close small key", "The small key can't be closed.")
  test.assertCmd("unlock small key", "You can't unlock it.")
  test.assertCmd("lock small key", "You can't lock it.")
  
  
  

  test.assertCmd("open cabinet", "The glass cabinet is locked.")
  test.assertCmd("unlock cabinet", "You do not have the right key.")
  test.assertCmd("get small key", "You take the small key.")
  test.assertEqual(true, w.glass_cabinet.locked)
  test.assertEqual(true, w.glass_cabinet.closed)
  test.assertCmd("open cabinet", ["You unlock the glass cabinet.", "You open the glass cabinet. Inside it you can see a jewellery box (containing a ring) and an ornate doll."])
  test.assertEqual(false, w.glass_cabinet.locked)
  test.assertEqual(false, w.glass_cabinet.closed)
  test.assertCmd("open cabinet", "It already is.")
  test.assertCmd("unlock cabinet", "It already is.")
  test.assertCmd("lock cabinet", ["You close the glass cabinet and lock it."])
  test.assertCmd("unlock cabinet with key", "You unlock the glass cabinet.")
  test.assertCmd("lock cabinet with knife", "You lock the glass cabinet.")
  test.assertCmd("use key to unlock cabinet", "You unlock the glass cabinet.")
  test.assertCmd("put cabinet in small key", "The small key is not a container.")
  


  test.title("Simple object commands (cabinet and box)")
  test.assertCmd("open cabinet", ["You open the glass cabinet. Inside it you can see a jewellery box (containing a ring) and an ornate doll."])

  test.assertCmd("pick up cardboard box", "You take the cardboard box.")
  test.assertCmd("pick up jewellery box", "You take the jewellery box.")


  test.assertCmd("put cardboard box in jewellery box", "Done.")
  test.assertCmd("put jewellery box in cardboard box", "What? You want to put the jewellery box in the cardboard box when the cardboard box is already in the jewellery box? That's just too freaky for me.")
  test.assertCmd("take cardboard box box from jewellery box", "Done.")


  test.assertCmd("put jewellery box in cabinet", "Done.")
  test.assertCmd("close cabinet", "You close the glass cabinet.")
  test.assertCmd("lock cabinet", "You lock the glass cabinet.")
  test.assertCmd("drop small key", "You drop the small key.")
  test.assertCmd("drop box", "You drop the cardboard box.")


  test.title("Dynamic conversations")
  test.menuResponseNumber = 0
  test.assertCmd("talk to kyle", "You ask Kyle about the garden, but he's not talking.");
  test.menuResponseNumber = 0
  test.assertCmd("talk to kyle", "You ask Kyle about the garden, but he's STILL not talking.");
  test.menuResponseNumber = [0, 1]
  test.assertCmd("talk to kyle", ["You talk to Kyle about the weather; he asks your opinion...", 'You tell Kyle the weather is bad; he shakes his head sadly.']);
  

  test.title("Restricting");
  test.assertEqual(["Look at", "Talk to"], w.Kyle.getVerbs())
  player.testTalk = function() { msg("You are gagged."); return false; }
  test.assertCmd("talk to kyle", "You are gagged.");
  player.testTalk = function() { return true; }
  player.testManipulate = function() { msg("You are handcuffed."); return false; }
  test.assertCmd("drop bricks", "You are handcuffed.");
  player.testManipulate = function() { return true; }
  test.assertCmd("drop bricks", "You drop seven bricks.");  
  
  
  test.title("Wear/remove");
  test.assertCmd("u", ["You head up.", "The bedroom", "A large room, with a big bed and a wardrobe.", "You can see a coat, some jeans, a jumpsuit, a shirt, underwear and a wardrobe here.", "You can go down, in or west.",]);
  
  test.assertCmd("get all", ["Wardrobe: You can't take it.", "You take the underwear.", "You take the jeans.", "You take the shirt.", "You take the coat.", "You take the jumpsuit.", ]);
  test.assertCmd("wear underwear", "You put on the underwear.");
  test.assertCmd("wear jeans", "You put on the jeans.");
  test.assertCmd("wear shirt", "You put on the shirt.");
  test.assertCmd("remove underwear", "You can't take off your underwear whilst wearing your jeans.");
  test.assertCmd("remove jeans", "You take the jeans off.");
  test.assertCmd("remove underwear", "You take the underwear off.");
  test.assertCmd("wear jumpsuit", "You can't put the jumpsuit on over your shirt.");
  test.assertCmd("remove shirt", "You take the shirt off.");  
  test.assertCmd("wear jumpsuit", "You put on the jumpsuit.");
  test.assertCmd("wear coat", "You put on the coat.");
  test.assertCmd("wear underwear", "You can't put the underwear on over your jumpsuit.");
  test.assertCmd("remove coat", "You take the coat off.");  
  test.assertCmd("drop all", ["You drop the knife.", "You drop the underwear.", "You drop the jeans.", "You drop the shirt.", "You drop the coat.", "Jumpsuit: You are already wearing it.", ]);
  test.assertCmd("remove jumpsuit", "You take the jumpsuit off.");  
  test.assertCmd("get knife", "You take the knife.");
  
  test.title("Postures")
  test.assertCmd("lie on bed", "You lie down on the bed.")
  test.assertCmd("get off bed", "You get off the bed.")
  test.assertCmd("sit on bed", "You sit on the bed.")
  test.assertCmd("get off bed", "You get off the bed.")
  test.assertCmd("stand on bed", "The bed is not something you can stand on.")
  test.assertCmd("lie on wardrobe", "The wardrobe is not something you can lie on.")
  test.assertCmd("sit on wardrobe", "The wardrobe is not something you can sit on.")
  
  
  test.title("use")
  test.assertCmd("use jumpsuit", "You put on the jumpsuit.");
  test.assertCmd("use knife", "No obvious way to use it.");
  w.knife.use = function(options) { msg("You juggle the knife.") }
  test.assertCmd("use knife", "You juggle the knife.");
  test.assertCmd("remove jumpsuit", "You take the jumpsuit off.");  
  test.assertCmd("drop jumpsuit", "You drop the jumpsuit.");  

  test.assertEqual(["Examine", "Sit on", "Lie on"], w.bed.getVerbs())
  test.assertCmd("use bed", "You lie down on the bed.");
  test.assertEqual(["Examine", "Get off"], w.bed.getVerbs())
  test.assertCmd("use bed", "You already are.");
  test.assertCmd("stand", "You get off the bed.");
  test.assertEqual(["Examine", "Sit on", "Lie on"], w.bed.getVerbs())
  test.assertCmd("use bed", "You lie down on the bed.");
  test.assertCmd("d", ["You get off the bed.", "You head down.", "The lounge", "A smelly room with an old settee and a tv. There is a tatty rug on the floor.", "You can see a book, some boots, seven bricks, a canteen, a cardboard box, a coin, a flashlight, a garage key, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater) and a small key here.", "You can go east, south, up or west.",]);  

  
  test.title("say");
  test.assertCmd("say hello", ["You say, 'Hello.'", "No one seems interested in what you say."]);
  w.Kyle.loc = "dining_room"
  test.assertCmd("w", ["You head west.", "The dining room", "An old-fashioned room.", "You can see a brick, a chair, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater) and Lara here.", "You can go east, up or west.",]);
  test.assertCmd("say hello", ["You say, 'Hello.'", "'Oh, hello there,' replies Lara.", "'Have you two met before?' asks Kyle."]);
  test.assertCmd("say nothing", ["You say, 'Nothing.'", "'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'"]);
  test.assertCmd("say nothing", ["You say, 'Nothing.'", "'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'"]);
  test.assertCmd("say nothing", ["You say, 'Nothing.'", "'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'"]);
  test.assertCmd("say yes", ["You say, 'Yes.'", "'Oh, cool,' says Kyle."]);
  test.assertCmd("say hello", ["You say, 'Hello.'", "No one seems interested in what you say."]);


  test.title("ask");
  test.assertCmd("ask kyle about hats", ["You ask Kyle about hats.", "Kyle has no interest in that subject."]);
  test.assertCmd("ask kyle about garden", ["You ask Kyle about garden.", "'Needs some work,' Kyle says with a sign."]);
  test.assertCmd("ask kyle about garden", ["You ask Kyle about garden.", "'I'm giving up hope of it ever getting sorted,' Kyle says."]);
  test.assertCmd("ask kyle about garden", ["You ask Kyle about garden.", "'I'm giving up hope of it ever getting sorted,' Kyle says."]);
  w.garden.fixed = true
  test.assertCmd("ask kyle about garden", ["You ask Kyle about garden.", "'Looks much better now,' Kyle says with a grin."]);
  test.assertCmd("topics", [/^Use TOPICS FOR/])
  test.assertCmd("topics kyle", ["Some suggestions for what to ask Kyle about: Garden; House; Park."])
  w.Kyle.specialFlag = true
  test.assertCmd("topics kyle", ["Some suggestions for what to ask Kyle about: Fountain; Garden; House; Park."])
  test.assertCmd("ask kyle about park", ["You ask Kyle about park.", "'Going to the park sounds like fun,' Kyle says with a grin. 'We can go on the swings!'"]);
  test.assertCmd("topics kyle", ["Some suggestions for what to ask Kyle about: Fountain; Garden; House; Park; Swings."])

  test.assertCmd("ask chair about hats", 'You can ask it about hats all you like, but it is not about to reply.')
  test.assertCmd("talk to chair", 'You chat to the chair for a few moments, before releasing that it is not about to reply.')


  
  w.Kyle.loc = "lounge"

  
  test.title("NPC topics");
  test.assertError(/Trying to find topic/, function() {w.Lara.findTopic("What's the deal with the garden?")})
  test.assertEqual(1, w.Kyle.findTopic("What's the deal with the garden?").nowShow.length)
  
  
  
  test.title("NPC commands 1");
  test.assertCmd("lara,get brick", "'I'm not picking up any bricks,' says Lara indignantly.");
  test.assertCmd("lara,e", "'I'm not going east,' says Lara indignantly. 'I don't like that room.'");
  test.menuResponseNumber = 1;
  test.assertEqual(3, w.Lara.getTopics().length);
  test.assertCmd("speak to lara", ["'Hello,' says Lara.", "You tell Lara she looks very attractive. 'Why thank you!' she replies, smiling at last."]);
  test.assertEqual(2, w.Lara.getTopics().length);
  test.assertCmd("lara,sit on chair", ["Lara sits on the chair.", "The chair makes a strange noise when Lara sits on it."]);
  test.assertCmd("lara,stand up", "Lara gets off the chair.");
  test.assertCmd("lara,sit on chair", ["Lara sits on the chair.", "The chair makes a strange noise when Lara sits on it."]);
  
  test.assertCmd("l", ["The dining room", "An old-fashioned room.", "You can see a brick, a chair, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll) and Lara (sitting on the chair) here.", "You can go east, up or west.",]);  
  
  test.title("NPC commands 1.1");
  w.Lara.testPosture = function() { msg("She is turned to stone."); return false; }
  test.assertCmd("lara, get off chair", "She is turned to stone.");
  w.Lara.testPosture = function() { return true; }
  test.assertCmd("lara, get off chair", "Lara gets off the chair.");
  test.assertCmd("lara,sit on chair", ["Lara sits on the chair.", "The chair makes a strange noise when Lara sits on it."]);
  
  
  test.assertCmd("lara,e", ["Lara gets off the chair.", "Lara leaves the dining room, heading east."]);
  test.assertCmd("e", ["You head east.", "The lounge", "A smelly room with an old settee and a tv. There is a tatty rug on the floor.", "You can see a book, some boots, seven bricks, a canteen, a cardboard box, a coin, a flashlight, a garage key, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater), Lara and a small key here.", "You can go east, south, up or west.",]);
  test.assertCmd("lara,get boots", "Lara takes the boots.");
  test.assertCmd("lara,wear boots", "'I'm not doing that!' says Lara indignantly.");
  
  test.assertCmd("lara,drop boots", "Lara drops the boots.");
  test.assertCmd("lara,w", "Lara leaves the lounge, heading west.");
  
  
  test.title("NPC commands 2");
  test.assertCmd("boots,get coin", "You can tell the boots to do anything you like, but there is no way they'll do it.");
  test.assertCmd("kyle,get coin", "He tries to pick up the coin, but it just will not budge.");
  test.assertCmd("kyle,get knife", "You have it.");
  test.assertCmd("kyle,get cabinet", "He can't take it.");
  test.assertCmd("kyle,get cover", "He can't take it; it is part of the book.");


  test.title("NPC commands (boots)");
  test.assertCmd("kyle, wear boots", "He doesn't have them.");
  test.assertCmd("kyle, remove boots", "He doesn't have them.");
  test.assertCmd("kyle, get boots", "Kyle takes the boots.");
  test.assertCmd("kyle, get boots", "He's got them already.");
  test.assertCmd("kyle,give boots to box", "Realistically, the cardboard box is not interested in anything he might give it.")
  test.assertCmd("kyle, wear boots", "Kyle puts on the boots.");
  test.assertCmd("kyle, wear boots", "Kyle is already wearing them.");
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
  test.assertCmd("kyle, go e", "Kyle leaves the lounge, heading east.");
  test.assertCmd("kyle, get torch", "There doesn't seem to be anything you might call 'kyle' here.")
  
  test.assertCmd("get torch", "You take the flashlight.");
  test.assertCmd("get garage", "You take the garage key.");
  test.assertCmd("e", ["You head east.", "The kitchen", "A clean room. There is a sink in the corner.", "You can see a big kitchen table (with a jug on it), a camera, a clock, Kyle (wearing a straw boater) and a trapdoor here.", "You can go north or west."]);
  test.assertCmd("kyle,n", "Kyle tries the door to the garage, but it is locked.");
  test.assertCmd("kyle,get all", ["Kyle takes the clock.", "Trapdoor: He can't take it.", "Kyle takes the camera.", "Big kitchen table: He can't take it.", "Kyle takes the jug."]);
 
  
  
  test.assertCmd("kyle, drop picture box", "Kyle drops the camera.");
  test.assertCmd("kyle, open trapdoor", "Kyle opens the trapdoor.");
  test.assertCmd("kyle, down", "Kyle disappears through the trapdoor.");


  test.title("The charger");
  test.assertCmd("open garage", ["You unlock the garage door.", "You open the garage door."]);
  test.assertCmd("n", ["The garage", "An empty garage.", /You can see/, "You can go south."]);
  
  test.assertCmd("x charger", "A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is closed.");
  test.assertCmd("push button", "You push the button, but nothing happens.");
  test.assertCmd("put torch in compartment", "The compartment is closed.");
  
  
  test.assertCmd("x compartment", "The compartment is just the right size for the torch. It is closed.");
  test.assertCmd("open compartment", "You open the compartment. It is empty.");
  test.assertCmd("x charger", "A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is empty.");
  test.assertCmd("x compartment", "The compartment is just the right size for the torch. It is open.");
  test.assertCmd("put torch in compartment", "Done.");
  test.assertCmd("put key in compartment", "The compartment is full.");
  test.assertCmd("x charger", "A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment contains a flashlight.");
  
  test.assertCmd("push button", "You push the button, but nothing happens.");
  test.assertCmd("close compartment", "You close the compartment.");
  test.assertCmd("push button", "You push the button. There is a brief hum of power, and a flash.");
  test.assertCmd("get torch", "There doesn't seem to be anything you might call 'torch' here.");
  test.assertCmd("open compartment", "You open the compartment. Inside it you can see a flashlight.");
  
  test.assertCmd("get torch", "You take the flashlight.");
  test.assertCmd("open compartment", "It already is.");
  test.assertCmd("put knife in compartment", "Done.");
  test.assertCmd("close compartment", "You close the compartment.");
  test.assertCmd("push button", "There is a loud bang, and the knife is destroyed.");
  test.assertCmd("open compartment", "You open the compartment. It is empty.");
  
  test.assertCmd("x charger", "A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is empty.")
  

  test.title("Clone");
  const count = Object.keys(w).length;
  const clone = cloneObject(w.book);
  test.assertEqual(count + 1, Object.keys(w).length);
  test.assertEqual(w.book, clone.clonePrototype);
  test.assertEqual(w.book.examine, clone.examine);
  test.assertEqual(["Examine", "Take"], clone.getVerbs())
  clone.loc = player.name
  test.assertEqual(["Examine", "Drop", "Read"], clone.getVerbs())
  clone.loc = 'lounge'
  const clone2 = cloneObject(clone);
  test.assertEqual(count + 2, Object.keys(w).length);
  test.assertEqual(w.book, clone2.clonePrototype);
  test.assertEqual(w.book.examine, clone2.examine);

  
  test.title("Save/Load 0");

  const sl1 = "Some long string, with ~ all | sorts {} of! = stuff. In it^&*\""
  test.assertEqual(sl1, saveLoad.decodeString(saveLoad.encodeString(sl1)))
  const sl2 = ["Some long string, ", "with ~ all | sorts {} of! = stuff.", " In it^&*\""]
  const sl3 = saveLoad.decodeArray(saveLoad.encodeArray(sl2))
  test.assertEqual(sl2[0], sl3[0])
  test.assertEqual(sl2[1], sl3[1])
  test.assertEqual(sl2[2], sl3[2])

  test.assertEqual("tst:number:14;", saveLoad.encode("tst", 14))
  test.assertEqual("tst:boolean:false;", saveLoad.encode("tst", false))
  test.assertEqual("tst:boolean:true;", saveLoad.encode("tst", true))
  test.assertEqual("tst:string:14;", saveLoad.encode("tst", '14'))
  test.assertEqual("tst:qobject:book;", saveLoad.encode("tst", w.book))
  test.assertEqual("tst:array:14~12;", saveLoad.encode("tst", ['14', '12']))
  test.assertEqual("tst:numberarray:14~12;", saveLoad.encode("tst", [14, 12]))
  test.assertEqual("tst:emptyarray;", saveLoad.encode("tst", []))
  test.assertEqual("tst:emptystring;", saveLoad.encode("tst", ''))

  saveLoad.decode(w.far_away, "one:number:14")
  test.assertEqual(14, w.far_away.one)
  saveLoad.decode(w.far_away, "two:string:14")
  test.assertEqual('14', w.far_away.two)
  saveLoad.decode(w.far_away, "three:boolean:true")
  test.assertEqual(true, w.far_away.three)
  saveLoad.decode(w.far_away, "four:qobject:book")
  test.assertEqual(w.book, w.far_away.four)
  saveLoad.decode(w.far_away, "five:array:14~12")
  test.assertEqual('14', w.far_away.five[0])
  saveLoad.decode(w.far_away, "six:numberarray:4~67~9")
  test.assertEqual([4, 67, 9], w.far_away.six)
  saveLoad.decode(w.far_away, "six:emptyarray")
  test.assertEqual([], w.far_away.six)
  saveLoad.decode(w.far_away, "seven:string:")
  test.assertEqual('', w.far_away.seven)


  test.title("Save/Load 1")
  w.boots.special_att_1 = 'one'
  const bootsSaveString = w.boots.getSaveString().replace('Object=', '')
  w.boots.special_att_2 = 'two'
  delete w.boots.special_att_3
  saveLoad.setFromArray(w.boots, bootsSaveString.split(";"))
  test.assertEqual('one', w.boots.special_att_1)
  test.assertEqual(undefined, w.boots.special_att_2)
  test.assertEqual('three', w.boots.special_att_3)
  
  
  test.title("Save/Load 2");
  // Set up some changes to be saved
  w.boots.counter = 17;
  w.boots.unusualString = "Some interesting text";
  w.boots.notableFlag = true;
  w.boots.examine = "This will get saved";
  w.boots.sizes = [4, 5, 8]
  clone.cloneCounter = 29;
  w.far_away.north.hidden = false
  w.far_away.north.locked = false
  const agendaCount = w.Arthur.agenda.length;
  test.assertEqual(0, w.Arthur.followers.length);
  const s = saveLoad.saveTheWorld("Comment!!!");
  // Now change them again, these changes should get over-written
  w.boots.counter = 42;
  w.boots.unusualString = "Some boring text";
  w.boots.notableFlag = false;
  w.boots.examine = "This will not remain";
  const clone3 = cloneObject(clone);  // should not be there later
  w.far_away.north.locked = true
  saveLoad.loadTheWorld(s, 4)
  

  
  test.assertEqual(count + 2, Object.keys(w).length)
  test.assertEqual(17, w.boots.counter)
  test.assertEqual([4, 5, 8], w.boots.sizes)
  test.assertEqual("Some interesting text", w.boots.unusualString)
  test.assertEqual(true, w.boots.notableFlag)
  test.assertEqual("This will get saved", w.boots.examine)
  test.assertEqual(agendaCount, w.Arthur.agenda.length)
  test.assertEqual(0, w.Arthur.followers.length)
  test.assertEqual(29, w[clone.name].cloneCounter)
  
  
  test.title("Save/Load 3")
  tp.usedStrings = ['One', 'Two']
  const tps = tp.getSaveString()
  tp.usedStrings = ['three']
  tp.setLoadString(tps)
  test.assertEqual(['One', 'Two'], tp.usedStrings)
 

  
  test.title("Path finding");
  test.assertEqual("lounge", formatList(agenda.findPath(w.dining_room, w.lounge)));
  test.assertEqual("", formatList(agenda.findPath(w.dining_room, w.dining_room)));
  test.assertEqual(false, agenda.findPath(w.dining_room, w.far_away));
  test.assertEqual("conservatory, dining room, lounge", formatList(agenda.findPath(w.garden, w.dining_room)));
  test.assertEqual(null, w.dining_room.findExit(w.far_away));
  test.assertEqual("east", w.dining_room.findExit(w.lounge).dir);
  test.assertCmd("s", ["The kitchen", "A clean room. There is a sink in the corner.", /You can see/, "You can go down, north or west."])
  
  
  test.assertCmd("w", ["You head west.", "The lounge", "A smelly room with an old settee and a tv. There is a tatty rug on the floor.", /^You can see/, "You can go east, south, up or west."]);
  test.assertCmd("s", ["You head south.", "The conservatory", "A light airy room.", /You can see/, "You can go north or west."]);
  test.assertCmd("w", ["You head west.", "The garden", "Very overgrown. The garden opens onto a road to the west, whilst the conservatory is east. There is a hook on the wall.", "You can see Arthur here.", "You can go east or west."]);
  
  
  test.title("Agendas");
  test.assertCmd("talk to arthur", ["'Hey, wake up,' you say to Arthur.", "'What?' he says, opening his eyes. 'Oh, it's you.'"]);
  test.assertCmd("talk to arthur", ["'Hey, wake up,' you say to Arthur.", "'I am awake!'"]);
  test.assertCmd("talk to arthur", ["'Hey, wake up,' you say to Arthur."]);
  test.assertCmd("talk to arthur", ["'Hey, wake up,' you say to Arthur.", "'Stop it!'"]);
  test.assertCmd("talk to arthur", ["'Hey, wake up,' you say to Arthur.", "'Stop it!'"]);
  test.assertEqual(0, w.Arthur.followers.length);
  test.assertCmd("z", ["Time passes...", "Arthur stands up and stretches."]);
  test.assertCmd("e", ["You head east.", "The conservatory", "A light airy room.", /You can see/, "You can go north or west."]);
  test.assertEqual(0, w.Arthur.followers.length);
  
  
  test.assertCmd("z", ["Time passes...", "Arthur enters the conservatory from the west."]);
  
  
  test.assertCmd("n", ["You head north.", "The lounge", "A smelly room with an old settee and a tv. There is a tatty rug on the floor.", /^You can see/, "You can go east, south, up or west.", "Arthur enters the lounge from the south."]);
  test.assertCmd("w", ["You head west.", "The dining room", "An old-fashioned room.", /^You can see/, "You can go east, up or west.", "Arthur enters the dining room from the east.", "'Hi, Lara,' says Arthur. 'Come look at the garden.'"]);  
  test.assertEqual(0, w.Arthur.followers.length);
  test.assertCmd("z", ["Time passes...", "'Sure,' says Lara."]);
  test.assertEqual(1, w.Arthur.followers.length);
  
  test.assertCmd("z", ["Time passes...", "Arthur and Lara leave the dining room, heading east."]);
  test.assertCmd("z", ["Time passes..."]);
  
  test.assertCmd("z", ["Time passes...", "Through the window you can see Arthur and Lara enter the garden from the east.", "Through the window you see Arthur say something to Lara."]);
  test.assertCmd("z", ["Time passes...", "You notice Lara is smelling the flowers in the garden."]);
  
  
  test.title("Transit");
  test.assertCmd("w", ["You head west.", "The lift", "A curious lift.", "You can go east."]);
  test.assertCmd("push button: g", ["You're already there mate!"]);
  
  test.assertEqual("dining_room", w.lift.getTransitDestLocation().name)
  test.assertEqual("button_0", w.lift.getTransitDestButton().name)
  test.assertCmd("push 1", ["You press the button; the door closes and the lift heads to the first floor. The door opens again."]);
  test.assertEqual("bedroom", w.lift.getTransitDestLocation().name)
  test.assertEqual("button_1", w.lift.getTransitDestButton().name)
  test.assertCmd("e", ["You head east.", "The bedroom", "A large room, with a big bed and a wardrobe.", "You can see a coat, some jeans, a jumpsuit, a shirt, underwear and a wardrobe here.", "You can go down, in or west."]);
  test.assertCmd("w", ["You head west.", "The lift", "A curious lift.", "You can go east."]);
  w.lift.afterTransitMove = function(toLoc, fromLoc) { msg("MOVING to " + toLoc + " from " + fromLoc); };
  test.assertCmd("push 1", ["You press the button; nothing happens."]);
  test.assertCmd("push 2", ["That does nothing, the button does not work."]);
  test.assertCmd("push g", ["The old man presses the button....", "MOVING to dining_room from bedroom"]);
  test.assertCmd("e", ["You head east.", "The dining room", "An old-fashioned room.", /^You can see/, "You can go east, up or west."])
  w.lift.testTransit = function() {
    msg("The lift is out of order");
    return false;
  };
  w.lift.transitAutoMove = true;
  w.lift.afterEnter = w.lift.transitOfferMenu;
  test.assertCmd("w", ["You head west.", "The lift", "A curious lift.", "You can go east.", "The lift is out of order", "The dining room", "An old-fashioned room.", "You can see a brick, a chair and a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll) here.", "You can go east, up or west."]);
  
  
  test.title("Push");
  test.assertCmd("e", ["You head east.", "The lounge", "A smelly room with an old settee and a tv. There is a tatty rug on the floor.", "You can see a book, a book, a book, seven bricks, a canteen, a cardboard box (containing some boots), a coin, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll) and a small key here.", "You can go east, south, up or west."]);
  test.assertCmd("s", ["You head south.", "The conservatory", "A light airy room.", "You can see a broken chair, a crate and a rope here.", "You can go north or west."]);
  test.assertCmd("push crate", "That's not going to do anything useful.");
  test.assertCmd("push chair s", "It is not something you can move around like that.");
  w.broken_chair.shift = function() { msg("You try to push chair, but it just breaks even more."); return false; }
  w.broken_chair.shiftable = true;
  test.assertCmd("push chair w", "You try to push chair, but it just breaks even more.");
  test.assertCmd("push crate s", "You can't go south.");
  test.assertCmd("push crate w", "You push the crate west.");
  
  
  test.title("ensemble");
  test.movePlayer("wardrobe");
  test.assertCmd("l", ["The wardrobe", "Oddly empty of fantasy worlds.", "You can see a suit here.", "You can go out."]);
  test.assertCmd("get trousers", ["You take the suit trousers."]);
  test.assertCmd("l", ["The wardrobe", "Oddly empty of fantasy worlds.", "You can see a jacket and a waistcoat here.", "You can go out."]);
  test.assertCmd("i", ["You are carrying a flashlight, a garage key and some suit trousers."]);
  test.assertCmd("get jacket, waistcoat", ["You take the jacket.", "You take the waistcoat."]);
  
  test.assertCmd("i", ["You are carrying a flashlight, a garage key and a suit."]);
  test.assertCmd("drop suit", ["You drop the suit."]);
  test.assertCmd("get suit", ["You take the suit."]);
  test.assertCmd("wear suit", ["Individual parts of an ensemble must be worn and removed separately."]);
  test.assertCmd("wear trousers", ["You put on the suit trousers."]);
  test.assertCmd("i", ["You are carrying a flashlight, a garage key, a jacket, some suit trousers (worn) and a waistcoat."]);
  test.assertCmd("wear jacket", ["You put on the jacket."]);
  test.assertCmd("wear waistcoat", ["You can't put the waistcoat on over your jacket."]);
  test.assertCmd("doff jacket", ["You take the jacket off."]);
  test.assertCmd("wear waistcoat", ["You put on the waistcoat."]);
  test.assertCmd("wear jacket", ["You put on the jacket."]);
  test.assertCmd("i", ["You are carrying a flashlight, a garage key and a suit (worn)."]);
  
  
  test.title("pre-rope");
  test.assertCmd("o", ["You head out.", "The bedroom", "A large room, with a big bed and a wardrobe.", "You can see a coat, some jeans, a jumpsuit, a shirt, underwear and a wardrobe here.", "You can go down, in or west."]);
  test.assertCmd("d", ["You head down.", "The lounge", "A smelly room with an old settee and a tv. There is a tatty rug on the floor.", "You can see a book, a book, a book, seven bricks, a canteen, a cardboard box (containing some boots), a coin, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll) and a small key here.", "You can go east, south, up or west."]);
  test.assertCmd("s", ["You head south.", "The conservatory", "A light airy room.", "You can see a broken chair and a rope here.", "You can go north or west."]);
  
  test.title("rope - room one");
  test.assertEqual(['conservatory'], w.rope.locs)
  test.assertEqual(false, w.rope.isUltimatelyHeldBy(w.Buddy))
  test.assertCmd("get rope", ['You take the rope.'])
  test.assertEqual(['Buddy'], w.rope.locs)
  test.assertEqual(true, w.rope.isUltimatelyHeldBy(w.Buddy))
  test.assertCmd("x rope", ['The rope is about 40\' long.'])
  test.assertCmd("tie rope to chair", ["You attach the rope to the broken chair."])
  
  test.assertEqual(['conservatory', 'Buddy'], w.rope.locs)
  test.assertCmd("x rope", ["The rope is about 40' long. One end is tied to the broken chair. The other end is held by you."])
  
  test.assertCmd("tie rope to chair", ["It already is."])
  test.assertCmd("untie rope from chair", ["You detach the rope from the broken chair."])
  test.assertCmd("untie rope from chair", ["The rope is not attached to the broken chair."])
  test.assertEqual(['Buddy'], w.rope.locs)
  test.assertCmd("tie rope to chair", ["You attach the rope to the broken chair."])
  test.assertEqual(['conservatory', 'Buddy'], w.rope.locs)
  test.assertEqual(true, w.rope.isUltimatelyHeldBy(w.Buddy))
  test.assertEqual(true, w.rope.isUltimatelyHeldBy(w.conservatory))
  test.assertEqual(false, w.rope.isUltimatelyHeldBy(w.lounge))

  test.title("rope - room two");
  test.assertCmd("w", ["You head west.", "The garden", "Very overgrown. The garden opens onto a road to the west, whilst the conservatory is east. There is a hook on the wall.", "You can see Arthur, a crate and Lara here.", "You can go east or west.", "The rope unwinds behind you."]);
  test.assertEqual(['conservatory', 'garden', 'Buddy'], w.rope.locs)
  test.assertCmd("tie rope to crate", ["That is not something you can attach the rope to."])
  test.assertCmd("untie rope from crate", ["The rope is not attached to the crate."])
  test.assertCmd("tie rope to hook", ["You attach the rope to the hook."])
  test.assertEqual(['conservatory', 'garden'], w.rope.locs)
  test.assertCmd("x rope", ["The rope is about 40' long. One end heads into the conservatory. The other end is tied to the hook."], true)
  test.assertCmd("get rope", ['It is tied to something.'])




  test.title("rope - room one again");
  test.assertCmd("e", ["You head east.", "The conservatory", "A light airy room.", "You can see a broken chair and a rope here.", "You can go north or west."]);
  test.assertEqual(['conservatory', 'garden'], w.rope.locs)
  test.assertCmd("x rope", ["The rope is about 40' long. One end is tied to the broken chair. The other end heads into the garden."])
  test.assertCmd("untie rope from chair", ["You detach the rope from the broken chair."])
  test.assertCmd("attach rope", ["You attach the rope to the broken chair."])
  test.assertCmd("untie rope", ["You detach the rope from the broken chair."])
  test.assertCmd("x rope", ["The rope is about 40' long. One end is held by you. The other end heads into the garden."])
  test.assertEqual(['Buddy', 'conservatory', 'garden'], w.rope.locs)
  test.assertCmd("n", ["You head north.", "The lounge", "A smelly room with an old settee and a tv. There is a tatty rug on the floor.", "You can see a book, a book, a book, seven bricks, a canteen, a cardboard box (containing some boots), a coin, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll) and a small key here.", "You can go east, south, up or west.", "The rope unwinds behind you."])
  test.assertCmd("e", ["The rope is not long enough, you cannot go any further."])
  test.assertCmd("i", ["You are carrying a flashlight, a garage key, a rope and a suit (worn)."])
  test.assertCmd("x rope", ["The rope is about 40' long. One end is held by you. The other end heads into the conservatory."])
  test.assertEqual(['Buddy', 'lounge', 'conservatory', 'garden'], w.rope.locs)
  test.assertCmd("s", ["You head south.", "The conservatory", "A light airy room.", "You can see a broken chair and a rope here.", "You can go north or west.", "You wind in the rope."]);
  test.assertCmd("x rope", ["The rope is about 40' long. One end is held by you. The other end heads into the garden."])
  test.assertEqual(['Buddy', 'conservatory', 'garden'], w.rope.locs)
  test.assertCmd("w", ["You head west.", "The garden", "Very overgrown. The garden opens onto a road to the west, whilst the conservatory is east. There is a hook on the wall.", "You can see Arthur, a crate, Lara and a rope here.", "You can go east or west.", "You wind in the rope."]);
  test.assertEqual(['Buddy', 'garden'], w.rope.locs)
  test.assertCmd("untie rope", ["You detach the rope from the hook."])
  test.assertEqual(['Buddy'], w.rope.locs)
  test.assertCmd("drop rope", ["You drop the rope."])


  
  
  test.title("Get all (nothing)");
  test.assertCmd("w", ["You head west.", "The road", "A road heading west over a bridge. You can see a shop to the north.", "You can go east, north or west."]);
  test.assertCmd("get all", "Nothing there to do that with.");
  
  
  
  w.Buddy.money = 20

  test.title("shop - text processor");
  test.assertCmd("buy", ["Nothing for sale here."]);


  test.assertCmd("n", ["You head north.", "The shop", "A funny little shop.", "You can go south."]);
  test.assertEqual("The carrot is $0,02", processText("The carrot is {money:carrot}"))
  test.assertEqual("The carrot is $0,02", processText("The carrot is {$:carrot}"))
  test.assertEqual("You see $0,12", processText("You see {$:12}"))
  test.assertEqual("The carrot is $0,02", processText("{nm:item:the:true} is {$:item}", {item:w.carrot}))

  test.title("shop - buy");
  test.assertEqual(true, parser.isForSale(w.carrot))
  test.assertEqual(true, parser.isForSale(w.trophy))
  test.assertEqual(undefined, parser.isForSale(w.flashlight))
  test.assertCmd("buy carrot", ["You buy the carrot for $0,02."]);
  

  
  test.assertEqual(false, parser.isForSale(w.carrot0))
  test.assertEqual(false, w.carrot0.isForSale(player.loc))
  test.assertCmd("buy carrot", ["You buy the carrot for $0,02."]);
  test.assertEqual(16, w.Buddy.money)
  test.assertCmd("buy flashlight", ["You can't buy the flashlight here."]);
  test.assertCmd("buy trophy", ["You buy the trophy for $0,15."]);
  test.assertEqual(1, w.Buddy.money)
  test.assertEqual(true, parser.isForSale(w.carrot))
  //console.log("----------------------");
  test.assertEqual(false, parser.isForSale(w.trophy))
  test.assertCmd("buy trophy", ["You can't buy the trophy here - probably because you are already holding it."]);
  test.assertCmd("buy carrot", ["You can't afford the carrot (need $0,02)."]);
  test.assertEqual(1, w.Buddy.money)
  
  w.carrot0.loc = false
  
  test.title("shop - sell");
  test.assertCmd("sell carrot", ["You can't sell the carrot here."]);
  test.assertEqual(1, w.Buddy.money)
  test.assertCmd("sell trophy", ["You sell the trophy for $0,08."]);
  test.assertEqual(9, w.Buddy.money)

  test.assertCmd("sell trophy", ["You don't have it."])
  test.assertEqual(9, w.Buddy.money)
  w.Buddy.money = 20
  w.shop.sellingDiscount = 20
  test.assertEqual(12, w.trophy.getBuyingPrice(w.Buddy))
  
  test.assertCmd("buy trophy", ["You buy the trophy for $0,12."]);
  test.assertEqual(8, w.Buddy.money)
  w.shop.buyingValue = 80
  test.assertCmd("sell trophy", ["You sell the trophy for $0,12."]);
  test.assertEqual(20, w.Buddy.money)
  
  test.title("the zone - visible barrier and simple exit");
  test.assertCmd("s", ["You head south.", "The road", "A road heading west over a bridge. You can see a shop to the north.", "You can go east, north or west."]);
  test.assertCmd("w", ["You head west.", "The bridge", "From the bridge you can just how deep the canyon is.", "You can see Piggy-suu here.", "You can go east or west."]);
  // Takes us to 5,0
  test.assertCmd("w", ["You head west.", "The desert", "You are standing on a road heading west through a desert, and east over a bridge. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can go east, north, northeast, northwest, southwest or west."]);
   
  
    // Takes us to 4,0  
  test.assertCmd("w", ["You head west.", "The desert", "You are standing on a road running east to west through a desert. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can go east, north, northeast, northwest, south, southwest or west."]);
  
  test.assertCmd("drop carrot", ["You drop the carrot."]);
  test.assertCmd("look", ["The desert", "You are standing on a road running east to west through a desert. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can see a carrot here.", "You can go east, north, northeast, northwest, south, southwest or west."]);
  
  
  // Takes us to 4,-1
  test.assertCmd("s", ["You head south.", "The desert", "You are standing in the desert, south of the road. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can go north, northeast, northwest, southwest or west."]);
  test.assertCmd("s", ["You can't go south."]);  
  // Takes us to 4,0  
  test.assertCmd("n", ["You head north.", "The desert", "You are standing on a road running east to west through a desert. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can see a carrot here.", "You can go east, north, northeast, northwest, south, southwest or west."]);
  // Takes us to 5,0
  test.assertCmd("e", ["You head east.", "The desert", "You are standing on a road heading west through a desert, and east over a bridge. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can go east, north, northeast, northwest, southwest or west."]);
  test.assertCmd("e", ["You start across the bridge.", "The bridge", "From the bridge you can just how deep the canyon is.", "You can see Piggy-suu here.", "You can go east or west."]);
  // Takes us to 5,0
  test.assertCmd("w", ["You head west.", "The desert", "You are standing on a road heading west through a desert, and east over a bridge. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can go east, north, northeast, northwest, southwest or west."]);
  
  
  test.title("the zone - features");
  // 1. Takes us to 4,0  
  test.assertCmd("w", ["You head west.", "The desert", "You are standing on a road running east to west through a desert. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can see a carrot here.", "You can go east, north, northeast, northwest, south, southwest or west."]);
  // 2. Takes us to 3,0  
  test.assertCmd("w", ["You head west.", "The desert", "You are standing on a road running east to west through a desert. There is a big cactus to the southwest.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  // 3. Takes us to 1,0  
  test.assertCmd("w", ["You head west.", "The desert", "You are standing on a road running east to west through a desert. There is a big cactus to the southwest.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  // 4. Takes us to 1,0  
  test.assertCmd("w", ["You head west.", "The desert", "You are standing on a road running east to west through a desert. There is a big cactus to the south. There is a tower to the northwest.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  // 5. Takes us to 1,1
  test.assertCmd("n", ["You head north.", "The desert", "You are standing in the desert, north of the road. There is a big cactus to the south. There is a tower to the northwest.", "You can see a silver coin here.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  // 6. Takes us to 1,2
  test.assertCmd("n", ["You head north.", "The desert", "You are standing in the desert, north of the road. There is a tower to the northwest.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  // 7. Takes us to 1,3
  test.assertCmd("n", ["You head north.", "The desert", "You are standing in the desert, north of the road. There is a tower to the west.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  // 8. Takes us to 1,4
  test.assertCmd("n", ["You head north.", "The desert", "You are standing in the desert, north of the road. There is a tower to the southwest.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  // 9. Takes us to 1,5
  test.assertCmd("n", ["You head north.", "The desert", "You are standing in the desert, north of the road. There is a tower to the southwest.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  // 10. Takes us to 1,6
  test.assertCmd("n", ["You head north.", "The desert", "You are standing in the desert, north of the road. There is a tower to the southwest.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  
  
  test.title("the zone - invisible border");
  test.assertCmd("x barrier", ["There doesn't seem to be anything you might call 'barrier' here."]);
  test.assertCmd("n", ["You head north.", "The desert", "You are standing in the desert, north of the road. The air seems to kind of shimmer.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  test.assertCmd("n", ["You try to head north, but hit an invisible barrier."]);
  test.assertCmd("x barrier", ["It is invisible!"]);
  
  
  test.title("the zone - exits again");
  test.assertCmd("w", ["You head west.", "The desert", "You are standing in the desert, north of the road. The air seems to kind of shimmer.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  test.assertCmd("s", ["You head south.", "The desert", "You are standing in the desert, north of the road. There is a tower to the south.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  test.assertCmd("s", ["You head south.", "The desert", "You are standing in the desert, north of the road. There is a tower to the southwest.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  test.assertCmd("sw", ["You head southwest.", "The desert", "You are standing in the desert, north of the road. There is a tower to the south.", "You can go east, north, northeast, northwest, south, southeast, southwest or west."]);
  test.assertCmd("s", ["You head south.", "The desert", "You are standing in the desert, north of the road. There is a tall stone tower here.", "You can go east, in, north, northeast, northwest, south, southeast, southwest or west."]);
  test.assertCmd("in", ["You step inside the tower, and climb the step, spiral staircase to the top.", "Inside the tower", "A tower, looking out over the desert. To the south is the road, heading east back to your house. To the north is a magic portal, going who knows where.", "You can go down or north."]);
  
  test.assertCmd("n", ["You head north.", "The shop", "A funny little shop.", "You can go south."]);
  test.assertCmd("s", ["You head south.", "The road", "A road heading west over a bridge. You can see a shop to the north.", "You can go east, north or west."]);
  test.assertCmd("w", ["You head west.", "The bridge", "From the bridge you can just how deep the canyon is.", "You can see Piggy-suu here.", "You can go east or west."]);
  // Takes us to 5,0
  test.assertCmd("w", ["You head west.", "The desert", "You are standing on a road heading west through a desert, and east over a bridge. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can go east, north, northeast, northwest, southwest or west."]);
  
  test.assertCmd("w", ["You head west.", "The desert", "You are standing on a road running east to west through a desert. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can see a carrot here.", "You can go east, north, northeast, northwest, south, southwest or west."]);
  
  test.assertCmd("get carrot", ["You take the carrot."])


  test.title("changing POV prep")
  test.assertCmd("e", ["You head east.", "The desert", "You are standing on a road heading west through a desert, and east over a bridge. There is a deep canyon southeast of you, running from the southwest to the northeast.", "You can go east, north, northeast, northwest, southwest or west."]);
  test.assertCmd("e", ["You start across the bridge.", "The bridge", "From the bridge you can just how deep the canyon is.", "You can see Piggy-suu here.", "You can go east or west."]);
  test.assertCmd("e", ["You head east.", "The road", "A road heading west over a bridge. You can see a shop to the north.", "You can go east, north or west."]);
  test.assertCmd("drop carrot", ["You drop the carrot."])
  
  test.title("changing POV")
  util.changePOV(w.piggy_suu)
  test.assertCmd("l", ["The bridge", "From the bridge you can just how deep the canyon is.", "You can go east or west."])
  
  
  test.assertCmd("e", ["You head east.", "The road", "A road heading west over a bridge. You can see a shop to the north.", "You can see Buddy (holding a flashlight and a garage key; wearing a suit) and a carrot here.", "You can go east, north or west."])


  test.title("agenda follower")
  w.timetable.setAgenda(['wait', 'run:script','wait:2', 'run:script:2', 'waitFor:check', 'run:script:3', 'waitFor:check:script:5'])
  test.assertEqual(0, w.timetable.counter)
  test.assertCmd("wait", "Time passes...")
  test.assertEqual(0, w.timetable.counter)
  test.assertCmd("wait", "Time passes...")
  test.assertEqual(1, w.timetable.counter)

  test.assertCmd("wait", "Time passes...")
  test.assertCmd("wait", "Time passes...")
  test.assertEqual(1, w.timetable.counter)
  test.assertCmd("wait", "Time passes...")
  test.assertEqual(3, w.timetable.counter)

  test.assertCmd("wait", "Time passes...")
  test.assertCmd("wait", "Time passes...")
  test.assertEqual(3, w.timetable.counter)
  w.timetable.flag = true
  test.assertCmd("wait", "Time passes...")
  w.timetable.flag = false
  test.assertCmd("wait", "Time passes...")
  test.assertEqual(6, w.timetable.counter)

  test.assertCmd("wait", "Time passes...")
  test.assertCmd("wait", "Time passes...")
  test.assertEqual(6, w.timetable.counter)
  w.timetable.flag = true
  test.assertCmd("wait", "Time passes...")
  test.assertEqual(11, w.timetable.counter)


  test.title("reverse order commands")
  w.knife.loc = player.name
  w.carrot1.loc = player.name
  world.update()
  test.assertCmd("slice carrot with knife", "Done.")
  test.assertCmd("use knife slice carrot", "Done.")
  test.assertCmd("use knife to slice carrot", "Done.")
  test.assertCmd("slice carrot with carrot", "You can't cut a carrot with the carrot.")



  test.title("vessels and liquids")
  w.jug.loc = "big_kitchen_table"
  w.canteen.loc = "big_kitchen_table"
  test.movePlayer('kitchen')
  test.assertCmd("get jug", ["You take the jug."])
  test.assertCmd("get canteen", ["You take the canteen."])
  
  test.assertCmd("fill jug with tears", ["I don't know of a liquid (or similar substance) called tears."])
  test.assertCmd("fill jug with honey", ["There's no honey here."])
  test.assertCmd("fill jug with water", ["You fill the jug."])
  test.assertCmd("fill knife with water", ["Trying to put a liquid (or similar substance) in the knife is just going to cause a mess."])
  test.assertCmd("fill jug with water", ["It is already full of water."])
  test.assertCmd("empty knife", ["The knife is not something you can empty."])
  test.assertCmd("empty jug", ["You empty the jug onto the ground, and it soaks away."])
  test.assertCmd("fill jug", ["You fill the jug."])
  test.assertCmd("empty jug into sink", ["You empty the jug into the dirty sink."])
  w.jug.containedFluidName = 'water'
  test.assertCmd("pour canteen into jug", ["The canteen is already empty."])
  test.assertCmd("x canteen", ["The canteen is empty."])
  test.assertCmd("pour jug into canteen", ["You empty the jug into the canteen."])
  test.assertCmd("x canteen", ["The canteen is full."])
  test.assertCmd("pour water into jug", ["You empty the canteen into the jug."])
  test.assertCmd("empty jug", ["You empty the jug onto the ground, and it soaks away."])
  
  w.canteen.containedFluidName = 'honey'
  test.assertCmd("fill jug with honey", ["You empty the canteen into the jug."])
  
  test.assertCmd("put jug in canteen", ["The canteen is not a container. It is a vessel, they are different, alright?"])
  test.assertCmd("put water in canteen", ["You fill the canteen."])
  
  w.honey_pot.loc = 'kitchen'
  delete w.canteen.containedFluidName
  delete w.jug.containedFluidName
  world.update()

  test.assertCmd("x honey", ["A pot of honey."])
  // the honey pot is NOT a source of honey, so this is right
  test.assertCmd("put honey in canteen", ["There's no honey here."])
  


  test.title("item directions")
  w.Kyle.loc = 'kitchen'
  w.light_switch.switchedon = true
  world.update()
  test.assertCmd("tell kyle to go through trapdoor", ["Kyle disappears through the trapdoor."])
  test.assertCmd("go through trapdoor", ["You go through the trapdoor, and down the ladder.", "The basement", "A dank room, with piles of crates everywhere.", "You can see a crates, Kyle (holding a clock; wearing a straw boater), a ladder and a light switch here.", "You can go up."])
  test.assertCmd("tell kyle to climb ladder", ["Kyle leaves the basement, heading up."])
  test.assertCmd("go up ladder", ["You head up.", "The kitchen", "A clean room. There is a sink in the corner.", "You can see a big kitchen table, a camera, Kyle (holding a clock; wearing a straw boater) and a trapdoor (open) here.", "You can go down, north or west."])


  test.title("give plus")
  w.ham_and_cheese_sandwich.loc = player.name
  test.assertCmd("give kyle knife", ["Done."])
  test.assertEqual('Kyle', w.knife.loc)
  w.knife.loc = player.name

  test.assertCmd("give knife", ["Done."])
  test.assertEqual('Kyle', w.knife.loc)
  w.knife.loc = player.name

  test.assertCmd("give knife to kyle", ["Done."])
  test.assertEqual('Kyle', w.knife.loc)
  w.knife.loc = player.name

  test.menuResponseNumber = 0
  test.assertCmd("give c", ["Done."])
  test.assertEqual('Kyle', w.canteen.loc)
  w.canteen.loc = player.name

  test.assertCmd("give knife canteen", ["Knife: Done.", "Canteen: Done."])
  test.assertEqual('Kyle', w.knife.loc)
  test.assertEqual('Kyle', w.canteen.loc)
  w.knife.loc = player.name
  w.canteen.loc = player.name

  test.title("give plus 2")
  test.assertCmd("give kyle knife canteen", ["Knife: Done.", "Canteen: Done."])
  test.assertEqual('Kyle', w.knife.loc)
  test.assertEqual('Kyle', w.canteen.loc)
  w.knife.loc = player.name
  w.canteen.loc = player.name

  test.assertCmd("give nonsense canteen", ["There doesn't seem to be anything you might call 'nonsense canteen' here."])

  test.assertCmd("give kyle knife ham canteen", ["Knife: Done.", "Ham and cheese sandwich: Done.", "Canteen: Done."])
  test.assertEqual('Kyle', w.knife.loc)
  test.assertEqual('Kyle', w.canteen.loc)
  test.assertEqual('Kyle', w.ham_and_cheese_sandwich.loc)
  w.knife.loc = player.name
  w.canteen.loc = player.name
  w.ham_and_cheese_sandwich.loc = player.name


  test.assertCmd("give kyle knife ham sandwich canteen", ["Knife: Done.", "Ham and cheese sandwich: Done.", "Canteen: Done."])
  test.assertEqual('Kyle', w.knife.loc)
  test.assertEqual('Kyle', w.canteen.loc)
  test.assertEqual('Kyle', w.ham_and_cheese_sandwich.loc)
  test.assertCmd("kyle, give piggy knife ham sandwich canteen", ["Knife: Done.", "Ham and cheese sandwich: Done.", "Canteen: Done."])
  test.assertEqual(player.name, w.knife.loc)
  test.assertEqual(player.name, w.canteen.loc)
  test.assertEqual(player.name, w.ham_and_cheese_sandwich.loc)

  test.title("give plus 3")
  test.assertCmd("give kyle knife ham and cheese sandwich canteen", ["Knife: Done.", "Ham and cheese sandwich: Done.", "Canteen: Done."])
  test.assertEqual('Kyle', w.knife.loc)
  test.assertEqual('Kyle', w.canteen.loc)
  test.assertEqual('Kyle', w.ham_and_cheese_sandwich.loc)

  test.assertCmd("kyle, give me knife ham and cheese sandwich canteen", ["Knife: Done.", "Ham and cheese sandwich: Done.", "Canteen: Done."])
  test.assertEqual(player.name, w.knife.loc)
  test.assertEqual(player.name, w.canteen.loc)
  test.assertEqual(player.name, w.ham_and_cheese_sandwich.loc)


  w.knife.loc = player.name
  w.canteen.loc = player.name
  w.ham_and_cheese_sandwich.loc = player.name

  test.title("give alt")
  w.Lara.loc = 'kitchen'
  world.update()
  test.assertCmd("give lara jug", ["'That's not a carrot,' Lara points out."])
  test.assertCmd("give lara knife", ["'A knife?' says Lara. 'I guess I could use that... for something?'"])
  test.assertCmd("give lara carrot", ["'A carrot!' says Lara with delight, before stuffing it in her mouth. 'So, do you have any more?'"])




/*
  test.title("quests")
  test.assertCmd("talk to buddy", ["'Hey, Buddy,' you say.", "'Hey yourself! Say, could you get me a carrot?'","Quest started: <i>A carrot for Buddy</i>", "Go find a carrot."])
  let res = quest.getState('A carrot for Buddy', w.Buddy)
  test.assertEqual(0, res.progress)
  test.assertEqual(quest.ACTIVE, res.state)
  
*/  
  
  
  
  
  
  
  
  
  
  /* */
  //this.check_lang = true
  if (this.check_lang) {
    const langSkips = [
      /regex/,
      /prefix/i,
      /script/i,
      /rope_/,   // rope ones are combined so this system does not find them anyway
      /sl_dir_headings/,
      /sl_dir_msg/,
      /sl_no_filename/,
      /spoken_on/,
      /spoken_off/,
      /mode_brief/,
      /mode_terse/,
      /mode_verbose/,
      /mode_silent_on/,
      /mode_silent_off/,
      /undo_disabled/,
      /undo_not_available/,
      /undo_done/,
      /again_not_available/,
      /scores_not_implemented/,
      /restart_no/,
      /restart_are_you_sure/,
      /betaTestIntro/,
      /game_over_html/,
      /list_and/,
      /list_nothing/,
      /list_or/,
      /list_nowhere/,
      /never_mind/,
      /click_to_continue/,
      /buy/,
      /buy_headings/,
      /current_money/,
      /yesNo/,
      /pronouns/,
      /verbs/,
      /invModifiers/,
      /exit_list/,
      /numberUnits/,
      /numberTens/,
      /ordinalReplacements/,
      /conjugations/,
      /contentsForData/,
      /addDefiniteArticle/,
      /addIndefiniteArticle/,
      /getName/,
      /toWords/,
      /toOrdinal/,
      /convertNumbers/,
      /conjugate/,
      /pronounVerb/,
      /pronounVerbForGroup/,
      /verbPronoun/,
      /nounVerb/,
      /verbNoun/,
    ]
    let countOutstanding = 0
    let countDone = 0
    console.log(tp.usedStrings.length)
    for (let el in lang) {
      if (typeof el !== 'string') continue
      if (langSkips.find(e => el.match(e))) continue
      if (tp.usedStrings.includes(lang[el])) {
        countDone++
        continue
      }
      console.log(el)
      countOutstanding++
    }
    console.log(countOutstanding + '/' + (countOutstanding+countDone))
  }
  
  
  
}