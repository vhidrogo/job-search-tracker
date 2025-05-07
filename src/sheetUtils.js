const { convert2DArrayToObjects } = require("./utils/convert2DArrayToObjects");
const { filter2DArrayRows } = require("./utils/filter2DArrayRows");

/**
 * Writes the provided input values back to the sheet UI range.
 *
 * @param {string} rangeName - The name of the named range to update.
 * @param {Map<string, string|number>} inputsMap - A Map containing label-value pairs to write to the sheet.
 */
function setInputsOnSheetUI(rangeName, inputsMap) {
    const range = getNamedRange(rangeName);
    const updatedValues = Array.from(inputsMap, ([label, value]) => [label, value]);

    range.setValues(updatedValues);
}

/**
 * Retrieves input values from a two-column named range in the active spreadsheet UI,
 * and returns them as a Map with the first column as keys and the second column as values.
 *
 * @param {string} rangeName - The name of the named range containing the input labels and values.
 * @returns {Map<string, any>} A Map where keys are input labels and values are the corresponding input values.
 * @throws {Error} If the named range is not found.
 */
function getInputsFromSheetUI(rangeName) {
    const range = getNamedRange(rangeName);
    if (range.getWidth() !== 2) {
        throw new Error(`Expected a two-column range for ${rangeName}, but got ${range.getWidth()}.`);
    }

    return new Map(range.getValues());
}

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
