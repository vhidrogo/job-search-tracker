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

function onConsiderationLoggerLogClick() {
    const requiredFields = [
        'Initiation Method',
        'Date Initiated',
    ];

    const defaultsMap = {
        'Initiation Method': 'Recruiter',
        'Date Initiated': '=today()',
    };

    // TODO: JD Link, Interview Notes Doc (need to find application first) 
    const suffixValues = [];

    relatedLoggerWorkflow({
        relatedName: 'Consideration',
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