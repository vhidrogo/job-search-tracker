/**
 * Finds an application in the Applications sheet based on up to two search criteria.
 *
 * @param {string} searchField - The required field to search by.
 * @param {string} searchValue - The value for the required search field.
 * @param {string} [optionalSearchField] - An optional additional field to search by.
 * @param {string} [optionalSearchValue] - The value for the optional search field.
 * @returns {Object} The application object if exactly one match is found.
 * @throws Will throw an error if no match is found or if multiple matches exist.
 */
function findApplication(searchField, searchValue, optionalSearchField, optionalSearchValue) {
    if (!searchField || !searchValue) {
        throw new Error('A required search field and value must be provided.');
    }

    const searchCriteria = {
        [searchField]: searchValue
    };
    if (optionalSearchField && optionalSearchValue) {
        searchCriteria[optionalSearchField] = optionalSearchValue
    }
    
    const matches = findSheetRows('Applications', searchCriteria);

    if (matches.length === 0) {
        throw new Error(`No application found for criteria: ${JSON.stringify(searchCriteria)}`);
    }
    
    if (matches.length === 1) {
        return matches[0];
    }

    if (matches.length > 10) {
        throw new Error(`Too many applications (${matches.length}) found. Add additional search criteria.`);
    }

    const matchSummary = matches
        .map((app, index) => `${index + 1}. Date: ${formattedDate(app['Applied Date'])}, Listing Job Title: ${app['Listing Job Title']}`)
        .join('\n');

    SpreadsheetApp.getUi().alert(
        `Multiple applications found:\n\n${matchSummary}\n\nPlease refine your search criteria.`
    );

    throw new Error('Multiple applications found. Refine your search criteria.');
}
