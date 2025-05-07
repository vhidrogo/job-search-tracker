const { convertArrayToObject } = require('./convertArrayToObject');

/**
 * Converts a 2D array of values into an array of objects using the provided keys.
 *
 * @param {string[]} keys - The keys for each object.
 * @param {Array[]} rows - 2D array of values.
 * @returns {Object[]} Array of objects.
 */
function convert2DArrayToObjects(keys, rows) {
    return rows.map(row => convertArrayToObject(keys, row));
}   

module.exports = { convert2DArrayToObjects };