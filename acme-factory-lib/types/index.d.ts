/**
 * a typical item that ACME can produce
 */
export type Item = {
    /**
     * the item description
     */
    description: string;
};
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
export function create(qt: number): Item[];
