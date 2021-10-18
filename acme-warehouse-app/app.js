'use strict'

// @ts-check

const uuid = require('uuid').v1
const factory = require('acme-factory-lib')
const validator = require('email-validator')

const { fastify } = require('fastify')

const storage = require('./lib/storage')
const validate = require('./lib/validate')

const app = fastify({
  logger: true
})

app.setValidatorCompiler(({ schema, method, url, httpPart }) => {
  return validate.compile(schema)
})

/**
 * load the warehouse with some random product from the factory
 */
app.post('/load', {
  schema: {
    body: {
      type: 'object',
      required: ['qt'],
      properties: {
        qt: {
          type: 'integer',
          maximum: 100,
          minimum: 1
        }
      }
    },
    response: {
      200: {
        type: 'array',
        items: {
          type: 'object',
          properties: {
            id: { type: 'string' },
            qt: { type: 'integer' },
            description: { type: 'string' },
            since: { type: 'integer' } // datetime in epoc time
          }
        }
      }
    }
  }
}, async (/** @type GenericRequest */request, reply) => {
  factory.create(true)
  const items = factory.create(request.body.qt)
    .map(i => {
      const item = {
        id: uuid(),
        qt: 1,
        description: i.description,
        since: Date.now()
      }
      storage.set(item.id, item)
      return item
    })
  reply.send(items)
})

/**
 * place an order
 */
app.post('/order', {
  schema: {
    body: {
      type: 'object',
      required: ['user', 'items'],
      properties: {
        user: {
          type: 'object',
          required: ['email', 'address'],
          properties: {
            email: {
              type: 'string',
              check: {
                validate: function checkUserEmail (email) {
                  return validator.validate(email)
                },
                error: (schema, parentSchema, data) => {
                  return `Email ${data} is not valid`
                }
              }
            },
            address: {
              type: 'string'
            }
          }
        },

        items: {
          type: 'array',
          items: {
            type: 'object',
            required: ['id', 'qt'],
            properties: {
              id: { type: 'string' },
              qt: {
                type: 'integer',
                maximum: 100,
                minimum: 1,
                multipleOf: 1
              },
              check: {
                validate: function (item) {
                  const stored = storage.get(item.id)
                  return !(!stored || stored.qt < item.qt)
                },
                error: (schema, parentSchema, data) => {
                  return `Item ${data.id} is not valid`
                }
              }
            }
          }
        }
      }
    },
    response: {
      200: {
        type: 'object',
        required: ['orderId'],
        properties: { orderId: { type: 'string' } }
      }
    }
  }
}, async (request, reply) => {
  // ... update storage
  // ... save order and so on
  reply.send({ orderId: uuid() })
})

module.exports = app
