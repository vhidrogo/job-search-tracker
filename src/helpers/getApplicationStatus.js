const { SHEET_NAMES } = require("../constants");
const { getColumnDataFromSheet } = require("./dataSheetHelpers");

const ApplicationStatus = Object.freeze({
    CLOSED: 'Closed',
    CONSIDERED: 'Considered',
    NONE: 'No Response',
    REJECTED: 'Rejected',
});

const applicationIdsCache = {};

function getApplicationIdsFromSheet(sheetName) {
    if (!applicationIdsCache.hasOwnProperty(sheetName)) {
        const ids = getColumnDataFromSheet(sheetName, 'Application ID');
        applicationIdsCache[sheetName] = new Set(ids);
    }

    return applicationIdsCache[sheetName];
}

function getApplicationStatus(applicationId) {
    if (getApplicationIdsFromSheet(SHEET_NAMES.REJECTIONS).has(applicationId)) return ApplicationStatus.REJECTED;
    if (getApplicationIdsFromSheet(SHEET_NAMES.CLOSURES).has(applicationId)) return ApplicationStatus.CLOSED;
    if (getApplicationIdsFromSheet(SHEET_NAMES.CONSIDERATIONS).has(applicationId)) return ApplicationStatus.CONSIDERED;
    return ApplicationStatus.NONE;
}

module.exports = { ApplicationStatus, getApplicationStatus }