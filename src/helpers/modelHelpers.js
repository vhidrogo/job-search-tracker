const { SHEET_NAMES } = require("../../constants");
const { getApplicationStatus } = require("./getApplicationStatus");

/**
 * Finds an application in the Applications sheet based on a required company name and optional sub-field criteria.
 *
 * @param {string} companyName - The required company name to search by.
 * @param {string} [optionalSearchField] - An optional additional field to narrow down results.
 * @param {string} [optionalSearchValue] - The value for the optional search field.
 * @returns {Object} The application object if exactly one match is found.
 * @throws Will throw an error if no match is found, multiple matches exist, or if too many matches (>10) are returned.
 */
function findApplication(companyName, optionalSearchField, optionalSearchValue) {
    if (!companyName) {
        throw new Error('At least a company name must be provided to identify the application.');
    }

    const searchCriteria = {
        Company: companyName
    };
    if (optionalSearchField && optionalSearchValue) {
        searchCriteria[optionalSearchField] = optionalSearchValue
    }
    
    const matches = findSheetRows(SHEET_NAMES.APPLICATIONS, searchCriteria);

    if (matches.length === 0) {
        throw new Error(`No application found for criteria: ${JSON.stringify(searchCriteria)}`);
    }
    
    if (matches.length === 1) {
        return matches[0];
    }

    if (matches.length > 10) {
        throw new Error(
            `Too many applications (${matches.length}) found for company ${companyName}. Try using a uniquely identifying sub-field.`
        );
    }

    const matchSummary = matches
        .map((app, index) => (
            `${index + 1}. Date: ${formattedDate(app['Applied Date'])}, ` +
            `Location: ${app['Location']}, ` +
            `Listing Job Title: ${app['Listing Job Title']}, ` +
            `Notes: ${app['Notes']}`
        ))
        .join('\n');

    SpreadsheetApp.getUi().alert(
        `Multiple applications found for company ${companyName}:\n\n${matchSummary}\n\nTry using a uniquely identifying sub-field.`
    );

    throw new Error('Multiple applications found. Refine your search criteria.');
}

/**
 * Updates the `Status` field of each application object in the given array
 * by retrieving its current status using the application's `ID`.
 *
 * @param {Array<{ID: number, Status?: string}>} applications - 
 *   An array of application objects. Each object must have an `ID` property.
 *   A `Status` property will be added or updated on each object.
 *
 * @returns {void} This function mutates the input array by setting the `Status` property.
 */
function setApplicationStatusOnApplications(applications) {
    applications.forEach(app => {
        app.Status = getApplicationStatus(app.ID);
    });
}

module.exports = {
    findApplication,
    setApplicationStatusOnApplications,
}
