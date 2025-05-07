/**
 * Filters rows of a 2D array based on a single field and search value (case-insensitive, partial match).
 *
 * @param {Array[]} data - 2D array including headers in the first row.
 * @param {string} searchField - The header name of the column to search in.
 * @param {string} searchValue - The value to search for (case-insensitive, partial match).
 * @returns {Array[]} Filtered array of rows, including headers. Returns an empty array if no matches found.
 */
function filter2DArrayRows(data, searchField, searchValue) {
    if (data.length === 0) return [];
  
    const headers = data[0];
    const fieldIndex = headers.indexOf(searchField);

    if (fieldIndex === -1) {
      throw new Error(`Field "${searchField}" not found in headers.`);
    }

    const matches = data.slice(1).filter(row => 
      String(row[fieldIndex]).toLowerCase().includes(searchValue.toLowerCase())
    );
    
    return matches.length ? [headers, ...matches] : []
}

module.exports = { filter2DArrayRows };
