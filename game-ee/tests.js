'use strict'

util.test.util.tests = function () {
  util.test.title('Equip')
  util.test.assertCmd('equip knife', 'You draw the knife.')
  util.test.assertCmd('equip knife', 'It already is.')
  util.test.assertCmd('drop knife', 'You drop the knife.')
  util.test.assertCmd('take knife', 'You take the knife.')
  util.test.assertCmd('unequip knife', 'It already is.')
  util.test.assertCmd('equip knife', 'You draw the knife.')
  util.test.assertCmd('unequip knife', 'You put away the knife.')
}
