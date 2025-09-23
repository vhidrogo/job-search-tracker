const { NAMED_RANGES } = require("../constants");

const CONFIG = {
    INPUTS_RANGE_NAME: 'ApplicationLogger_Inputs',
    SHEET_NAME: 'Applications',
  };

function onApplicationLoggerLogClick() {
    logApplication();
    resetApplicationLoggerUI();
}

function logApplication() {
    const inputValues = getApplicationInputValues();
    appendRowToSheet(CONFIG.SHEET_NAME, inputValues, insertId=true);
}

function getApplicationInputValues() {
    const inputsMap = getInputsFromSheetUI(CONFIG.INPUTS_RANGE_NAME);
    
    validateRequiredApplicationFields(inputsMap);
    normalizeSalaryFields(inputsMap);

    return Array.from(inputsMap.values());
}

function validateRequiredApplicationFields(inputsMap) {
    const requiredFields = [
        'Job Source',
        'Location',
        'Role',
        'Listing Job Title',
        'Company',
        'Resume Version',
        'Link',
    ];

    for (const field of requiredFields) {
        if (!inputsMap.has(field) || inputsMap.get(field).trim() === '') {
            throw new Error(`Missing required input ${field}.`);
        }
    }
}

function normalizeSalaryFields(inputsMap) {
    const salaryFields = Array.from(inputsMap.keys()).filter(key => key.includes('Salary'));
    for (const field of salaryFields) {
        const value = inputsMap.get(field);
        if (value != '' && value < 1000) {
            inputsMap.set(field, value * 1000);
        }
    }
}

function resetApplicationLoggerUI() {
    resetApplicationInputValues();
    getNamedRange(NAMED_RANGES.APPLICATION_LOGGER.COMPANY).activate();
}

function resetApplicationInputValues() {
    const clearFields = [
        'Level',
        'Specialization',
        'Listing Job Title',
        'Company',
        'Yrs XP Min',
        'Salary Min (K)',
        'Salary Max (K)',
        'Matching Skills',
        'Matching Experience',
        'Missing Skills',
        'Missing Experience',
        'Notes',
        'Desired Salary',
        'Resume Version',
        'Link'
    ]

    const defaults = {
        'Applied Date': '=today()',
    }

    const inputsMap = getInputsFromSheetUI(CONFIG.INPUTS_RANGE_NAME);

    for (const key of inputsMap.keys()) {
        if (defaults.hasOwnProperty(key)) {
            inputsMap.set(key, defaults[key]);
      } else if (clearFields.includes(key)) {
        inputsMap.set(key, '');
      }
    }

    setInputsOnSheetUI(CONFIG.INPUTS_RANGE_NAME, inputsMap);
}