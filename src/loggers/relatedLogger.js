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

function relatedLoggerWorkflow({
    relatedName,
    requiredFields,
    subsetClearFields = [],
    defaultsMap = {},
    suffixValues = []
}) {
    const uiSheetName = relatedName + 'Logger'
    const appSearchInputsRangeName = uiSheetName + '_AppSearchInputs';
    const applicationId = getApplicationId(appSearchInputsRangeName);

    const modelInputsRangeName = uiSheetName + '_ModelInputs';
    const inputsMap = getInputsFromSheetUI(modelInputsRangeName);
    validateInputs(inputsMap, requiredFields);

    const rowValues = generateRowValues(inputsMap, [applicationId], suffixValues);
    const dataSheetName = relatedName + 's';
    appendRowToSheet(dataSheetName, rowValues);

    resetSheetUI(modelInputsRangeName, subsetClearFields, defaultsMap);
    resetSheetUI(appSearchInputsRangeName);
}

function getApplicationId(searchInputsRangeName) {
    const searchInputs = getInputsFromSheetUI(searchInputsRangeName);
    const application = findApplication(...searchInputs.values());

    return application['ID'];
}