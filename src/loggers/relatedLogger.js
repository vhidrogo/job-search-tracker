const { getNamedRangeValue, getSheetByName } = require("../helpers/dataSheetHelpers");

function onRejectionLoggerLogClick() {
    const requiredFields = [
        'Rejection Source',
        'Status Date'
    ];

    const defaultsMap = {
        'Rejection Source': 'Email',
        'Status Date': '=today()'
    };

    relatedLoggerWorkflow({
        relatedName: 'Rejection', 
        requiredFields: requiredFields,
        defaultsMap: defaultsMap
    });
}

function onClosureLoggerLogClick() {
    const requiredFields = [
        'Notified Date',
        'Reason'
    ];

    const defaultsMap = {
        'Notified Date': '=today()',
    };

    relatedLoggerWorkflow({
        relatedName: 'Closure',
        requiredFields: requiredFields,
        defaultsMap: defaultsMap
    });
}

function relatedLoggerWorkflow({
    relatedName,
    applicationId = '',
    requiredFields,
    subsetClearFields = [],
    defaultsMap = {},
    prefixValues = [],
    suffixValues = []
}) {
    const uiSheetName = relatedName + 'Logger'
    const appSearchInputsRangeName = uiSheetName + '_AppSearchInputs';

    if (!applicationId) {
        applicationId = getApplicationId(appSearchInputsRangeName);
    }

    const modelInputsRangeName = uiSheetName + '_ModelInputs';
    const inputsMap = getInputsFromSheetUI(modelInputsRangeName);
    validateInputs(inputsMap, requiredFields);

    const rowValues = generateRowValues(inputsMap, [...prefixValues, applicationId], suffixValues);
    const dataSheetName = relatedName + 's';
    appendRowToSheet(dataSheetName, rowValues);

    resetSheetUI(modelInputsRangeName, subsetClearFields, defaultsMap);
    resetSheetUI(appSearchInputsRangeName);

    const hideAfterLogging = getNamedRangeValue(uiSheetName + '_HideAfterLogging');
    if (hideAfterLogging === true) {
        getSheetByName(uiSheetName).hideSheet();
    }
}

function getApplicationId(searchInputsRangeName) {
    const searchInputs = getInputsFromSheetUI(searchInputsRangeName);
    const application = findApplication(...searchInputs.values());

    return application['ID'];
}

module.exports = { relatedLoggerWorkflow }