const factory = require('../index')

const t = require('tap')

// ignore types!

t.test('factory.create', async t => {
  const items = factory.create(99)
  t.equal(99, items.length)
})
