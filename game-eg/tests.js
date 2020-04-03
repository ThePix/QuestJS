'use strict'
import { util, parser, w, game, text, lang, settings, io, world, saveLoad, npc } from '../lib/main'
util.test.tests = function () {
  util.test.title('parser.scoreObjectMatch')
  util.test.assertEqual(70, parser.scoreObjectMatch('me', w.me, ''))
  util.test.assertEqual(-1, parser.scoreObjectMatch('me fkh', w.me, ''))
  util.test.assertEqual(-1, parser.scoreObjectMatch('xme', w.me, ''))
  util.test.assertEqual(70, parser.scoreObjectMatch('flashlight', w.flashlight, ''))
  util.test.assertEqual(16, parser.scoreObjectMatch('f', w.flashlight, ''))
  util.test.assertEqual(18, parser.scoreObjectMatch('fla', w.flashlight, ''))
  util.test.assertEqual(60, parser.scoreObjectMatch('torch', w.flashlight, ''))
  util.test.assertEqual(70, parser.scoreObjectMatch('glass cabinet', w.glass_cabinet, ''))
  util.test.assertEqual(50, parser.scoreObjectMatch('glass', w.glass_cabinet, ''))
  util.test.assertEqual(50, parser.scoreObjectMatch('cabinet', w.glass_cabinet, ''))
  util.test.assertEqual(3, parser.scoreObjectMatch('cab', w.glass_cabinet, ''))

  util.test.title('util.sentenCecase')
  util.test.assertEqual('Simple text', util.sentenCecase('simple text'))

  util.test.title('byname')
  util.test.assertEqual('book', w.book.byname())
  util.test.assertEqual('the book', w.book.byname({ article: util.DEFINITE }))
  util.test.assertEqual('A book', w.book.byname({ article: util.INDEFINITE, capital: true }))
  util.test.assertEqual('you', w.me.byname())
  util.test.assertEqual('You', w.me.byname({ article: util.INDEFINITE, capital: true }))

  util.test.title('util.randomFromArray')
  const ary = ['one', 'two', 'three']
  const ary2 = []
  for (let i = 0; i < 3; i++) {
    const res = util.randomFromArray(ary, true)
    if (ary2.includes(res)) util.test.fail('ary2 lang.already has that value')
    ary2.push(res)
  }
  util.test.assertEqual(0, ary.length)

  util.test.title('util.arrayCompare')
  util.test.assertEqual(false, util.arrayCompare([1, 2, 4, 6, 7], [1, 2, 3]))
  util.test.assertEqual(true, util.arrayCompare([1, 2, 4], [1, 2, 4]))
  util.test.assertEqual(false, util.arrayCompare([w.coin, w.boots, w.ring], [w.boots, w.ring]))
  util.test.assertEqual(true, util.arrayCompare([w.boots, w.ring], [w.boots, w.ring]))

  util.test.title('util.arraySubtract')
  util.test.assertEqual([4, 6, 7], util.arraySubtract([1, 2, 4, 6, 7], [1, 2, 3]))
  util.test.assertEqual(['4', '6', '7'], util.arraySubtract(['1', '2', '4', '6', '7'], ['1', '2', '3']))
  util.test.assertEqual([w.coin, w.boots], util.arraySubtract([w.coin, w.boots, w.ring], [w.ring]))

  util.test.title('Text processor 1')
  util.test.assertEqual('Simple text', text.processText('Simple text'))
  util.test.assertEqual('Simple <i>text</i>', text.processText('Simple {i:text}'))
  util.test.assertEqual('Simple <span style="color:red">text</span>.', text.processText('Simple {colour:red:text}.'))
  util.test.assertEqual('Simple <span style="color:red">text with <i>nesting</i></span>.', text.processText('Simple {colour:red:text with {i:nesting}}.'))
  util.test.assertEqual('Simple text', text.processText('Simple {random:text}'))
  util.test.assertEqual('Simple text: no', text.processText('Simple text: {if:player:someOddAtt:yes:no}'))
  game.player.someOddAtt = 67
  util.test.assertEqual('Simple text: 67', text.processText('Simple text: {show:player:someOddAtt}'))

  util.test.title('Text processor 2')
  util.test.assertEqual('Simple text: no', text.processText('Simple text: {if:player:someOddAtt:50:yes:no}'))
  util.test.assertEqual('Simple text: yes', text.processText('Simple text: {if:player:someOddAtt:67:yes:no}'))
  util.test.assertEqual('Simple text: ', text.processText('Simple text: {if:player:someOddAtt:50:yes}'))
  util.test.assertEqual('Simple text: yes', text.processText('Simple text: {if:player:someOddAtt:67:yes}'))
  util.test.assertEqual('Simple text: yes', text.processText('Simple text: {ifMoreThan:player:someOddAtt:50:yes:no}'))
  util.test.assertEqual('Simple text: no', text.processText('Simple text: {ifLessThan:player:someOddAtt:50:yes:no}'))
  util.test.assertEqual('Simple text: ', text.processText('Simple text: {ifLessThan:player:someOddAtt:50:yes}'))
  game.player.someOddAtt = true
  util.test.assertEqual('Simple text: true', text.processText('Simple text: {show:player:someOddAtt}'))
  util.test.assertEqual('Simple text: yes', text.processText('Simple text: {if:player:someOddAtt:yes:no}'))
  util.test.assertEqual('Simple text: no', text.processText('Simple text: {ifNot:player:someOddAtt:yes:no}'))
  util.test.assertEqual('Simple text: seen first time only', text.processText('Simple text: {once:seen first time only}{notOnce:other times}'))

  util.test.title('Text processor 3')
  util.test.assertEqual('Simple text: other times', text.processText('Simple text: {once:seen first time only}{notOnce:other times}'))
  util.test.assertEqual('Simple text: other times', text.processText('Simple text: {once:seen first time only}{notOnce:other times}'))
  util.test.assertEqual('Simple text: p2=red', text.processText('Simple text: p2={param:p2}', { p1: 'yellow', p2: 'red' }))
  w.book.func1 = function () { return 'util.test1' }
  w.book.func2 = function (a, b) { return 'util.test2(' + a + ', ' + b + ')' }
  w.book.func3 = function (a) { return 'It is ' + w[a].alias + ' reading the book.' }
  util.test.assertEqual('Simple text: p2=util.test1', text.processText('Simple text: p2={param:item:func1}', { item: 'book' }))
  util.test.assertEqual('Simple text: p2=util.test2(one, two)', text.processText('Simple text: p2={param:item:func2:one:two}', { item: 'book' }))
  util.test.assertEqual('Simple text: p2=It is Kyle reading the book.', text.processText('Simple text: p2={param:item:func3:char}', { item: 'book', char: 'Kyle' }))

  util.test.title('Text processor 4')
  util.test.assertEqual('Kyle is a bear.', text.processText('{nv:chr:be} a bear.', { chr: 'Kyle' }))
  util.test.assertEqual('Kyle is a bear.', text.processText('{nv:chr:be} a bear.', { chr: w.Kyle }))
  util.test.assertEqual('Kyle is your bear.', text.processText('{nv:Kyle:be} {pa:me} bear.'))
  util.test.assertEqual('Kyle is her bear.', text.processText('{nv:Kyle:be} {pa:Lara} bear.'))
  util.test.assertEqual('There is Kyle.', text.processText('There is {nm:chr:a}.', { chr: w.Kyle }))
  util.test.assertEqual('There is a book.', text.processText('There is {nm:chr:a}.', { chr: w.book }))
  util.test.assertEqual('Kyle is here.', text.processText('{nm:chr:the:true} is here.', { chr: w.Kyle }))
  util.test.assertEqual('The book is here.', text.processText('{nm:chr:the:true} is here.', { chr: w.book }))
  util.test.assertEqual('It is your book.', text.processText('It is {nms:chr:the} book.', { chr: game.player }))
  util.test.assertEqual("It is Kyle's book.", text.processText('It is {nms:chr:the} book.', { chr: w.Kyle }))

  util.test.title('Text processor 5')
  util.test.assertEqual('Kyle is a bear.', text.processText('{Kyle.alias} is a bear.'))
  util.test.assertEqual('Kyle is a bear.', text.processText('{show:Kyle:alias} is a bear.'))
  util.test.assertEqual('Kyle is a bear.', text.processText('{Kyle:alias} is a bear.'))
  util.test.assertEqual('You have $10.', text.processText('You have ${show:me:money}.')) // -LOOKATME I finally found the reason of some of the garbage!
  util.test.assertEqual('You have $10.', text.processText('You have ${player.money}.')) // -LOOKATME and now that I look at it, I realise it's still UTTER GARBAGE!
  util.test.assertEqual('You have $10.', text.processText('You have ${me.money}.')) // -LOOKATME     I finally found the reason of some of the garbage!
  util.test.assertEqual('You have $10.', text.processText('You have ${player.money}.')) // -LOOKATME and now that I look at it, I realise it's still UTTER GARBAGE!

  util.test.title('Numbers')
  util.test.assertEqual('fourteen', lang.toWords(14))
  util.test.assertEqual('minus four hundred and three', lang.toWords(-403))
  util.test.assertEqual('ninetyseven', lang.toWords(97))
  util.test.assertEqual('fourteenth', lang.toOrdinal(14))
  util.test.assertEqual('four hundred and third', lang.toOrdinal(403))
  util.test.assertEqual('ninetyfirst', lang.toOrdinal(91))
  util.test.assertEqual('get 4 sticks', lang.convertNumbers('get four sticks'))
  util.test.assertEqual('get 14 sticks', lang.convertNumbers('get fourteen sticks'))
  util.test.assertEqual('get no sticks', lang.convertNumbers('get no sticks'))
  util.test.assertEqual('ninetieth', lang.toOrdinal(90))

  util.test.title('Numbers 2')
  util.test.assertEqual('(012,34)', util.displayNumber(1234, '(3,2)'))
  util.test.assertEqual('$1234', util.util.displayMoney(1234))
  util.test.assertEqual('$-1234', util.util.displayMoney(-1234))
  settings.moneyFormat = '!3.2! credits'
  util.test.assertEqual('012.34 credits', util.util.displayMoney(1234))
  util.test.assertEqual('-012.34 credits', util.util.displayMoney(-1234))
  settings.moneyFormat = '!+3.2! credits'
  util.test.assertEqual('+012.34 credits', util.util.displayMoney(1234))
  util.test.assertEqual('-012.34 credits', util.util.displayMoney(-1234))
  settings.moneyFormat = game.moneyformat = '!$1,2!($1,2)!'
  util.test.assertEqual('$12,34', util.util.displayMoney(1234))
  util.test.assertEqual('($12,34)', util.util.displayMoney(-1234))

  util.test.title('util.getDir')
  util.test.assertEqual('out', util.getDir('o'))
  util.test.assertEqual('down', util.getDir('dn'))
  util.test.assertEqual('out', util.getDir('exit'))
  util.test.assertEqual(false, util.getDir('bo'))

  util.test.title('Look inside')
  util.test.assertCmd('look inside cabinet', 'Inside the glass cabinet you can see a jewellery box and an ornate doll.')
  util.test.assertCmd('look inside box', 'Inside the cardboard box you can see nothing.')
  util.test.assertCmd('look inside boots', "There's nothing to see inside.")
  util.test.assertCmd('look inside book', 'The book has pages and pages of text, but you do not even recongise the text.')

  util.test.title('Simple object commands')
  util.test.assertCmd('i', 'You are carrying a knife.')
  util.test.assertCmd('get coin', 'You try to pick up the coin, but it just will not budge.')
  util.test.assertCmd('get straw boater', 'Kyle has it.')
  util.test.assertCmd('get cabinet', "You can't take it.")
  util.test.assertCmd('get the cabinet', "You can't take it.")
  util.test.assertCmd('get a cabinet', "You can't take it.")
  util.test.assertCmd('get knife', 'You have it.')
  util.test.assertCmd('x tv', "It's just scenery.")
  util.test.assertCmd('get tv', "You can't take it.")
  util.test.assertCmd('give knife to boots', 'Realistically, the boots are not interested in anything you might give them.')

  util.test.title('Simple object commands (eat)')
  util.test.assertCmd('eat knife', "It's not something you can eat.")
  util.test.assertCmd('get sandwich', 'You take the sandwich.')
  util.test.assertCmd('drink sandwich', "It's not something you can drink.")
  util.test.assertCmd('ingest sandwich', ['You eat the sandwich.', 'That was Great!'])

  util.test.title('Simple object commands (boots)')
  util.test.assertCmd('wear boots', "You don't have them.")
  util.test.assertCmd('remove boots', "You don't have them.")
  util.test.assertCmd('get boots', 'You take the boots.')
  util.test.assertCmd('inv', 'You are carrying some boots and a knife.')
  util.test.assertCmd('get boots', 'You have them.')
  util.test.assertCmd('wear boots', 'You put on the boots.')
  util.test.assertCmd('inventory', 'You are carrying some boots (worn) and a knife.')
  util.test.assertCmd('wear boots', "You're wearing them.")
  util.test.assertCmd('remove boots', 'You take the boots off.')
  util.test.assertCmd('drop boots', 'You drop the boots.')

  util.test.title('Simple object commands (book)')
  util.test.assertCmd('get the book', 'You take the book.')
  util.test.assertCmd('read the book', 'It is not in a language you understand.')
  util.test.assertCmd('give it to kyle', 'Done.')
  util.test.assertCmd('kyle, read the book', 'It is not in a language he understands.')
  util.test.assertCmd('kyle, drop book', 'Kyle drops the book.')
  util.test.assertCmd('n', "You can't go north.")
  util.test.assertCmd('d', "You can't go down.")

  util.test.title('Simple object commands (bricks)')
  util.test.assertCmd('get the bricks', 'You take seven bricks.')
  util.test.assertCmd('drop 3 bricks', 'You drop three bricks.')
  util.test.assertCmd('inv', 'You are carrying four bricks and a knife.')
  util.test.assertCmd('drop 4 bricks', 'You drop four bricks.')
  util.test.assertCmd('inv', 'You are carrying a knife.')
  util.test.assertCmd('get 10 bricks', 'You take seven bricks.')
  util.test.assertCmd('e', ['You head east.', '#The kitchen', 'A clean room, a clock hanging on the wall. There is a sink in the corner.', 'You can see a big kitchen table (with a jug on it), a camera, a garage door and a trapdoor here.', 'You can go north or west.', 'A fresh smell here!'])
  util.test.assertCmd('put 2 bricks on to the table', 'Done.')
  util.test.assertCmd('inv', 'You are carrying five bricks and a knife.')
  util.test.assertCmd('look', ['#The kitchen', 'A clean room, a clock hanging on the wall. There is a sink in the corner.', 'You can see a big kitchen table (with two bricks and a jug on it), a camera, a garage door and a trapdoor here.', 'You can go north or west.'])
  util.test.assertCmd('get the bricks', 'You take two bricks.')
  util.test.assertCmd('get clock', 'You take the clock.')
  util.test.assertCmd('look', ['#The kitchen', 'A clean room. There is a sink in the corner.', 'You can see a big kitchen table (with a jug on it), a camera, a garage door and a trapdoor here.', 'You can go north or west.'])
  util.test.assertCmd('drop clock', 'You drop the clock.')
  util.test.assertCmd('look', ['#The kitchen', 'A clean room. There is a sink in the corner.', 'You can see a big kitchen table (with a jug on it), a camera, a clock, a garage door and a trapdoor here.', 'You can go north or west.'])
  util.test.assertCmd('w', ['You head west.', '#The lounge', 'A smelly room with an old settee and a tv.', 'You can see a book, some boots, a cardboard box, a coin, a flashlight, a garage key, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater), a small key and a waterskin here.', 'You can go east, south, up or west.'])

  util.test.title('Simple object commands (bricks and a box)')
  util.test.assertEqual(false, parser.isContained(w.brick))
  util.test.assertCmd('drop bricks in box', 'Done.')
  util.test.assertEqual(true, parser.isContained(w.brick))
  util.test.assertCmd('get bricks', 'You take seven bricks.')
  util.test.assertEqual(false, parser.isContained(w.brick))
  util.test.assertCmd('drop three bricks in box', 'Done.')
  util.test.assertEqual(true, parser.isContained(w.brick))
  util.test.assertCmd('drop bricks', 'You drop four bricks.')
  util.test.assertEqual(true, parser.isContained(w.brick))
  util.test.assertCmd('get bricks', 'You take four bricks.')
  util.test.assertEqual(true, parser.isContained(w.brick))
  util.test.assertCmd('get bricks', 'You take three bricks.')
  util.test.assertEqual(false, parser.isContained(w.brick))

  util.test.title('Simple object commands (bricks and a held box)')
  util.test.assertCmd('get box', 'You take the cardboard box.')
  util.test.assertCmd('drop bricks in box', 'Done.')
  util.test.assertCmd('get bricks from box', 'Done.')
  util.test.assertCmd('drop three bricks in box', 'Done.')
  util.test.assertCmd('drop bricks', 'You drop four bricks.')
  util.test.assertCmd('get bricks', 'You take four bricks.')
  util.test.assertCmd('get bricks', 'You take three bricks.')
  util.test.assertCmd('drop box', 'You drop the cardboard box.')

  util.test.title('Restricting')
  game.player.canTalk = function () { io.msg('You are gagged.'); return false }
  util.test.assertCmd('talk to kyle', 'You are gagged.')
  game.player.canTalk = function () { return true }
  game.player.canManipulate = function () { io.msg('You are handcuffed.'); return false }
  util.test.assertCmd('drop bricks', 'You are handcuffed.')
  game.player.canManipulate = function () { return true }
  util.test.assertCmd('drop bricks', 'You drop seven bricks.')

  util.test.title('Wear/remove')
  util.test.assertCmd('u', ['You head up.', '#The bedroom', 'A large room, with a big bed and a wardrobe.', 'You can see a coat, some jeans, a jumpsuit, a shirt, underwear and a wardrobe here.', 'You can go down, in or west.'])
  util.test.assertCmd('get all', ["Wardrobe: You can't take it.", 'Underwear: You take the underwear.', 'Jeans: You take the jeans.', 'Shirt: You take the shirt.', 'Coat: You take the coat.', 'Jumpsuit: You take the jumpsuit.'])
  util.test.assertCmd('wear underwear', 'You put on the underwear.')
  util.test.assertCmd('wear jeans', 'You put on the jeans.')
  util.test.assertCmd('wear shirt', 'You put on the shirt.')
  util.test.assertCmd('remove underwear', "You can't take off your underwear whilst wearing your jeans.")
  util.test.assertCmd('remove jeans', 'You take the jeans off.')
  util.test.assertCmd('remove underwear', 'You take the underwear off.')
  util.test.assertCmd('wear jumpsuit', "You can't put a jumpsuit on over your shirt.")
  util.test.assertCmd('remove shirt', 'You take the shirt off.')
  util.test.assertCmd('wear jumpsuit', 'You put on the jumpsuit.')
  util.test.assertCmd('wear coat', 'You put on the coat.')
  util.test.assertCmd('wear underwear', "You can't put underwear on over your jumpsuit.")
  util.test.assertCmd('remove coat', 'You take the coat off.')
  util.test.assertCmd('drop all', ['Knife: You drop the knife.', 'Underwear: You drop the underwear.', 'Jeans: You drop the jeans.', 'Shirt: You drop the shirt.', 'Coat: You drop the coat.', "Jumpsuit: You're wearing it."])
  util.test.assertCmd('remove jumpsuit', 'You take the jumpsuit off.')
  util.test.assertCmd('drop jumpsuit', 'You drop the jumpsuit.')
  util.test.assertCmd('get knife', 'You take the knife.')
  util.test.assertCmd('d', ['You head down.', '#The lounge', 'A smelly room with an old settee and a tv.', 'You can see a book, some boots, seven bricks, a cardboard box, a coin, a flashlight, a garage key, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater), a small key and a waterskin here.', 'You can go east, south, up or west.'])

  util.test.title('say')
  util.test.assertCmd('say hello', ["You say, 'Hello.'", 'No one seemed interested in what you say.'])
  w.Kyle.loc = 'dining_room'
  util.test.assertCmd('w', ['You head west.', '#The dining room', 'An old-fashioned room.', 'You can see a brick, a chair, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater) and Lara here.', 'You can go east, up or west.'])

  util.test.assertCmd('say hello', ["You say, 'Hello.'", "'Oh, hello there,' replies Lara.", "'Have you two met before?' asks Kyle."])
  util.test.assertCmd('say nothing', ["You say, 'Nothing.'", "'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'"])
  util.test.assertCmd('say nothing', ["You say, 'Nothing.'", "'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'"])
  util.test.assertCmd('say nothing', ["You say, 'Nothing.'", "'I don't know what that means,' says Kyle. 'It's a simple yes-no question.'"])
  util.test.assertCmd('say yes', ["You say, 'Yes.'", "'Oh, cool,' says Kyle."])
  util.test.assertCmd('say hello', ["You say, 'Hello.'", 'No one seemed interested in what you say.'])

  util.test.title('ask')
  util.test.assertCmd('ask kyle about hats', ['You ask Kyle about hats.', 'Kyle has no interest in that subject.'])
  util.test.assertCmd('ask kyle about garden', ['You ask Kyle about garden.', "'Needs some work,' Kyle says with a sign."])
  util.test.assertCmd('ask kyle about garden', ['You ask Kyle about garden.', "'I'm giving up hope of it ever getting sorted,' Kyle says."])
  util.test.assertCmd('ask kyle about garden', ['You ask Kyle about garden.', "'I'm giving up hope of it ever getting sorted,' Kyle says."])
  w.garden.fixed = true
  util.test.assertCmd('ask kyle about garden', ['You ask Kyle about garden.', "'Looks much better now,' Kyle says with a grin."])
  util.test.assertCmd('topics', [/^Use TOPICS FOR/])
  util.test.assertCmd('topics kyle', ['Some suggestions for what to ask Kyle about: Garden; House; Park.'])
  w.Kyle.specialFlag = true
  util.test.assertCmd('topics kyle', ['Some suggestions for what to ask Kyle about: Fountain; Garden; House; Park.'])
  util.test.assertCmd('ask kyle about park', ['You ask Kyle about park.', "'Going to the park sounds like fun,' Kyle says with a grin. 'We can go on the swings!'"])
  util.test.assertCmd('topics kyle', ['Some suggestions for what to ask Kyle about: Fountain; Garden; House; Park; Swings.'])

  w.Kyle.loc = 'lounge'

  util.test.title('NPC commands 1')
  util.test.assertCmd('lara,get brick', "'I'm not picking up any bricks,' says Lara indignantly.")
  util.test.assertCmd('lara,e', "'I'm not going east,' says Lara indignantly. 'I don't like that room.'")
  util.test.menuResponseNumber = 1
  util.test.assertEqual(2, w.Lara.getTopics().length)
  util.test.assertCmd('speak to lara', "You tell Lara she looks very attractive. 'Why thank you!' she replies, smiling at last.")
  util.test.assertEqual(1, w.Lara.getTopics().length)
  util.test.assertCmd('lara,sit on chair', ['Lara sits on the chair.', 'The chair makes a strange noise when Lara sits on it.'])
  util.test.assertCmd('lara,stand up', 'Lara gets off the chair.')
  util.test.assertCmd('lara,sit on chair', ['Lara sits on the chair.', 'The chair makes a strange noise when Lara sits on it.'])

  util.test.assertCmd('l', ['#The dining room', 'An old-fashioned room.', 'You can see a brick, a chair, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll) and Lara (sitting on the chair) here.', 'You can go east, up or west.'])

  w.Lara.canPosture = function () { io.msg('She is turned to stone.'); return false }
  util.test.assertCmd('lara, get off chair', 'She is turned to stone.')
  w.Lara.canPosture = function () { return true }
  util.test.assertCmd('lara, get off chair', 'Lara gets off the chair.')
  util.test.assertCmd('lara,sit on chair', ['Lara sits on the chair.', 'The chair makes a strange noise when Lara sits on it.'])
  util.test.assertCmd('lara,e', ['Lara gets off the chair.', 'Lara heads east.'])
  util.test.assertCmd('e', ['You head east.', '#The lounge', 'A smelly room with an old settee and a tv.', 'You can see a book, some boots, seven bricks, a cardboard box, a coin, a flashlight, a garage key, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), Kyle (wearing a straw boater), Lara, a small key and a waterskin here.', 'You can go east, south, up or west.'])
  util.test.assertCmd('lara,get boots', 'Lara takes the boots.')
  util.test.assertCmd('lara,wear boots', "'I'm not doing that!' says Lara indignantly.")
  util.test.assertCmd('lara,drop boots', 'Lara drops the boots.')
  util.test.assertCmd('lara,w', 'Lara heads west.')

  util.test.title('NPC commands 2')
  util.test.assertCmd('boots,get coin', "You can tell the boots to do what you like, but there is no way they'll do it.")
  util.test.assertCmd('kyle,get coin', 'He tries to pick up the coin, but it just will not budge.')
  util.test.assertCmd('kyle,get knife', 'You have it.')
  util.test.assertCmd('kyle,get cabinet', "Kyle can't take it.")
  util.test.assertCmd('kyle,get cover', "Kyle can't take it; it's part of the book.")

  util.test.title('NPC commands (boots)')
  util.test.assertCmd('kyle, wear boots', "He doesn't have them.")
  util.test.assertCmd('kyle, remove boots', "He doesn't have them.")
  util.test.assertCmd('kyle, get boots', 'Kyle takes the boots.')
  util.test.assertCmd('kyle, get boots', 'Kyle has them.')
  util.test.assertCmd('kyle,give boots to box', 'Realistically, the cardboard box is not interested in anything he might give it.')
  util.test.assertCmd('kyle, get boots', 'Kyle has them.')
  util.test.assertCmd('kyle, wear boots', 'Kyle puts on the boots.')
  util.test.assertCmd('kyle, wear boots', "He's wearing them.")
  util.test.assertCmd('kyle, remove boots', 'Kyle takes the boots off.')
  util.test.assertCmd('kyle, put boots in box', 'Done.')

  util.test.title('NPC commands (book)')
  util.test.assertCmd('tell kyle to get the book', 'Kyle takes the book.')
  util.test.assertCmd('tell kyle to read the book', 'It is not in a language he understands.')
  util.test.assertCmd('tell kyle to drop the book', 'Kyle drops the book.')

  util.test.title('NPC commands (torch)')
  util.test.assertCmd('kyle, get torch', 'Kyle takes the flashlight.')
  util.test.assertEqual(false, w.flashlight.switchedon)
  util.test.assertCmd('kyle, turn on the torch', 'Kyle switches the flashlight on.')
  util.test.assertEqual(true, w.flashlight.switchedon)
  util.test.assertCmd('kyle, turn the torch off', 'Kyle switches the flashlight off.')
  util.test.assertEqual(false, w.flashlight.switchedon)
  util.test.assertCmd('kyle, drop torch', 'Kyle drops the flashlight.')

  util.test.title('NPC commands (go)')
  util.test.assertCmd('kyle, go ne', "Kyle can't go northeast.")
  util.test.assertCmd('kyle, go e', 'Kyle heads east.')
  util.test.assertCmd('kyle, get torch', "You can't see anything you might call 'kyle' here.")
  util.test.assertCmd('get torch', 'You take the flashlight.')
  util.test.assertCmd('get garage', 'You take the garage key.')
  util.test.assertCmd('e', ['You head east.', '#The kitchen', 'A clean room. There is a sink in the corner.', 'You can see a big kitchen table (with a jug on it), a camera, a clock, a garage door, Kyle (wearing a straw boater) and a trapdoor here.', 'You can go north or west.'])
  util.test.assertCmd('kyle,n', 'Kyle tries the garage door, but it is locked.')
  util.test.assertCmd('kyle,get all', ['Clock: Kyle takes the clock.', "Trapdoor: Kyle can't take it.", 'Camera: Kyle takes the camera.', "Big_kitchen_table: Kyle can't take it.", "Garage_door: Kyle can't take it.", 'Jug: Kyle takes the jug.'])
  util.test.assertCmd('kyle, drop picture box', 'Kyle drops the camera.')
  util.test.assertCmd('kyle, open trapdoor', 'Kyle opens the trapdoor.')
  util.test.assertCmd('kyle, down', 'You watch Kyle disappear through the trapdoor.')

  util.test.title('The charger')
  util.test.assertCmd('open garage', ['You unlock the garage door.', 'You open the garage door.'])
  util.test.assertCmd('n', ['#The garage', 'An empty garage.', /You can see/, 'You can go south.'])
  util.test.assertCmd('x charger', 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is closed.')
  util.test.assertCmd('push button', 'You push the button, but nothing happens.')
  util.test.assertCmd('put torch in compartment', 'The compartment is closed.')
  util.test.assertCmd('x compartment', 'The compartment is just the right size for the torch. It is closed.')
  util.test.assertCmd('open compartment', 'You open the compartment.')
  util.test.assertCmd('x charger', 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is empty.')
  util.test.assertCmd('x compartment', 'The compartment is just the right size for the torch. It is open.')
  util.test.assertCmd('put torch in compartment', 'Done.')
  util.test.assertCmd('put key in compartment', 'The compartment is full.')
  util.test.assertCmd('x charger', 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment contains a flashlight.')
  util.test.assertCmd('push button', 'You push the button, but nothing happens.')
  util.test.assertCmd('close compartment', 'You close the compartment.')
  util.test.assertCmd('push button', 'You push the button. There is a brief hum of power, and a flash.')
  util.test.assertCmd('get torch', "You can't see anything you might call 'torch' here.")
  util.test.assertCmd('open compartment', 'You open the compartment.')
  util.test.assertCmd('get torch', 'You take the flashlight.')
  util.test.assertCmd('open compartment', 'It lang.already is.')
  util.test.assertCmd('put knife in compartment', 'Done.')
  util.test.assertCmd('close compartment', 'You close the compartment.')
  util.test.assertCmd('push button', 'There is a loud bang, and the knife is destroyed.')
  util.test.assertCmd('open compartment', 'You open the compartment.')
  util.test.assertCmd('x charger', 'A device bigger than a washing machine to charge a torch? It has a compartment and a button. The compartment is empty.')

  util.test.title('Clone')
  const count = Object.keys(w).length
  const clone = world.cloneObject(w.book)
  util.test.assertEqual(count + 1, Object.keys(w).length)
  util.test.assertEqual(w.book, clone.clonePrototype)
  util.test.assertEqual(w.book.examine, clone.examine)
  const clone2 = world.cloneObject(clone)
  util.test.assertEqual(count + 2, Object.keys(w).length)
  util.test.assertEqual(w.book, clone2.clonePrototype)
  util.test.assertEqual(w.book.examine, clone2.examine)

  util.test.title('Save/Load 1')

  const sl1 = 'Some long string, with ~ all | sorts {} of! = stuff. In it^&*"'
  util.test.assertEqual(sl1, saveLoad.decodeString(saveLoad.encodeString(sl1)))
  const sl2 = ['Some long string, ', 'with ~ all | sorts {} of! = stuff.', ' In it^&*"']
  const sl3 = saveLoad.decodeArray(saveLoad.encodeArray(sl2))
  util.test.assertEqual(sl2[0], sl3[0])
  util.test.assertEqual(sl2[1], sl3[1])
  util.test.assertEqual(sl2[2], sl3[2])

  util.test.assertEqual('tst:number:14;', saveLoad.encode('tst', 14))
  util.test.assertEqual('', saveLoad.encode('tst', false))
  util.test.assertEqual('tst:boolean:true;', saveLoad.encode('tst', true))
  util.test.assertEqual('tst:string:14;', saveLoad.encode('tst', '14'))
  util.test.assertEqual('tst:qobject:book;', saveLoad.encode('tst', w.book))
  util.test.assertEqual('tst:array:14~12;', saveLoad.encode('tst', ['14', '12']))

  saveLoad.decode(w.far_away, 'one:number:14')
  util.test.assertEqual(14, w.far_away.one)
  saveLoad.decode(w.far_away, 'two:string:14')
  util.test.assertEqual('14', w.far_away.two)
  saveLoad.decode(w.far_away, 'three:boolean:true')
  util.test.assertEqual(true, w.far_away.three)
  saveLoad.decode(w.far_away, 'four:qobject:book')
  util.test.assertEqual(w.book, w.far_away.four)
  saveLoad.decode(w.far_away, 'five:array:14~12')
  util.test.assertEqual('14', w.far_away.five[0])
  // console.log(w.far_away.north)
  saveLoad.decode(w.far_away, 'north:exit:lounge:l:h')
  util.test.assertEqual(true, w.far_away.north.hidden)

  util.test.title('Save/Load 2')
  // Set up some changes to be saved
  w.boots.counter = 17
  w.boots.unusualString = 'Some interesting text'
  w.boots.notableFlag = true
  w.boots.examine = 'This will get saved'
  clone.cloneCounter = 29
  w.far_away.north.hidden = false
  w.far_away.north.locked = false
  const agendaCount = w.Arthur.agenda.length
  util.test.assertEqual(0, w.Arthur.followers.length)
  const s = saveLoad.saveTheWorld('Comment!!!')
  // Now change them again, these changes should get over-written
  w.boots.counter = 42
  w.boots.unusualString = 'Some boring text'
  w.boots.notableFlag = false
  w.boots.examine = 'This will not remain'
  const clone3 = world.cloneObject(clone) // should not be there later // -review: it's never there... "clone3" is not referenced again
  w.far_away.north.locked = true
  saveLoad.loadTheWorld(s, 4)
  util.test.assertEqual(count + 2, Object.keys(w).length)
  util.test.assertEqual(17, w.boots.counter)
  util.test.assertEqual('Some interesting text', w.boots.unusualString)
  util.test.assertEqual(true, w.boots.notableFlag)
  util.test.assertEqual('This will get saved', w.boots.examine)
  util.test.assertEqual(agendaCount, w.Arthur.agenda.length)
  util.test.assertEqual(0, w.Arthur.followers.length)
  util.test.assertEqual(29, w[clone.name].cloneCounter)
  util.test.assertEqual(false, w.far_away.north.locked)
  util.test.assertEqual(false, w.far_away.north.hidden)

  util.test.title('Path finding')
  util.test.assertEqual('lounge', util.formatList(npc.agenda.findPath(w.dining_room, w.lounge)))
  util.test.assertEqual('', util.formatList(npc.agenda.findPath(w.dining_room, w.dining_room)))
  util.test.assertEqual(false, npc.agenda.findPath(w.dining_room, w.far_away))
  util.test.assertEqual('conservatory, dining room, lounge', util.formatList(npc.agenda.findPath(w.garden, w.dining_room)))
  util.test.assertEqual(null, w.dining_room.findExit(w.far_away))
  util.test.assertEqual('east', w.dining_room.findExit(w.lounge).dir)
  util.test.assertCmd('s', ['#The kitchen', 'A clean room. There is a sink in the corner.', /You can see/, 'You can go down, north or west.'])
  util.test.assertCmd('w', ['You head west.', '#The lounge', 'A smelly room with an old settee and a tv.', /^You can see/, 'You can go east, south, up or west.'])
  util.test.assertCmd('s', ['You head south.', '#The conservatory', 'A light airy room.', /You can see/, 'You can go north or west.'])
  util.test.assertCmd('w', ['You head west.', '#The garden', 'Very overgrown. The garden backs onto a shop to the west, whilst the conservatory is east.', 'You can see Arthur here.', 'You can go east or west.'])

  util.test.title('Agendas')
  util.test.assertCmd('talk to arthur', ["'Hey, wake up,' you say to Arthur.", "'What?' he says, opening his eyes. 'Oh, it's you.'"])
  util.test.assertCmd('talk to arthur', ["'Hey, wake up,' you say to Arthur.", "'I am awake!'"])
  util.test.assertCmd('talk to arthur', ["'Hey, wake up,' you say to Arthur."])
  util.test.assertCmd('talk to arthur', ["'Hey, wake up,' you say to Arthur.", "'Stop it!'"])
  util.test.assertCmd('talk to arthur', ["'Hey, wake up,' you say to Arthur.", "'Stop it!'"])
  util.test.assertEqual(0, w.Arthur.followers.length)
  util.test.assertCmd('z', ['You wait one turn.', 'Arthur stands up and stretches.'])
  util.test.assertCmd('e', ['You head east.', '#The conservatory', 'A light airy room.', /You can see/, 'You can go north or west.'])
  util.test.assertEqual(0, w.Arthur.followers.length)
  util.test.assertCmd('z', ['You wait one turn.', 'Arthur enters the conservatory from the west.'])
  util.test.assertCmd('n', ['You head north.', '#The lounge', 'A smelly room with an old settee and a tv.', /^You can see/, 'You can go east, south, up or west.', 'Arthur enters the lounge from the south.'])
  util.test.assertCmd('w', ['You head west.', '#The dining room', 'An old-fashioned room.', /^You can see/, 'You can go east, up or west.', 'Arthur enters the dining room from the east.', "'Hi, Lara,' says Arthur. 'Come look at the garden.'"])
  util.test.assertEqual(0, w.Arthur.followers.length)
  util.test.assertCmd('z', ['You wait one turn.', "'Sure,' says Lara."])
  util.test.assertEqual(1, w.Arthur.followers.length)
  util.test.assertCmd('z', ['You wait one turn.', 'Arthur and Lara leave the dining room, heading east.'])
  util.test.assertCmd('z', ['You wait one turn.'])
  util.test.assertCmd('z', ['You wait one turn.', 'Through the window you can see Arthur and Lara enter the garden from the east.', 'Through the window you see Arthur say something to Lara.'])

  util.test.title('Transit')
  util.test.assertCmd('w', ['You head west.', '#The lift', 'A curious lift.', 'You can see a Button: G, a Button: 1 and a Button: 2 here.', 'You can go east.'])
  util.test.assertCmd('push button: g', ["You're lang.already there mate!"])
  util.test.assertCmd('push 1', ['You press the button; the door closes and the lift heads to the first floor. The door opens again.'])
  util.test.assertCmd('e', ['You head east.', '#The bedroom', 'A large room, with a big bed and a wardrobe.', 'You can see a coat, some jeans, a jumpsuit, a shirt, underwear and a wardrobe here.', 'You can go down, in or west.'])
  util.test.assertCmd('w', ['You head west.', '#The lift', 'A curious lift.', 'You can see a Button: G, a Button: 1 and a Button: 2 here.', 'You can go east.'])
  w.lift.transitOnMove = function (toLoc, fromLoc) { io.msg('MOVING to ' + toLoc + ' from ' + fromLoc) }
  util.test.assertCmd('push 1', ['You press the button; nothing happens.'])
  util.test.assertCmd('push 2', ['That does nothing, the button does not work.'])
  util.test.assertCmd('push g', ['The old man presses the button....', 'MOVING to dining_room from bedroom'])
  util.test.assertCmd('e', ['You head east.', '#The dining room', 'An old-fashioned room.', /^You can see/, 'You can go east, up or west.'])
  w.lift.transitCheck = function () {
    io.msg('The lift is out of order')
    return false
  }
  w.lift.transitAutoMove = true
  //  w.lift.afterEnter = transitOfferMenu // -review: don't know where this is from
  util.test.assertCmd('w', ['You head west.', '#The lift', 'A curious lift.', 'You can see a Button: G, a Button: 1 and a Button: 2 here.', 'You can go east.', 'The lift is out of order', '#The dining room', 'An old-fashioned room.', 'You can see a brick, a chair and a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll) here.', 'You can go east, up or west.'])

  util.test.title('Push')
  util.test.assertCmd('e', ['You head east.', '#The lounge', 'A smelly room with an old settee and a tv.', 'You can see a book, a book, a book, seven bricks, a cardboard box (containing some boots), a coin, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), a small key and a waterskin here.', 'You can go east, south, up or west.'])
  util.test.assertCmd('s', ['You head south.', '#The conservatory', 'A light airy room.', 'You can see a broken chair and a crate here.', 'You can go north or west.'])
  util.test.assertCmd('push crate', "That's not going to do anything useful.")
  util.test.assertCmd('push chair s', "It's not something you can move around like that.")
  w.broken_chair.shift = function () { io.msg('You try to push chair, but it just breaks even more.'); return false }
  w.broken_chair.shiftable = true
  util.test.assertCmd('push chair w', 'You try to push chair, but it just breaks even more.')
  util.test.assertCmd('push crate s', "You can't go south.")
  util.test.assertCmd('push crate w', 'You push the crate west.')

  util.test.title('ensemble')
  world.setRoom(game.player, 'wardrobe', 'suppress')
  util.test.assertCmd('l', ['#The wardrobe', 'Oddly empty of fantasy worlds.', 'You can see a suit here.', 'You can go out.'])
  util.test.assertCmd('get trousers', ['You take the suit trousers.'])
  util.test.assertCmd('l', ['#The wardrobe', 'Oddly empty of fantasy worlds.', 'You can see a jacket and a waistcoat here.', 'You can go out.'])
  util.test.assertCmd('i', ['You are carrying a flashlight, a garage key and some suit trousers.'])
  util.test.assertCmd('get jacket, waistcoat', ['Jacket: You take the jacket.', 'Waistcoat: You take the waistcoat.'])
  util.test.assertCmd('i', ['You are carrying a flashlight, a garage key and a suit.'])
  util.test.assertCmd('drop suit', ['You drop the suit.'])
  util.test.assertCmd('get suit', ['You take the suit.'])
  util.test.assertCmd('wear xyz', ['Individual parts of an ensemble must be worn and removed separately.'])
  util.test.assertCmd('wear trousers', ['You put on the suit trousers.'])
  util.test.assertCmd('i', ['You are carrying a flashlight, a garage key, a jacket, some suit trousers (worn) and a waistcoat.'])
  util.test.assertCmd('wear jacket', ['You put on the jacket.'])
  util.test.assertCmd('wear waistcoat', ["You can't put a waistcoat on over your jacket."])
  util.test.assertCmd('doff jacket', ['You take the jacket off.'])
  util.test.assertCmd('wear waistcoat', ['You put on the waistcoat.'])
  util.test.assertCmd('wear jacket', ['You put on the jacket.'])
  util.test.assertCmd('i', ['You are carrying a flashlight, a garage key and a suit (worn).'])

  util.test.title('pre-shop')
  util.test.assertCmd('o', ['You head out.', '#The bedroom', 'A large room, with a big bed and a wardrobe.', 'You can see a coat, some jeans, a jumpsuit, a shirt, underwear and a wardrobe here.', 'You can go down, in or west.'])
  util.test.assertCmd('d', ['You head down.', '#The lounge', 'A smelly room with an old settee and a tv.', 'You can see a book, a book, a book, seven bricks, a cardboard box (containing some boots), a coin, a glass cabinet (containing a jewellery box (containing a ring) and an ornate doll), a small key and a waterskin here.', 'You can go east, south, up or west.'])
  util.test.assertCmd('s', ['You head south.', '#The conservatory', 'A light airy room.', 'You can see a broken chair here.', 'You can go north or west.'])
  util.test.assertCmd('w', ['You head west.', '#The garden', 'Very overgrown. The garden backs onto a shop to the west, whilst the conservatory is east.', 'You can see Arthur, a crate and Lara here.', 'You can go east or west.'])
  util.test.assertCmd('w', ['You head west.', '#The shop', 'A funny little shop.', 'You can go east.'])
  w.me.money = 20

  util.test.title('shop - text processor')
  util.test.assertEqual('The carrot is $0,02', text.processText('The carrot is {money:carrot}'))
  util.test.assertEqual('The carrot is $0,02', text.processText('The carrot is {$:carrot}'))
  util.test.assertEqual('You see $0,12', text.processText('You see {$:12}'))
  util.test.assertEqual('The carrot is $0,02', text.processText('{nm:item:the:true} is {$:carrot}', { item: w.carrot }))
  util.test.assertEqual('The carrot is $0,02', text.processText('{nm:item:the:true} is {$:carrot}', { item: 'carrot' }))

  util.test.title('shop - lang.buy')
  util.test.assertEqual(true, parser.isForSale(w.carrot))
  util.test.assertEqual(true, parser.isForSale(w.trophy))
  util.test.assertEqual(undefined, parser.isForSale(w.flashlight))
  util.test.assertCmd('lang.buy carrot', ['You lang.buy the carrot for $0,02.'])
  util.test.assertCmd('lang.buy carrot', ['You lang.buy the carrot for $0,02.'])
  util.test.assertEqual(16, w.me.money)
  util.test.assertCmd('lang.buy flashlight', ["You can't lang.buy it."])
  util.test.assertCmd('lang.buy trophy', ['You lang.buy the trophy for $0,15.'])
  util.test.assertEqual(1, w.me.money)
  util.test.assertEqual(true, parser.isForSale(w.carrot))
  // console.log("----------------------");
  util.test.assertEqual(false, parser.isForSale(w.trophy))
  util.test.assertCmd('lang.buy trophy', ["You can't lang.buy the trophy here - probably because you are lang.already holding it."])
  util.test.assertCmd('lang.buy carrot', ["You can't afford the carrot (need $0,02)."])
  util.test.assertEqual(1, w.me.money)

  util.test.title('shop - sell')
  util.test.assertCmd('sell carrot', ["You can't sell the carrot here."])
  util.test.assertEqual(1, w.me.money)
  util.test.assertCmd('sell trophy', ['You sell the trophy for $0,08.'])
  util.test.assertEqual(9, w.me.money)
  util.test.assertCmd('sell trophy', ["You can't see anything you might call 'trophy' here."])
  util.test.assertEqual(9, w.me.money)
  w.me.money = 20
  w.shop.sellingDiscount = 20
  util.test.assertEqual(12, w.trophy.getBuyingPrice(w.me))
  util.test.assertCmd('lang.buy trophy', ['You lang.buy the trophy for $0,12.'])
  util.test.assertEqual(8, w.me.money)
  w.shop.buyingValue = 80
  util.test.assertCmd('sell trophy', ['You sell the trophy for $0,12.'])
  util.test.assertEqual(20, w.me.money)

  util.test.title('vessels and liquids')
  game.player.loc = 'kitchen'
  w.jug.loc = 'big_kitchen_table'
  game.update()
  util.test.assertCmd('get jug', ['You take the jug.'])
  util.test.assertCmd('fill jug with tears', ["You can't see anything you might call 'tears' here."])
  util.test.assertCmd('fill jug with honey', ["There's no honey here."])
  util.test.assertCmd('fill jug with water', ['You fill the jug.'])
  util.test.assertCmd('fill jug with water', ['It lang.already is.'])
  util.test.assertCmd('fill jug with lemonade', ["It's not something you can mix liquids in."])

  /* */
}
