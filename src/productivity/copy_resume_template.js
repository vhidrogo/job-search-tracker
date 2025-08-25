const { NAMED_RANGES } = require("../constants");
const { getNamedRangeValue, setNamedRangeValue } = require("../helpers/dataSheetHelpers");
const { formattedDate } = require("../utilities");
const { copyDriveDocToFolder } = require("../utils/driveAppUtils");

function copyResumeTemplate() {
    const company = getNamedRangeValue(NAMED_RANGES.APPLICATION_LOGGER.COMPANY);
    if (!company || company.trim() === '') {
        SpreadsheetApp.getUi().alert('Company name required.');
        return;
    }
    setNamedRangeValue(NAMED_RANGES.APPLICATION_LOGGER.RESUME, '');

    const templateId = getNamedRangeValue(NAMED_RANGES.DATA.RESUME_TEMPLATE_FILE_ID);
    const folderId = getNamedRangeValue(NAMED_RANGES.DATA.TAILORED_RESUMES_DRIVE_FOLDER_ID);
    const fileName = `${formattedDate(new Date())} ${company}`;

    const copyUrl = copyDriveDocToFolder(templateId, folderId, fileName)
    
    setNamedRangeValue(NAMED_RANGES.APPLICATION_LOGGER.RESUME, copyUrl);
}