'use strict'

// !no types

const t = require('tap')

let app, storageMock

t.before(async () => {
  storageMock = new Map()
  app = t.mock('../app', {
    '../lib/storage': storageMock
  })
})

t.teardown(async () => {
  await app.close()
})

t.test('load', async (t) => {
  t.test('should load the warehouse with 10 items', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/load',
      payload: { qt: 10 }
    })

    t.equal(200, response.statusCode)
    t.equal(10, storageMock.size)
  })

  t.test('should get error for invalid quantity', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/load',
      payload: { qt: -1 }
    })

    t.equal(400, response.statusCode)
    t.equal('body.qt should be >= 1', JSON.parse(response.body).message)
  })
})

// ... more test!
