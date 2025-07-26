const { NAMED_RANGES, SHEET_NAMES, METRIC_LABELS } = require("../constants");
const { getApplicationStatus, ApplicationStatus } = require("../helpers/getApplicationStatus");
const { getNamedRangeValue, findSheetRows } = require("../loggers/helpers/dataSheetHelpers");
const { writeToNamedRangeWithHeaders, setInputsOnSheetUI } = require("../loggers/helpers/sheetUiHelpers");

function onCompanyViewFindClick() {
    const company = getNamedRangeValue(NAMED_RANGES.CompanyView.COMPANY_NAME);
    if (!company) {
        SpreadsheetApp.getUi().alert('Company name required.');
    }
    
    const companyApplications = findSheetRows(SHEET_NAMES.APPLICATIONS, { Company: company });

    const companyMetrics = getCompanyMetrics(companyApplications);
    setInputsOnSheetUI(NAMED_RANGES.CompanyView.METRICS, companyMetrics);

    companyApplications.sort((a, b) => {
        const dateA = new Date(a['Applied Date']);
        const dateB = new Date(b['Applied Date']);
        return dateB - dateA;
    })
    
    companyApplications.forEach(app => {
        app.Status = getApplicationStatus(app.ID);
    });

    writeToNamedRangeWithHeaders(companyApplications, NAMED_RANGES.CompanyView.LATEST_APPLICATIONS);
}

function getCompanyMetrics(companyApplications) {
    let rejectionCount = 0;
    for (const application in companyApplications) {
        if (application.status === ApplicationStatus.REJECTED) rejectionCount++;
    }

    const metrics = new Map();
    metrics.set(METRIC_LABELS.CompanyView.APPLIED_COUNT, companyApplications.length);
    metrics.set(METRIC_LABELS.CompanyView.REJECTION_COUNT, rejectionCount);

    return metrics;
}
