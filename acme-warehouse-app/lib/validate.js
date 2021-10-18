'use strict'

const Ajv = require('ajv')
const ajv = new Ajv({
  useDefaults: true,
  allErrors: true
})

ajv.addKeyword('check', {
  compile: (schema, parentSchema) => function validate (data) {
    const valid = schema.validate(data)
    if (!valid) {
      // @ts-ignore
      validate.errors = [{
        keyword: 'validate',
        message: ': ' + schema.error(schema, parentSchema, data),
        params: { keyword: 'validate' }
      }]
    }
    return valid
  },
  errors: true
})

module.exports = ajv
