const { NAMED_RANGES, SHEET_NAMES } = require("../constants");
const { getNamedRangeValue, getSheetData } = require("../helpers/dataSheetHelpers");
const { ApplicationStatus } = require("../helpers/getApplicationStatus");
const { setApplicationStatusOnApplications } = require("../helpers/modelHelpers");
const { writeToNamedRangeWithHeaders } = require("../helpers/sheetUiHelpers");
const { convert2DArrayToObjects } = require("../utils/convert2DArrayToObjects");

/**
 * Handles updating the "Latest Applications" view.
 * 
 * Retrieves configuration values (status, sort field, order, count) from named ranges,
 * fetches the latest applications, sorts them, and writes them back to the designated
 * named range with headers.
 */
function onLatestApplicationsViewUpdateClick() {
    const status = getNamedRangeValue(NAMED_RANGES.LatestApplications.APPLICATION_STATUS);
    const sortField = getNamedRangeValue(NAMED_RANGES.LatestApplications.SORT_FIELD);
    const descending = getNamedRangeValue(NAMED_RANGES.LatestApplications.DESCENDING);
    const count = getNamedRangeValue(NAMED_RANGES.LatestApplications.COUNT);

    const applications = getApplications(status, count);
    sortResults(applications, sortField, descending);
    writeToNamedRangeWithHeaders(applications, NAMED_RANGES.LatestApplications.APPLICATIONS);
}

/**
 * Sorts an array of application objects in place based on the given field and order.
 *
 * @param {Object[]} applications - The list of applications to sort.
 * @param {string} sortField - The object property name to sort by.
 * @param {boolean} descending - Whether to sort in descending order.
 */
function sortResults(applications, sortField, descending) {
    applications.sort((a, b) => {
        let aVal;
        let bVal;
        if (descending === true) {
            aVal = b[sortField];
            bVal = a[sortField];
        } else {
            aVal = a[sortField];
            bVal = b[sortField];
        }

        if (aVal == null && bVal == null) return 0;
        if (aVal == null) return 1;
        if (bVal == null) return -1;

        if (!isNaN(aVal) && !isNaN(bVal)) {
            return Number(aVal) - Number(bVal);
        }

        return String(aVal).localeCompare(String(bVal));
    });
}

/**
 * Retrieves applications from the Applications sheet, applies status filtering,
 * sets their current status, sorts by most recent "Applied Date", and limits the result count.
 *
 * @param {string} status - The application status to filter by (or "All" for no filtering).
 * @param {number} count - The maximum number of applications to return.
 * @returns {Object[]} The list of application objects, filtered, sorted, and limited.
 */
function getApplications(status, count) {
    const [applicationHeaders, ...applicationData] = getSheetData(SHEET_NAMES.APPLICATIONS);
    let applications = convert2DArrayToObjects(applicationHeaders, applicationData);

    setApplicationStatusOnApplications(applications);

    if (status !== 'All') {
        applications = applications.filter(obj => obj.Status === status);
    }

    applications.sort((a, b) => b['Applied Date'] - a['Applied Date']);
    applications = applications.slice(0, count);

    return applications;
}