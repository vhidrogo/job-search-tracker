const CONFIG = {
    INPUTS_RANGE_NAME: 'ApplicationLogger_Inputs',
    LISTING_JOB_TITLE_RANGE_NAME: 'ApplicationLogger_ListingJobTitle',
    SHEET_NAME: 'Applications',
    OVERRIDE_RESUME_RANGE_NAME: 'ApplicationLogger_OverrideResume'
  };

function onApplicationLoggerLogClick() {
    logApplication();
    resetApplicationInputValues();
    getNamedRange(CONFIG.OVERRIDE_RESUME_RANGE_NAME).clearContent();
    getNamedRange(CONFIG.LISTING_JOB_TITLE_RANGE_NAME).activate();
}

function logApplication() {
    const inputValues = getApplicationInputValues();
    const formulas = generateReverseForeignKeyFormulas();
    const rowValues = [...inputValues, ...formulas]
    appendRowToSheet(CONFIG.SHEET_NAME, rowValues, insertId=true);
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

function generateReverseForeignKeyFormulas() {
    const relatedTables = [
        'Rejections',
        'Closures',
        'Considerations'
    ];
    
    return relatedTables.map(table =>
        `=IF(ISNUMBER(MATCH(INDIRECT("A" & ROW()), ${table}_Application_ID, 0)), "Yes", "No")`
    );
}

function resetApplicationInputValues() {
    const clearFields = [
        'Specialization',
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
        'Link'
    ]

    const defaults = {
        'Applied Date': '=today()',
        'Listing Job Title': '=ApplicationLogger_Role',
        'Resume Version': `=if(${CONFIG.OVERRIDE_RESUME_RANGE_NAME}="",ApplicationLogger_SuggestedResume,${CONFIG.OVERRIDE_RESUME_RANGE_NAME})`
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