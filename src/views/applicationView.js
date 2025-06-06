const { NAMED_RANGES } = require("./constants");
const { getNamedRange, setNamedRangeValue, findSheetRows, getNamedRangeValues } = require("./loggers/dataSheetUtils");
const { findApplication } = require("./loggers/modelUtils");
const { getInputsFromSheetUI, setInputsOnSheetUI, resetSheetUI } = require("./loggers/sheetUiUtils");
const { to1DArray } = require("./utilities");

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
        const applicationId = applicationAttributes['ID'];

        const considerationDetails = getConsiderationDetails(applicationId);
        outputConsiderationDetails(considerationDetails);

        clearInterviews();
        const interviews = getInterviews(applicationId);
        if (interviews) outputInterviews(interviews);
        
    } else {
        clearConsiderationDetails();
    }

}

/**
 * Clears the contents of both the past and future interview output ranges in the sheet.
 *
 * This function targets the named ranges designated for past and future interviews
 * and removes any existing cell content, leaving the ranges empty but preserving their structure.
 */
function clearInterviews() {
    getNamedRange(NAMED_RANGES.ApplicationView.APPLICATION_PAST_INTERVIEWS).clearContent();
    getNamedRange(NAMED_RANGES.ApplicationView.APPLICATION_FUTURE_INTERVIEWS).clearContent();
}

/**
 * Outputs a collection of interview records to their respective named ranges in the sheet,
 * splitting them into past and future groups based on the interview date.
 * 
 * This function reads the interview headers from a predefined named range, separates
 * the provided interview objects into past and future categories, then writes each group 
 * to its corresponding output range.
 *
 * @param {Object[]} interviews - Array of interview objects to be output.
 * @param {string} interviews[].['Interview Date'] - Date string representing the scheduled interview date.
 */
function outputInterviews(interviews) {
    const headers = to1DArray(getNamedRangeValues(NAMED_RANGES.ApplicationView.APPLICATION_INTERVIEW_HEADERS));
    const { past, future } = splitInterviewsByDate(interviews);
    writeInterviews(past, headers, NAMED_RANGES.ApplicationView.APPLICATION_PAST_INTERVIEWS);
    writeInterviews(future, headers, NAMED_RANGES.ApplicationView.APPLICATION_FUTURE_INTERVIEWS);
}

/**
 * Writes an array of interview objects to a named range in the sheet, mapping object values 
 * to columns according to a provided list of headers.
 *
 * Only the first `n` objects are written, where `n` is the number of rows available 
 * in the target named range. Remaining rows are filled with empty strings to clear any 
 * previously existing data.
 * 
 * @param {Object[]} interviewObjects - Array of interview objects to write to the sheet.
 * @param {string[]} headers - Array of header strings defining the output column order.
 * @param {string} rangeName - The name of the target named range where data will be written.
 */
function writeInterviews(interviewObjects, headers, rangeName) {
    const range = getNamedRange(rangeName);
    const numRows = range.getNumRows();
    const numCols = range.getNumColumns();

    const values = interviewObjects.slice(0, numRows).map(obj => 
        headers.map(header => obj[header] !== undefined ? obj[header] : '')
    );

    while (values.length < numRows) {
        values.push(new Array(numCols).fill(''));
    }

    range.setValues(values);
}

/**
 * Splits an array of interview objects into two groups: 
 * interviews scheduled before today, and interviews scheduled for today or later.
 *
 * @param {Object[]} interviews - Array of interview objects, each with an 'Interview Date' property.
 * @param {string} interviews[].['Interview Date'] - Date string in a parseable format (e.g. 'Tue Apr 22 00:00:00 GMT-07:00 2025').
 * @returns {{ past: Object[], future: Object[] }} An object containing two arrays: 
 *          'past' for interviews before today, and 'future' for interviews today or later.
 */
function splitInterviewsByDate(interviews) {
    const now = new Date();
    now.setHours(0, 0, 0, 0);
    const past = interviews.filter(i => i['Interview Date'] < now);
    const future = interviews.filter(i => i['Interview Date'] >= now);

    return { past, future };
}

/**
 * Retrieves and sorts interviews for a given application ID by interview date (ascending).
 *
 * @param {string} applicationId - The ID of the application to fetch interviews for.
 * @returns {Object[]} An array of interview objects sorted by 'Interview Date' in ascending order.
 * @throws {Error} If the 'Interview Date' property is missing or not a valid date string in any row.
 */
function getInterviews(applicationId) {
    const criteria = { 'Application ID': applicationId };
    const interviews = findSheetRows('Interviews', criteria);

    interviews.sort((a, b) => {
      const dateA = new Date(a['Interview Date']);
      const dateB = new Date(b['Interview Date']);
      return dateA - dateB;
    })

    return interviews;
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