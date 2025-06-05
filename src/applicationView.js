const { NAMED_RANGES } = require("./constants");
const { getNamedRange, setNamedRangeValue, findSheetRows } = require("./loggers/dataSheetUtils");
const { findApplication } = require("./loggers/modelUtils");
const { getInputsFromSheetUI, setInputsOnSheetUI, resetSheetUI } = require("./loggers/sheetUiUtils");

const OUTCOME_CONDITIONAL_FORMATTING = {
    Rejected: {
        BACKGROUND: '#ea4335',
        FONT_COLOR: '#ffffff',
    },
    Closed: {
        BACKGROUND: '#b7b7b7',
        FONT_COLOR: '#000000',
    },
    Considered: {
        BACKGROUND: '#34a853',
        FONT_COLOR: '#000000',
    },
    'No Response': {
        BACKGROUND: '#ffffff',
        FONT_COLOR: '#000000',
    },
}

function onFindClick() {
    const searchInputs = getInputsFromSheetUI(NAMED_RANGES.ApplicationView.SEARCH_CRITERIA_INPUTS);
    const applicationAttributes = findApplication(...searchInputs.values());

    outputApplicationDetails(applicationAttributes);

    const outcome = getOutcome(applicationAttributes);
    outputOutcome(outcome);
    
    if (outcome === 'Considered') {
        const considerationDetails = getConsiderationDetails(applicationAttributes['ID']);
        outputConsiderationDetails(considerationDetails);
    } else {
        clearConsiderationDetails();
    }

}

function clearConsiderationDetails() {
    resetSheetUI(NAMED_RANGES.ApplicationView.CONSIDERATION_DETAIL_OUTPUTS);
    setNamedRangeValue(NAMED_RANGES.ApplicationView.JOB_DESCRIPTION_LINK, '');
    setNamedRangeValue(NAMED_RANGES.ApplicationView.INTERVIEW_DOC_LINK, '');
}

function outputConsiderationDetails(considerationDetails) {
    const outputsMap = getInputsFromSheetUI(NAMED_RANGES.ApplicationView.CONSIDERATION_DETAIL_OUTPUTS);

    for (const key of outputsMap.keys()) {
        if (considerationDetails.hasOwnProperty(key)) {
            outputsMap.set(key, considerationDetails[key]);
        }
    }

    setInputsOnSheetUI(NAMED_RANGES.ApplicationView.CONSIDERATION_DETAIL_OUTPUTS, outputsMap);
    setNamedRangeValue(NAMED_RANGES.ApplicationView.JOB_DESCRIPTION_LINK, considerationDetails['JD Link']);
    setNamedRangeValue(NAMED_RANGES.ApplicationView.INTERVIEW_DOC_LINK, considerationDetails['Interview Doc Link']);
}

function getConsiderationDetails(applicationId) {
    const criteria = { 'Application ID': applicationId };
    return findSheetRows('Considerations', criteria)[0];
}

function outputOutcome(outcome) {
    const cell = getNamedRange(NAMED_RANGES.ApplicationView.OUTCOME);
    cell.setValue(outcome);
    cell.setBackground(OUTCOME_CONDITIONAL_FORMATTING[outcome].BACKGROUND);
    cell.setFontColor(OUTCOME_CONDITIONAL_FORMATTING[outcome].FONT_COLOR);
}

function getOutcome(applicationAttributes) {
    if (applicationAttributes['Rejected'] === 'x') return 'Rejected';
    if (applicationAttributes['Closed'] === 'x') return 'Closed';
    if (applicationAttributes['Considered'] === 'x') return 'Considered';
    return 'No Response';
}

function outputApplicationDetails(applicationAttributes) {
    const outputsMap = getInputsFromSheetUI(NAMED_RANGES.ApplicationView.APPLICATION_DETAIL_OUTPUTS);

    for (const key of outputsMap.keys()) {
        if (applicationAttributes.hasOwnProperty(key)) {
            outputsMap.set(key, applicationAttributes[key]);
        }
    }

    setInputsOnSheetUI(NAMED_RANGES.ApplicationView.APPLICATION_DETAIL_OUTPUTS, outputsMap);
    setNamedRangeValue(NAMED_RANGES.ApplicationView.LISTING_LINK, applicationAttributes['Link']);
}