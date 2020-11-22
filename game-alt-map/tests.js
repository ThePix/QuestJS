"use strict";

test.tests = function() {
  

  
  test.title("custom date time")
  test.assertEqual("11 Marisi, 1374, 1:46 am", util.getDateTime())
  const dateTimeDict = util.getDateTimeDict()
  test.assertEqual(46, dateTimeDict.minute)
  test.assertEqual(1, dateTimeDict.hour)
  test.assertEqual("It is 11 Marisi, 1374, 1:46 am", processText("It is {dateTime}"))
  game.elapsedTime += 8 * 60 * 60
  test.assertEqual("It is 11 Marisi, 1374, 9:46 am", processText("It is {dateTime}"))
  
  test.assertEqual("-Two-Three-", processText("{hour:3:8:One}-{hour:5:10:Two}-{hour:9:10:Three}-{hour:10:99:Four}"));
  test.assertEqual(false, util.isAfter('1003'))
  test.assertEqual(false, util.isAfter('0946'))
  test.assertEqual(true, util.isAfter('0945'))
  test.assertEqual(true, util.isAfter('0859'))



  
  
  
  /* */
};