/**
 * Filters rows of a 2D array based on multiple field-value criteria (case-insensitive, partial matches).
 *
 * @param {Array[]} data - 2D array where the first row contains header names.
 * @param {Object} criteriaMap - An object mapping header names to search values. Each value is matched against
 *                                its corresponding column using a case-insensitive, partial match.
 * @returns {Array[]} A new 2D array containing the header row and all rows that match all criteria.
 *                    Returns an empty array if no matches are found.
 *
 * @throws {Error} If any of the header names in criteriaMap are not present in the data's header row.
 */
function filter2DArrayRows(data, criteriaMap) {
    if (data.length === 0) return [];
  
    const headers = data[0];
    const headerIndices = {};

    // Map header names to indices, throw if missing any required ones
    Object.keys(criteriaMap).forEach(key => {
      const index = headers.indexOf(key);
      if (index === -1) {
        throw new Error(`Required column "${key}" is missing from the data.`);
      }
      headerIndices[key] = index;
    });

    const filtered = data.slice(1).filter(row =>
      Object.entries(criteriaMap).every(([key, value]) =>
        row[headerIndices[key]].toString().toLowerCase().includes(value.toString().toLowerCase())
      )
    );

    return filtered.length ? [headers, ...filtered] : []
}

module.exports = { filter2DArrayRows };
