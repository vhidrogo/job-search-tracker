const APPLICATIONS_SHEET_NAME = 'Applications';

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
    
    const matches = findSheetRows(APPLICATIONS_SHEET_NAME, searchCriteria);

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

module.exports = { findApplication }
