const { convert2DArrayToObjects } = require("../utils/convert2DArrayToObjects");
const { filter2DArrayRows } = require("../utils/filter2DArrayRows");

/**
 * Retrieves a named range from the active spreadsheet.
 *
 * @param {string} rangeName - The name of the named range to retrieve.
 * @returns {GoogleAppsScript.Spreadsheet.Range} The named range object.
 * @throws {Error} If the named range is not found.
 */
function getNamedRange(rangeName) {
    const range = SpreadsheetApp.getActiveSpreadsheet().getRangeByName(rangeName);
    if (!range) {
        throw new Error(`Named range "${rangeName}" not found.`);
    }
    
    return range;
}

/**
 * Retrieves the value from a named range in the active spreadsheet.
 *
 * @param {string} rangeName - The name of the named range to retrieve the value from.
 * @returns {*} The value of the specified named range.
 */
function getNamedRangeValue(rangeName) {
    const range = getNamedRange(rangeName);
    return range.getValue();
}

/**
 * Retrieves a sheet by name from the active spreadsheet.
 *
 * @param {string} sheetName - The name of the sheet to retrieve.
 * @returns {GoogleAppsScript.Spreadsheet.Sheet} The requested sheet object.
 * @throws Will throw an error if the sheet is not found.
 */
function getSheet(sheetName) {
    const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(sheetName);
    if (!sheet) {
      throw new Error(`${sheetName} sheet not found.`);
    }
    return sheet;
  }

/**
 * Appends a row of values to the specified sheet in the active spreadsheet.
 * Optionally prepends a generated UUID as an insert ID.
 *
 * @param {string} sheetName - The name of the sheet to append the row to.
 * @param {Array<any>} rowValues - An array of values to append as a new row.
 * @param {boolean} [insertId=false] - Whether to prepend a UUID to the row as an insert ID.
 * @throws {Error} If the specified sheet is not found.
 */
function appendRowToSheet(sheetName, rowValues, insertId=false) {
    const sheet = getSheet(sheetName);

    if (insertId) {
        rowValues = [Utilities.getUuid(), ...rowValues];
    }
    
    sheet.appendRow(rowValues);
}

/**
 * 
 * @param {string} sheetName - The name of the sheet to retrieve data from.
 * @returns {Array[]} The sheet data as a 2D array.
 */
function getSheetData(sheetName) {
    const sheet = getSheet(sheetName);

    return sheet.getDataRange().getValues();
}

/**
 * Finds and returns rows from a sheet that match the provided criteria.
 *
 * @param {string} sheetName - The name of the sheet to search.
 * @param {Object.<string, *>} criteriaMap - An object mapping header names to desired values for filtering rows.
 * @returns {Object[]} An array of objects representing the matching rows, where each object maps headers to cell values.
 */
function findSheetRows(sheetName, criteriaMap) {
    const data = getSheetData(sheetName);
    const matches = filter2DArrayRows(data, criteriaMap);

    if (matches.length <= 1) {
        return []; // No data rows found
    }

    const headers = matches[0];
    const dataRows = matches.slice(1);

    return convert2DArrayToObjects(headers, dataRows);
}

/**
 * Generates an array of row values from optional prefix values, an inputs map, and optional suffix values.
 *
 * @param {Map<string, any>} inputsMap - A Map containing input field names and their values.
 * @param {Array<any>} [prefixValues=[]] - An array of values to prepend to the row.
 * @param {Array<any>} [suffixValues=[]] - An array of values to append to the row.
 * @returns {Array<any>} A combined array of prefix values, input values, and suffix values.
 */
function generateRowValues(inputsMap, prefixValues = [], suffixValues = []) {
  const inputValues = Array.from(inputsMap.values());
  return [...prefixValues, ...inputValues, ...suffixValues];
}

module.exports = { getNamedRangeValue }