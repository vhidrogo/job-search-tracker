/**
 * Converts an array of values into an object using the provided keys.
 * Optionally, a subset of keys can be specified to include only certain properties.
 *
 * @param {Array} keys - The keys to use for object properties.
 * @param {Array} values - The values corresponding to the keys.
 * @returns {Object} The resulting key-value mapped object.
 */
function convertArrayToObject(keys, values) {
    if (keys.length !== values.length) {
        throw new Error('Keys and values arrays must be of the same length.');
    }

    return keys.reduce((obj, key, idx) => {
        obj[key] = values[idx];
        return obj;
      }, {});
}

module.exports = { convertArrayToObject };