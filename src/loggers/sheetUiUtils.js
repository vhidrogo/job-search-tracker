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
 * Validates that all required fields exist in the inputs map and are non-empty strings.
 *
 * @param {Map<string, string>} inputsMap - A map of input field names to their string values.
 * @param {string[]} requiredFields - An array of field names that are required.
 * @throws {Error} If any required field is missing or has an empty value.
 */
function validateInputs(inputsMap, requiredFields) {
    for (const field of requiredFields) {
        if (!inputsMap.has(field) || inputsMap.get(field).toString().trim() === '') {
            throw new Error(`Missing required input ${field}.`);
        }
    }
}

/**
 * Resets the sheet UI by clearing input fields, applying default values, and
 * setting them on the sheet UI.
 *
 * @param {string} inputsRangeName - The name of the inputs range on the sheet.
 * @param {string[]} subsetClearFields - Array of input keys to clear; if empty, clears all.
 * @param {Object<string, string>} defaults - Object of default values to apply after clearing.
 */
function resetSheetUI(inputsRangeName, subsetClearFields = [], defaults = {}) {
    const inputsMap = getInputsFromSheetUI(inputsRangeName);
    clearInputs(inputsMap, subsetClearFields);
    if (Object.keys(defaults).length) {
        setDefaults(inputsMap, defaults);
    }
    setInputsOnSheetUI(inputsRangeName, inputsMap);
}

/**
 * Clears specified input fields in the inputs Map.
 *
 * @param {Map<string, string>} inputsMap - Map of input keys to their current values.
 * @param {string[]} subsetFields - Array of input keys to clear; if empty, clears all.
 */
function clearInputs(inputsMap, subsetFields) {
    for (const key of inputsMap.keys()) {
        if (!subsetFields.length || subsetFields.includes(key)) {
            inputsMap.set(key, '');
        }
    }
}

/**
 * Sets default values for specified inputs in the inputs Map.
 *
 * @param {Map<string, string>} inputsMap - Map of input keys to their current values.
 * @param {Object<string, string>} defaults - Object of default values to apply.
 */
function setDefaults(inputsMap, defaults) {
    for (const [key, value] of Object.entries(defaults)) {
        inputsMap.set(key, value);
    }
}

module.exports = { getInputsFromSheetUI, setInputsOnSheetUI }
