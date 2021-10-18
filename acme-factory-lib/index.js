'use strict'

// @ts-check

const item = require('./item')

/**
 * a typical item that ACME can produce
 * @typedef {Object} Item
 * @property {string} description the item description
 */

/**
 * create new items
 * @param {number} qt quantity of items to be created
 * @returns {Item[]}
 */
function create (qt) {
  /** @type Item[] */
  const items = []

  for (let i = 0; i < qt; i++) {
    items.push({
      description: item.random()
    })
  }
  return items
}

module.exports = {
  create
}
