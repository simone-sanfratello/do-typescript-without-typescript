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

t.test('order', async (t) => {
  t.before(async () => {
    await app.inject({
      method: 'POST',
      url: '/load',
      payload: { qt: 10 }
    })
  })

  t.test('should place an order', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/order',
      payload: {
        items: [{ id: Array.from(storageMock.keys())[0], qt: 1 }],
        user: { email: 'alice@email.com', address: 'via del poggio, 12 - 50100 - Firenze IT' }
      }
    })

    t.equal(response.statusCode, 200)
  })

  t.test('should get error on invalid email', async (t) => {
    const response = await app.inject({
      method: 'POST',
      url: '/order',
      payload: {
        items: [{ id: Array.from(storageMock.keys())[0], qt: 1 }],
        user: { email: 'not-an-email.com', address: 'via del poggio, 12 - 50100 - Firenze IT' }
      }
    })

    t.equal(JSON.parse(response.body).message, "body.user.email : Email not-an-email.com is not valid")
    t.equal(response.statusCode, 400)
  })
})

// ... more test!
