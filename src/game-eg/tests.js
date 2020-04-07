'use strict'
import {
  INDEFINITE, getDir, settings, msg, cloneObject, saveLoad, agenda,
  sentenceCase, formatList, displayMoney, test, transitOfferMenu, world,
  w, processText, lang, arraySubtract,
  DEFINITE, parser, arrayCompare, game, displayNumber
} from '../main'

// -fixme: NEEDS TO CHANGE: you can't have the library import something from the game
// - it can't be bundled independantly this way
test.tests = function () {
  test.title('parser.scoreObjectMatch')
  test.assertEqual(70, parser.scoreObjectMatch('me', w.me, ''))
  test.assertEqual(-1, parser.scoreObjectMatch('me fkh', w.me, ''))
  test.assertEqual(-1, parser.scoreObjectMatch('xme', w.me, ''))
  test.assertEqual(70, parser.scoreObjectMatch('flashlight', w.flashlight, ''))
  test.assertEqual(16, parser.scoreObjectMatch('f', w.flashlight, ''))
  test.assertEqual(18, parser.scoreObjectMatch('fla', w.flashlight, ''))
  test.assertEqual(60, parser.scoreObjectMatch('torch', w.flashlight, ''))
  test.assertEqual(70, parser.scoreObjectMatch('glass cabinet', w.glass_cabinet, ''))
  test.assertEqual(50, parser.scoreObjectMatch('glass', w.glass_cabinet, ''))
  test.assertEqual(50, parser.scoreObjectMatch('cabinet', w.glass_cabinet, ''))
  test.assertEqual(3, parser.scoreObjectMatch('cab', w.glass_cabinet, ''))

  test.title('sentenceCase')
  test.assertEqual('Simple text', sentenceCase('simple text'))

  test.title('byname')
  test.assertEqual('book', w.book.byname())
  test.assertEqual('the book', w.book.byname({ article: DEFINITE }))
  test.assertEqual('A book', w.book.byname({ article: INDEFINITE, capital: true }))
  test.assertEqual('you', w.me.byname())
  test.assertEqual('You', w.me.byname({ article: INDEFINITE, capital: true }))

  // test.title('random.fromArray')
  // const ary = ['one', 'two', 'three']
  // const ary2 = []
  // for (let i = 0; i < 3; i++) {
  //   const res = random.fromArray(ary, true)
  //   if (ary2.includes(res)) test.fail('ary2 already has that value')
  //   ary2.push(res)
  // }
  // test.assertEqual(0, ary.length)

  test.title('arrayCompare')
  test.assertEqual(false, arrayCompare([1, 2, 4, 6, 7], [1, 2, 3]))
  test.assertEqual(true, arrayCompare([1, 2, 4], [1, 2, 4]))
  test.assertEqual(false, arrayCompare([w.coin, w.boots, w.ring], [w.boots, w.ring]))
  test.assertEqual(true, arrayCompare([w.boots, w.ring], [w.boots, w.ring]))

  test.title('arraySubtract')
  test.assertEqual([4, 6, 7], arraySubtract([1, 2, 4, 6, 7], [1, 2, 3]))
  test.assertEqual(['4', '6', '7'], arraySubtract(['1', '2', '4', '6', '7'], ['1', '2', '3']))
  test.assertEqual([w.coin, w.boots], arraySubtract([w.coin, w.boots, w.ring], [w.ring]))

  test.title('Text processor 1')
  test.assertEqual('Simple text', processText('Simple text'))
  test.assertEqual('Simple <i>text</i>', processText('Simple {i:text}'))
  test.assertEqual('Simple <span style="color:red">text</span>.', processText('Simple {colour:red:text}.'))
  test.assertEqual('Simple <span style="color:red">text with <i>nesting</i></span>.', processText('Simple {colour:red:text with {i:nesting}}.'))
  test.assertEqual('Simple text', processText('Simple {random:text}'))
  test.assertEqual('Simple text: no', processText('Simple text: {if:player:someOddAtt:yes:no}'))
  game.player.someOddAtt = 67
  test.assertEqual('Simple text: 67', processText('Simple text: {show:player:someOddAtt}'))

  test.title('Text processor 2')
  test.assertEqual('Simple text: no', processText('Simple text: {if:player:someOddAtt:50:yes:no}'))
  test.assertEqual('Simple text: yes', processText('Simple text: {if:player:someOddAtt:67:yes:no}'))
  test.assertEqual('Simple text: ', processText('Simple text: {if:player:someOddAtt:50:yes}'))
  test.assertEqual('Simple text: yes', processText('Simple text: {if:player:someOddAtt:67:yes}'))
  test.assertEqual('Simple text: yes', processText('Simple text: {ifMoreThan:player:someOddAtt:50:yes:no}'))
  test.assertEqual('Simple text: no', processText('Simple text: {ifLessThan:player:someOddAtt:50:yes:no}'))
  test.assertEqual('Simple text: ', processText('Simple text: {ifLessThan:player:someOddAtt:50:yes}'))
  game.player.someOddAtt = true
  test.assertEqual('Simple text: true', processText('Simple text: {show:player:someOddAtt}'))
  test.assertEqual('Simple text: yes', processText('Simple text: {if:player:someOddAtt:yes:no}'))
  test.assertEqual('Simple text: no', processText('Simple text: {ifNot:player:someOddAtt:yes:no}'))
  test.assertEqual('Simple text: seen first time only', processText('Simple text: {once:seen first time only}{notOnce:other times}'))

  test.title('Text processor 3')
  test.assertEqual('Simple text: other times', processText('Simple text: {once:seen first time only}{notOnce:other times}'))
  test.assertEqual('Simple text: other times', processText('Simple text: {once:seen first time only}{notOnce:other times}'))
  test.assertEqual('Simple text: p2=red', processText('Simple text: p2={param:p2}', { p1: 'yellow', p2: 'red' }))
  w.book.func1 = function () { return 'test1' }
  w.book.func2 = function (a, b) { return 'test2(' + a + ', ' + b + ')' }
  w.book.func3 = function (a) { return 'It is ' + w[a].alias + ' reading the book.' }
  test.assertEqual('Simple text: p2=test1', processText('Simple text: p2={param:item:func1}', { item: 'book' }))
  test.assertEqual('Simple text: p2=test2(one, two)', processText('Simple text: p2={param:item:func2:one:two}', { item: 'book' }))
  test.assertEqual('Simple text: p2=It is Kyle reading the book.', processText('Simple text: p2={param:item:func3:char}', { item: 'book', char: 'Kyle' }))

  test.title('Text processor 4')
  test.assertEqual('Kyle is a bear.', processText('{nv:chr:be} a bear.', { chr: 'Kyle' }))
  test.assertEqual('Kyle is a bear.', processText('{nv:chr:be} a bear.', { chr: w.Kyle }))
  test.assertEqual('Kyle is your bear.', processText('{nv:Kyle:be} {pa:me} bear.'))
  test.assertEqual('Kyle is her bear.', processText('{nv:Kyle:be} {pa:Lara} bear.'))
  test.assertEqual('There is Kyle.', processText('There is {nm:chr:a}.', { chr: w.Kyle }))
  test.assertEqual('There is a book.', processText('There is {nm:chr:a}.', { chr: w.book }))
  test.assertEqual('Kyle is here.', processText('{nm:chr:the:true} is here.', { chr: w.Kyle }))
  test.assertEqual('The book is here.', processText('{nm:chr:the:true} is here.', { chr: w.book }))
  test.assertEqual('It is your book.', processText('It is {nms:chr:the} book.', { chr: game.player }))
  test.assertEqual("It is Kyle's book.", processText('It is {nms:chr:the} book.', { chr: w.Kyle }))

  test.title('Text processor 5')
  test.assertEqual('Kyle is a bear.', processText('{Kyle.alias} is a bear.'))
  test.assertEqual('Kyle is a bear.', processText('{show:Kyle:alias} is a bear.'))
  test.assertEqual('Kyle is a bear.', processText('{Kyle:alias} is a bear.'))
  test.assertEqual('You have $10.', processText('You have ${show:me:money}.'))
  test.assertEqual('You have $10.', processText('You have ${player.money}.'))
  test.assertEqual('You have $10.', processText('You have ${me.money}.'))
  test.assertEqual('You have $10.', processText('You have ${player.money}.'))

  test.title('Numbers')
  test.assertEqual('fourteen', lang.toWords(14))
  test.assertEqual('minus four hundred and three', lang.toWords(-403))
  test.assertEqual('ninetyseven', lang.toWords(97))
  test.assertEqual('fourteenth', lang.toOrdinal(14))
  test.assertEqual('four hundred and third', lang.toOrdinal(403))
  test.assertEqual('ninetyfirst', lang.toOrdinal(91))
  test.assertEqual('get 4 sticks', lang.convertNumbers('get four sticks'))
  test.assertEqual('get 14 sticks', lang.convertNumbers('get fourteen sticks'))
  test.assertEqual('get no sticks', lang.convertNumbers('get no sticks'))
  test.assertEqual('ninetieth', lang.toOrdinal(90))

  test.title('Numbers 2')
  test.assertEqual('(012,34)', displayNumber(1234, '(3,2)'))
  test.assertEqual('$1234', displayMoney(1234))
  test.assertEqual('$-1234', displayMoney(-1234))
  settings.moneyFormat = '!3.2! credits'
  test.assertEqual('012.34 credits', displayMoney(1234))
  test.assertEqual('-012.34 credits', displayMoney(-1234))
  settings.moneyFormat = '!+3.2! credits'
  test.assertEqual('+012.34 credits', displayMoney(1234))
  test.assertEqual('-012.34 credits', displayMoney(-1234))
  settings.moneyFormat = game.moneyformat = '!$1,2!($1,2)!'
  test.assertEqual('$12,34', displayMoney(1234))
  test.assertEqual('($12,34)', displayMoney(-1234))

  test.title('getDir')
  test.assertEqual('out', getDir('o'))
  test.assertEqual('down', getDir('dn'))
  test.assertEqual('out', getDir('exit'))
  test.assertEqual(false, getDir('bo'))

  test.title('Look inside')
  test.assertCmd('look inside cabinet', 'Inside the glass cabinet you can see a jewellery box and an ornate doll.')
  test.assertCmd('look inside box', 'Inside the cardboard box you can see nothing.')
  test.assertCmd('look inside boots', "There's nothing to see inside.")
  test.assertCmd('look inside book', 'The book has pages and pages of text, but you do not even recongise the text.')

  test.title('Simple object commands')
  test.assertCmd('i', 'You are carrying a knife.')
  test.assertCmd('get coin', 'You try to pick up the coin, but it just will not budge.')
  test.assertCmd('get straw boater', 'Kyle has it.')
  test.assertCmd('get cabinet', "You can't take it.")
  test.assertCmd('get the cabinet', "You can't take it.")
  test.assertCmd('get a cabinet', "You can't take it.")
  test.assertCmd('get knife', 'You have it.')
  test.assertCmd('x tv', "It's just scenery.")
  test.assertCmd('get tv', "You can't take it.")
  test.assertCmd('give knife to boots', 'Realistically, the boots are not interested in anything you might give them.')

  test.title('Simple object commands (eat)')
  test.assertCmd('eat knife', "It's not something you can eat.")
  test.assertCmd('get sandwich', 'You take the sandwich.')
  test.assertCmd('drink sandwich', "It's not something you can drink.")
  test.assertCmd('ingest sandwich', ['You eat the sandwich.', 'That was Great!'])

  test.title('Simple object commands (boots)')
  test.assertCmd('wear boots', "You don't have them.")
  test.assertCmd('remove boots', "You don't have them.")
  test.assertCmd('get boots', 'You take the boots.')
  test.assertCmd('inv', 'You are carrying some boots and a knife.')
  test.assertCmd('get boots', 'You have them.')
  test.assertCmd('wear boots', 'You put on the boots.')
  test.assertCmd('inventory', 'You are carrying some boots (worn) and a knife.')
  test.assertCmd('wear boots', "You're wearing them.")
  test.assertCmd('remove boots', 'You take the boots off.')
  test.assertCmd('drop boots', 'You drop the boots.')

  test.title('Simple object commands (book)')
  test.assertCmd('get the book', 'You take the book.')
  test.assertCmd('read the book', 'It is not in a language you understand.')
  test.assertCmd('give it to kyle', 'Done.')
  test.assertCmd('kyle, read the book', 'It is not in a language he understands.')
  test.assertCmd('kyle, drop book', 'Kyle drops the book.')
  test.assertCmd('n', "You can't go north.")
  test.assertCmd('d', "You can't go down.")

  test.title('Simple object commands (bricks)')
  test.assertCmd('get the bricks', 'You take seven bricks.')
  test.assertCmd('drop 3 bricks', 'You drop three bricks.')
  test.assertCmd('inv', 'You are carrying four bricks and a knife.')
  test.assertCmd('drop 4 bricks', 'You drop four bricks.')
  test.assertCmd('inv', 'You are carrying a knife.')
  test.assertCmd('get 10 bricks', 'You take seven bricks.')
  test.assertCmd('e', ['You head east.', 'The kitchen', 'A clean room, a clock hanging on the wall. There is a sink in the corner.', 'You can see a big kitchen table (with a jug on it), a camera, a garage door and a trapdoor here.', 'You can go north or west.', 'A fresh smell here!'])
  test.assertCmd('put 2 bricks on to the table', 'Done.')
  test.assertCmd('inv', 'You are carrying five bricks and a knife.')
  test.assertCmd('look', ['The kitchen', 'A clean room, a clock hanging on the wall. There is a sink in the corner.', 'You can see a big kitchen table (with two bricks and a jug on it), a camera, a garage door and a trapdoor here.', 'You can go north or west.'])
  test.assertCmd('get the bricks', 'You take two bricks.')
  test.assertCmd('get clock', 'You take the clock.')
  test.assertCmd('look', ['The kitchen', 'A clean room. There is a sink in the corner.', 'You can see a big kitchen table (with a jug on it), a camera, a garage door and a trapdoor here.', 'You can go north or west.'])
  test.assertCmd('drop clock', 'You drop the clock.')
  test.assertCmd('look', ['The kitchen', 'A clean room. There is a sink in the corner.', 'You can see a big kitchen table (with a jug on it), a camera, a clock, a garage door and a trapdoor here.', 'You can go north or west.'])
  test.assertCmd('w', ['You head west.', 'The lounge', 'A smelly room with an old settee and a tv.', 'You can see a book, some boots, a cardboard box, a coin, a flashlight, a garage key, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater), a small key and a waterskin here.', 'You can go east, south, up or west.'])

  test.title('Simple object commands (bricks and a box)')
  test.assertEqual(false, parser.isContained(w.brick))
  test.assertCmd('drop bricks in box', 'Done.')
  test.assertEqual(true, parser.isContained(w.brick))
  test.assertCmd('get bricks', 'You take seven bricks.')
  test.assertEqual(false, parser.isContained(w.brick))
  test.assertCmd('drop three bricks in box', 'Done.')
  test.assertEqual(true, parser.isContained(w.brick))
  test.assertCmd('drop bricks', 'You drop four bricks.')
  test.assertEqual(true, parser.isContained(w.brick))
  test.assertCmd('get bricks', 'You take four bricks.')
  test.assertEqual(true, parser.isContained(w.brick))
  test.assertCmd('get bricks', 'You take three bricks.')
  test.assertEqual(false, parser.isContained(w.brick))

  test.title('Simple object commands (bricks and a held box)')
  test.assertCmd('get box', 'You take the cardboard box.')
  test.assertCmd('drop bricks in box', 'Done.')
  test.assertCmd('get bricks from box', 'Done.')
  test.assertCmd('drop three bricks in box', 'Done.')
  test.assertCmd('drop bricks', 'You drop four bricks.')
  test.assertCmd('get bricks', 'You take four bricks.')
  test.assertCmd('get bricks', 'You take three bricks.')
  test.assertCmd('drop box', 'You drop the cardboard box.')

  test.title('Restricting')
  game.player.canTalk = function () { msg('You are gagged.'); return false }
  test.assertCmd('talk to kyle', 'You are gagged.')
  game.player.canTalk = function () { return true }
  game.player.canManipulate = function () { msg('You are handcuffed.'); return false }
  test.assertCmd('drop bricks', 'You are handcuffed.')
  game.player.canManipulate = function () { return true }
  test.assertCmd('drop bricks', 'You drop seven bricks.')

  test.title('Wear/remove')
  test.assertCmd('u', ['You head up.', 'The bedroom', 'A large room, with a big bed and a wardrobe.', 'You can see a coat, some jeans, a jumpsuit, a shirt, underwear and a wardrobe here.', 'You can go down, in or west.'])
  test.assertCmd('get all', ["Wardrobe: You can't take it.", 'Underwear: You take the underwear.', 'Jeans: You take the jeans.', 'Shirt: You take the shirt.', 'Coat: You take the coat.', 'Jumpsuit: You take the jumpsuit.'])
  test.assertCmd('wear underwear', 'You put on the underwear.')
  test.assertCmd('wear jeans', 'You put on the jeans.')
  test.assertCmd('wear shirt', 'You put on the shirt.')
  test.assertCmd('remove underwear', "You can't take off your underwear whilst wearing your jeans.")
  test.assertCmd('remove jeans', 'You take the jeans off.')
  test.assertCmd('remove underwear', 'You take the underwear off.')
  test.assertCmd('wear jumpsuit', "You can't put a jumpsuit on over your shirt.")
  test.assertCmd('remove shirt', 'You take the shirt off.')
  test.assertCmd('wear jumpsuit', 'You put on the jumpsuit.')
  test.assertCmd('wear coat', 'You put on the coat.')
  test.assertCmd('wear underwear', "You can't put underwear on over your jumpsuit.")
  test.assertCmd('remove coat', 'You take the coat off.')
  test.assertCmd('drop all', ['Knife: You drop the knife.', 'Underwear: You drop the underwear.', 'Jeans: You drop the jeans.', 'Shirt: You drop the shirt.', 'Coat: You drop the coat.', "Jumpsuit: You're wearing it."])
  test.assertCmd('remove jumpsuit', 'You take the jumpsuit off.')
  test.assertCmd('drop jumpsuit', 'You drop the jumpsuit.')
  test.assertCmd('get knife', 'You take the knife.')
  test.assertCmd('d', ['You head down.', 'The lounge', 'A smelly room with an old settee and a tv.', 'You can see a book, some boots, seven bricks, a cardboard box, a coin, a flashlight, a garage key, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater), a small key and a waterskin here.', 'You can go east, south, up or west.'])

  test.title('say')
  test.assertCmd('say hello', ["You say, 'Hello.'", 'No one seemed interested in what you say.'])
  w.Kyle.loc = 'dining_room'
  test.assertCmd('w', ['You head west.', 'The dining room', 'An old-fashioned room.', 'You can see a brick, a chair, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater) and Lara here.', 'You can go east, up or west.'])

  test.assertCmd('say hello', ["You say, 'Hello.'", "'Oh, hello there,' replies Lara.", "'Have you two met before?' asks Kyle."])
  test.assertCmd('say nothing', ["You say, 'Nothing.'", "'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'"])
  test.assertCmd('say nothing', ["You say, 'Nothing.'", "'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'"])
  test.assertCmd('say nothing', ["You say, 'Nothing.'", "'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'"])
  test.assertCmd('say yes', ["You say, 'Yes.'", "'Oh, cool,' says Kyle."])
  test.assertCmd('say hello', ["You say, 'Hello.'", 'No one seemed interested in what you say.'])

  test.title('ask')
  test.assertCmd('ask kyle about hats', ['You ask Kyle about hats.', 'Kyle has no interest in that subject.'])
  test.assertCmd('ask kyle about garden', ['You ask Kyle about garden.', "'Needs some work,' Kyle says with a sign."])
  test.assertCmd('ask kyle about garden', ['You ask Kyle about garden.', "'I'm giving up hope of it ever getting sorted,' Kyle says."])
  test.assertCmd('ask kyle about garden', ['You ask Kyle about garden.', "'I'm giving up hope of it ever getting sorted,' Kyle says."])
  w.garden.fixed = true
  test.assertCmd('ask kyle about garden', ['You ask Kyle about garden.', "'Looks much better now,' Kyle says with a grin."])
  test.assertCmd('topics', [/^Use TOPICS FOR/])
  test.assertCmd('topics kyle', ['Some suggestions for what to ask Kyle about: Garden; House; Park.'])
  w.Kyle.specialFlag = true
  test.assertCmd('topics kyle', ['Some suggestions for what to ask Kyle about: Fountain; Garden; House; Park.'])
  test.assertCmd('ask kyle about park', ['You ask Kyle about park.', "'Going to the park sounds like fun,' Kyle says with a grin. 'We can go on the swings!'"])
  test.assertCmd('topics kyle', ['Some suggestions for what to ask Kyle about: Fountain; Garden; House; Park; Swings.'])

  w.Kyle.loc = 'lounge'

  test.title('NPC commands 1')
  test.assertCmd('lara,get brick', "'I'm not picking up any bricks,' says Lara indignantly.")
  test.assertCmd('lara,e', "'I'm not going east,' says Lara indignantly. 'I don't like that room.'")
  test.menuResponseNumber = 1
  test.assertEqual(2, w.Lara.getTopics().length)
  test.assertCmd('speak to lara', "You tell Lara she looks very attractive. 'Why thank you!' she replies, smiling at last.")
  test.assertEqual(1, w.Lara.getTopics().length)
  test.assertCmd('lara,sit on chair', ['Lara sits on the chair.', 'The chair makes a strange noise when Lara sits on it.'])
  test.assertCmd('lara,stand up', 'Lara gets off the chair.')
  test.assertCmd('lara,sit on chair', ['Lara sits on the chair.', 'The chair makes a strange noise when Lara sits on it.'])

  test.assertCmd('l', ['The dining room', 'An old-fashioned room.', 'You can see a brick, a chair, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll) and Lara (sitting on the chair) here.', 'You can go east, up or west.'])

  w.Lara.canPosture = function () { msg('She is turned to stone.'); return false }
  test.assertCmd('lara, get off chair', 'She is turned to stone.')
  w.Lara.canPosture = function () { return true }
  test.assertCmd('lara, get off chair', 'Lara gets off the chair.')
  test.assertCmd('lara,sit on chair', ['Lara sits on the chair.', 'The chair makes a strange noise when Lara sits on it.'])
  test.assertCmd('lara,e', ['Lara gets off the chair.', 'Lara heads east.'])
  test.assertCmd('e', ['You head east.', 'The lounge', 'A smelly room with an old settee and a tv.', 'You can see a book, some boots, seven bricks, a cardboard box, a coin, a flashlight, a garage key, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater), Lara, a small key and a waterskin here.', 'You can go east, south, up or west.'])
  test.assertCmd('lara,get boots', 'Lara takes the boots.')
  test.assertCmd('lara,wear boots', "'I'm not doing that!' says Lara indignantly.")
  test.assertCmd('lara,drop boots', 'Lara drops the boots.')
  test.assertCmd('lara,w', 'Lara heads west.')

  test.title('NPC commands 2')
  test.assertCmd('boots,get coin', "You can tell the boots to do what you like, but there is no way they'll do it.")
  test.assertCmd('kyle,get coin', 'He tries to pick up the coin, but it just will not budge.')
  test.assertCmd('kyle,get knife', 'You have it.')
  test.assertCmd('kyle,get cabinet', "Kyle can't take it.")
  test.assertCmd('kyle,get cover', "Kyle can't take it; it's part of the book.")

  test.title('NPC commands (boots)')
  test.assertCmd('kyle, wear boots', "He doesn't have them.")
  test.assertCmd('kyle, remove boots', "He doesn't have them.")
  test.assertCmd('kyle, get boots', 'Kyle takes the boots.')
  test.assertCmd('kyle, get boots', 'Kyle has them.')
  test.assertCmd('kyle,give boots to box', 'Realistically, the cardboard box is not interested in anything he might give it.')
  test.assertCmd('kyle, get boots', 'Kyle has them.')
  test.assertCmd('kyle, wear boots', 'Kyle puts on the boots.')
  test.assertCmd('kyle, wear boots', "He's wearing them.")
  test.assertCmd('kyle, remove boots', 'Kyle takes the boots off.')
  test.assertCmd('kyle, put boots in box', 'Done.')

  test.title('NPC commands (book)')
  test.assertCmd('tell kyle to get the book', 'Kyle takes the book.')
  test.assertCmd('tell kyle to read the book', 'It is not in a language he understands.')
  test.assertCmd('tell kyle to drop the book', 'Kyle drops the book.')

  test.title('NPC commands (torch)')
  test.assertCmd('kyle, get torch', 'Kyle takes the flashlight.')
  test.assertEqual(false, w.flashlight.switchedon)
  test.assertCmd('kyle, turn on the torch', 'Kyle switches the flashlight on.')
  test.assertEqual(true, w.flashlight.switchedon)
  test.assertCmd('kyle, turn the torch off', 'Kyle switches the flashlight off.')
  test.assertEqual(false, w.flashlight.switchedon)
  test.assertCmd('kyle, drop torch', 'Kyle drops the flashlight.')

  test.title('NPC commands (go)')
  test.assertCmd('kyle, go ne', "Kyle can't go northeast.")
  test.assertCmd('kyle, go e', 'Kyle heads east.')
  test.assertCmd('kyle, get torch', "You can't see anything you might call 'kyle' here.")
  test.assertCmd('get torch', 'You take the flashlight.')
  test.assertCmd('get garage', 'You take the garage key.')
  test.assertCmd('e', ['You head east.', 'The kitchen', 'A clean room. There is a sink in the corner.', 'You can see a big kitchen table (with a jug on it), a camera, a clock, a garage door, Kyle (wearing a straw boater) and a trapdoor here.', 'You can go north or west.'])
  test.assertCmd('kyle,n', 'Kyle tries the garage door, but it is locked.')
  test.assertCmd('kyle,get all', ['Clock: Kyle takes the clock.', "Trapdoor: Kyle can't take it.", 'Camera: Kyle takes the camera.', "Big_kitchen_table: Kyle can't take it.", "Garage_door: Kyle can't take it.", 'Jug: Kyle takes the jug.'])
  test.assertCmd('kyle, drop picture box', 'Kyle drops the camera.')
  test.assertCmd('kyle, open trapdoor', 'Kyle opens the trapdoor.')
  test.assertCmd('kyle, down', 'You watch Kyle disappear through the trapdoor.')

  test.title('The charger')
  test.assertCmd('open garage', ['You unlock the garage door.', 'You open the garage door.'])
  test.assertCmd('n', ['The garage', 'An empty garage.', /You can see/, 'You can go south.'])
  test.assertCmd('x charger', 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is closed.')
  test.assertCmd('push button', 'You push the button, but nothing happens.')
  test.assertCmd('put torch in compartment', 'The compartment is closed.')
  test.assertCmd('x compartment', 'The compartment is just the right size for the torch. It is closed.')
  test.assertCmd('open compartment', 'You open the compartment.')
  test.assertCmd('x charger', 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is empty.')
  test.assertCmd('x compartment', 'The compartment is just the right size for the torch. It is open.')
  test.assertCmd('put torch in compartment', 'Done.')
  test.assertCmd('put key in compartment', 'The compartment is full.')
  test.assertCmd('x charger', 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment contains a flashlight.')
  test.assertCmd('push button', 'You push the button, but nothing happens.')
  test.assertCmd('close compartment', 'You close the compartment.')
  test.assertCmd('push button', 'You push the button. There is a brief hum of power, and a flash.')
  test.assertCmd('get torch', "You can't see anything you might call 'torch' here.")
  test.assertCmd('open compartment', 'You open the compartment.')
  test.assertCmd('get torch', 'You take the flashlight.')
  test.assertCmd('open compartment', 'It already is.')
  test.assertCmd('put knife in compartment', 'Done.')
  test.assertCmd('close compartment', 'You close the compartment.')
  test.assertCmd('push button', 'There is a loud bang, and the knife is destroyed.')
  test.assertCmd('open compartment', 'You open the compartment.')
  test.assertCmd('x charger', 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is empty.')

  test.title('Clone')
  const count = Object.keys(w).length
  const clone = cloneObject(w.book)
  test.assertEqual(count + 1, Object.keys(w).length)
  test.assertEqual(w.book, clone.clonePrototype)
  test.assertEqual(w.book.examine, clone.examine)
  const clone2 = cloneObject(clone)
  test.assertEqual(count + 2, Object.keys(w).length)
  test.assertEqual(w.book, clone2.clonePrototype)
  test.assertEqual(w.book.examine, clone2.examine)

  test.title('Save/Load 1')

  const sl1 = 'Some long string, with ~ all | sorts {} of! = stuff. In it^&*"'
  test.assertEqual(sl1, saveLoad.decodeString(saveLoad.encodeString(sl1)))
  const sl2 = ['Some long string, ', 'with ~ all | sorts {} of! = stuff.', ' In it^&*"']
  const sl3 = saveLoad.decodeArray(saveLoad.encodeArray(sl2))
  test.assertEqual(sl2[0], sl3[0])
  test.assertEqual(sl2[1], sl3[1])
  test.assertEqual(sl2[2], sl3[2])

  test.assertEqual('tst:number:14;', saveLoad.encode('tst', 14))
  test.assertEqual('', saveLoad.encode('tst', false))
  test.assertEqual('tst:boolean:true;', saveLoad.encode('tst', true))
  test.assertEqual('tst:string:14;', saveLoad.encode('tst', '14'))
  test.assertEqual('tst:qobject:book;', saveLoad.encode('tst', w.book))
  test.assertEqual('tst:array:14~12;', saveLoad.encode('tst', ['14', '12']))

  saveLoad.decode(w.far_away, 'one:number:14')
  test.assertEqual(14, w.far_away.one)
  saveLoad.decode(w.far_away, 'two:string:14')
  test.assertEqual('14', w.far_away.two)
  saveLoad.decode(w.far_away, 'three:boolean:true')
  test.assertEqual(true, w.far_away.three)
  saveLoad.decode(w.far_away, 'four:qobject:book')
  test.assertEqual(w.book, w.far_away.four)
  saveLoad.decode(w.far_away, 'five:array:14~12')
  test.assertEqual('14', w.far_away.five[0])
  // console.log(w.far_away.north)
  saveLoad.decode(w.far_away, 'north:exit:lounge:l:h')
  test.assertEqual(true, w.far_away.north.hidden)

  test.title('Save/Load 2')
  // Set up some changes to be saved
  w.boots.counter = 17
  w.boots.unusualString = 'Some interesting text'
  w.boots.notableFlag = true
  w.boots.examine = 'This will get saved'
  clone.cloneCounter = 29
  w.far_away.north.hidden = false
  w.far_away.north.locked = false
  const agendaCount = w.Arthur.agenda.length
  test.assertEqual(0, w.Arthur.followers.length)
  const s = saveLoad.saveTheWorld('Comment!!!')
  // Now change them again, these changes should get over-written
  w.boots.counter = 42
  w.boots.unusualString = 'Some boring text'
  w.boots.notableFlag = false
  w.boots.examine = 'This will not remain'
  const clone3 = cloneObject(clone) // should not be there later
  w.far_away.north.locked = true
  saveLoad.loadTheWorld(s, 4)
  test.assertEqual(count + 2, Object.keys(w).length)
  test.assertEqual(17, w.boots.counter)
  test.assertEqual('Some interesting text', w.boots.unusualString)
  test.assertEqual(true, w.boots.notableFlag)
  test.assertEqual('This will get saved', w.boots.examine)
  test.assertEqual(agendaCount, w.Arthur.agenda.length)
  test.assertEqual(0, w.Arthur.followers.length)
  test.assertEqual(29, w[clone.name].cloneCounter)
  test.assertEqual(false, w.far_away.north.locked)
  test.assertEqual(false, w.far_away.north.hidden)

  test.title('Path finding')
  test.assertEqual('lounge', formatList(agenda.findPath(w.dining_room, w.lounge)))
  test.assertEqual('', formatList(agenda.findPath(w.dining_room, w.dining_room)))
  test.assertEqual(false, agenda.findPath(w.dining_room, w.far_away))
  test.assertEqual('conservatory, dining room, lounge', formatList(agenda.findPath(w.garden, w.dining_room)))
  test.assertEqual(null, w.dining_room.findExit(w.far_away))
  test.assertEqual('east', w.dining_room.findExit(w.lounge).dir)
  test.assertCmd('s', ['The kitchen', 'A clean room. There is a sink in the corner.', /You can see/, 'You can go down, north or west.'])
  test.assertCmd('w', ['You head west.', 'The lounge', 'A smelly room with an old settee and a tv.', /^You can see/, 'You can go east, south, up or west.'])
  test.assertCmd('s', ['You head south.', 'The conservatory', 'A light airy room.', /You can see/, 'You can go north or west.'])
  test.assertCmd('w', ['You head west.', 'The garden', 'Very overgrown. The garden backs onto a shop to the west, whilst the conservatory is east.', 'You can see Arthur here.', 'You can go east or west.'])

  test.title('Agendas')
  test.assertCmd('talk to arthur', ["'Hey, wake up,' you say to Arthur.", "'What?' he says, opening his eyes. 'Oh, it's you.'"])
  test.assertCmd('talk to arthur', ["'Hey, wake up,' you say to Arthur.", "'I am awake!'"])
  test.assertCmd('talk to arthur', ["'Hey, wake up,' you say to Arthur."])
  test.assertCmd('talk to arthur', ["'Hey, wake up,' you say to Arthur.", "'Stop it!'"])
  test.assertCmd('talk to arthur', ["'Hey, wake up,' you say to Arthur.", "'Stop it!'"])
  test.assertEqual(0, w.Arthur.followers.length)
  test.assertCmd('z', ['You wait one turn.', 'Arthur stands up and stretches.'])
  test.assertCmd('e', ['You head east.', 'The conservatory', 'A light airy room.', /You can see/, 'You can go north or west.'])
  test.assertEqual(0, w.Arthur.followers.length)
  test.assertCmd('z', ['You wait one turn.', 'Arthur enters the conservatory from the west.'])
  test.assertCmd('n', ['You head north.', 'The lounge', 'A smelly room with an old settee and a tv.', /^You can see/, 'You can go east, south, up or west.', 'Arthur enters the lounge from the south.'])
  test.assertCmd('w', ['You head west.', 'The dining room', 'An old-fashioned room.', /^You can see/, 'You can go east, up or west.', 'Arthur enters the dining room from the east.', "'Hi, Lara,' says Arthur. 'Come look at the garden.'"])
  test.assertEqual(0, w.Arthur.followers.length)
  test.assertCmd('z', ['You wait one turn.', "'Sure,' says Lara."])
  test.assertEqual(1, w.Arthur.followers.length)
  test.assertCmd('z', ['You wait one turn.', 'Arthur and Lara leave the dining room, heading east.'])
  test.assertCmd('z', ['You wait one turn.'])
  test.assertCmd('z', ['You wait one turn.', 'Through the window you can see Arthur and Lara enter the garden from the east.', 'Through the window you see Arthur say something to Lara.'])

  test.title('Transit')
  test.assertCmd('w', ['You head west.', 'The lift', 'A curious lift.', 'You can see a Button: G, a Button: 1 and a Button: 2 here.', 'You can go east.'])
  test.assertCmd('push button: g', ["You're already there mate!"])
  test.assertCmd('push 1', ['You press the button; the door closes and the lift heads to the first floor. The door opens again.'])
  test.assertCmd('e', ['You head east.', 'The bedroom', 'A large room, with a big bed and a wardrobe.', 'You can see a coat, some jeans, a jumpsuit, a shirt, underwear and a wardrobe here.', 'You can go down, in or west.'])
  test.assertCmd('w', ['You head west.', 'The lift', 'A curious lift.', 'You can see a Button: G, a Button: 1 and a Button: 2 here.', 'You can go east.'])
  w.lift.transitOnMove = function (toLoc, fromLoc) { msg('MOVING to ' + toLoc + ' from ' + fromLoc) }
  test.assertCmd('push 1', ['You press the button; nothing happens.'])
  test.assertCmd('push 2', ['That does nothing, the button does not work.'])
  test.assertCmd('push g', ['The old man presses the button....', 'MOVING to dining_room from bedroom'])
  test.assertCmd('e', ['You head east.', 'The dining room', 'An old-fashioned room.', /^You can see/, 'You can go east, up or west.'])
  w.lift.transitCheck = function () {
    msg('The lift is out of order')
    return false
  }
  w.lift.transitAutoMove = true
  w.lift.afterEnter = transitOfferMenu
  test.assertCmd('w', ['You head west.', 'The lift', 'A curious lift.', 'You can see a Button: G, a Button: 1 and a Button: 2 here.', 'You can go east.', 'The lift is out of order', 'The dining room', 'An old-fashioned room.', 'You can see a brick, a chair and a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll) here.', 'You can go east, up or west.'])

  test.title('Push')
  test.assertCmd('e', ['You head east.', 'The lounge', 'A smelly room with an old settee and a tv.', 'You can see a book, a book, a book, seven bricks, a cardboard box (containing some boots), a coin, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), a small key and a waterskin here.', 'You can go east, south, up or west.'])
  test.assertCmd('s', ['You head south.', 'The conservatory', 'A light airy room.', 'You can see a broken chair and a crate here.', 'You can go north or west.'])
  test.assertCmd('push crate', "That's not going to do anything useful.")
  test.assertCmd('push chair s', "It's not something you can move around like that.")
  w.broken_chair.shift = function () { msg('You try to push chair, but it just breaks even more.'); return false }
  w.broken_chair.shiftable = true
  test.assertCmd('push chair w', 'You try to push chair, but it just breaks even more.')
  test.assertCmd('push crate s', "You can't go south.")
  test.assertCmd('push crate w', 'You push the crate west.')

  test.title('ensemble')
  world.setRoom(game.player, 'wardrobe', 'suppress')
  test.assertCmd('l', ['The wardrobe', 'Oddly empty of fantasy worlds.', 'You can see a suit here.', 'You can go out.'])
  test.assertCmd('get trousers', ['You take the suit trousers.'])
  test.assertCmd('l', ['The wardrobe', 'Oddly empty of fantasy worlds.', 'You can see a jacket and a waistcoat here.', 'You can go out.'])
  test.assertCmd('i', ['You are carrying a flashlight, a garage key and some suit trousers.'])
  test.assertCmd('get jacket, waistcoat', ['Jacket: You take the jacket.', 'Waistcoat: You take the waistcoat.'])
  test.assertCmd('i', ['You are carrying a flashlight, a garage key and a suit.'])
  test.assertCmd('drop suit', ['You drop the suit.'])
  test.assertCmd('get suit', ['You take the suit.'])
  test.assertCmd('wear xyz', ['Individual parts of an ensemble must be worn and removed separately.'])
  test.assertCmd('wear trousers', ['You put on the suit trousers.'])
  test.assertCmd('i', ['You are carrying a flashlight, a garage key, a jacket, some suit trousers (worn) and a waistcoat.'])
  test.assertCmd('wear jacket', ['You put on the jacket.'])
  test.assertCmd('wear waistcoat', ["You can't put a waistcoat on over your jacket."])
  test.assertCmd('doff jacket', ['You take the jacket off.'])
  test.assertCmd('wear waistcoat', ['You put on the waistcoat.'])
  test.assertCmd('wear jacket', ['You put on the jacket.'])
  test.assertCmd('i', ['You are carrying a flashlight, a garage key and a suit (worn).'])

  test.title('pre-shop')
  test.assertCmd('o', ['You head out.', 'The bedroom', 'A large room, with a big bed and a wardrobe.', 'You can see a coat, some jeans, a jumpsuit, a shirt, underwear and a wardrobe here.', 'You can go down, in or west.'])
  test.assertCmd('d', ['You head down.', 'The lounge', 'A smelly room with an old settee and a tv.', 'You can see a book, a book, a book, seven bricks, a cardboard box (containing some boots), a coin, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), a small key and a waterskin here.', 'You can go east, south, up or west.'])
  test.assertCmd('s', ['You head south.', 'The conservatory', 'A light airy room.', 'You can see a broken chair here.', 'You can go north or west.'])
  test.assertCmd('w', ['You head west.', 'The garden', 'Very overgrown. The garden backs onto a shop to the west, whilst the conservatory is east.', 'You can see Arthur, a crate and Lara here.', 'You can go east or west.'])
  test.assertCmd('w', ['You head west.', 'The shop', 'A funny little shop.', 'You can go east.'])
  w.me.money = 20

  test.title('shop - text processor')
  test.assertEqual('The carrot is $0,02', processText('The carrot is {money:carrot}'))
  test.assertEqual('The carrot is $0,02', processText('The carrot is {$:carrot}'))
  test.assertEqual('You see $0,12', processText('You see {$:12}'))
  test.assertEqual('The carrot is $0,02', processText('{nm:item:the:true} is {$:carrot}', { item: w.carrot }))
  test.assertEqual('The carrot is $0,02', processText('{nm:item:the:true} is {$:carrot}', { item: 'carrot' }))

  test.title('shop - buy')
  test.assertEqual(true, parser.isForSale(w.carrot))
  test.assertEqual(true, parser.isForSale(w.trophy))
  test.assertEqual(undefined, parser.isForSale(w.flashlight))
  test.assertCmd('buy carrot', ['You buy the carrot for $0,02.'])

  test.assertEqual(false, parser.isForSale(w.carrot0))
  test.assertEqual(false, w.carrot0.isForSale(game.player.loc))
  test.assertCmd('buy carrot', ['You buy the carrot for $0,02.'])
  test.assertEqual(16, w.me.money)
  test.assertCmd('buy flashlight', ["You can't buy it."])
  test.assertCmd('buy trophy', ['You buy the trophy for $0,15.'])
  test.assertEqual(1, w.me.money)
  test.assertEqual(true, parser.isForSale(w.carrot))
  // console.log("----------------------");
  test.assertEqual(false, parser.isForSale(w.trophy))
  test.assertCmd('buy trophy', ["You can't buy the trophy here - probably because you are already holding it."])
  test.assertCmd('buy carrot', ["You can't afford the carrot (need $0,02)."])
  test.assertEqual(1, w.me.money)

  delete w.carrot0.loc

  test.title('shop - sell')
  test.assertCmd('sell carrot', ["You can't sell the carrot here."])
  test.assertEqual(1, w.me.money)
  test.assertCmd('sell trophy', ['You sell the trophy for $0,08.'])
  test.assertEqual(9, w.me.money)

  test.assertCmd('sell trophy', ["You don't have it."])
  test.assertEqual(9, w.me.money)
  w.me.money = 20
  w.shop.sellingDiscount = 20
  test.assertEqual(12, w.trophy.getBuyingPrice(w.me))

  test.assertCmd('buy trophy', ['You buy the trophy for $0,12.'])
  test.assertEqual(8, w.me.money)
  w.shop.buyingValue = 80
  test.assertCmd('sell trophy', ['You sell the trophy for $0,12.'])
  test.assertEqual(20, w.me.money)

  test.title('vessels and liquids')
  game.player.loc = 'kitchen'
  w.jug.loc = 'big_kitchen_table'
  game.update()
  test.assertCmd('get jug', ['You take the jug.'])
  test.assertCmd('fill jug with tears', ["You can't see anything you might call 'tears' here."])
  test.assertCmd('fill jug with honey', ["There's no honey here."])
  test.assertCmd('fill jug with water', ['You fill the jug.'])
  test.assertCmd('fill jug with water', ['It already is.'])
  test.assertCmd('fill jug with lemonade', ["It's not something you can mix liquids in."])

  /* */
}
