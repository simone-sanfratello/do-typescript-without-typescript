'use strict'

// @ts-check

/** @type {string[]} */
const catalag = [
  'rubber giant hammer',
  'teleporter',
  'pricesless ming vase',
  'grog bottle',
  'pirate boat'
]

/**
 * get a random item from the catalog
 * @returns {string} an item description
 */
function random () {
  return catalag[Math.floor((Math.random() * catalag.length))]
}

module.exports = {
  random
}
