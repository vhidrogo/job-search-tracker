const { NAMED_RANGES } = require("../constants");
const { getNamedRangeValue, setNamedRangeValue } = require("../helpers/dataSheetHelpers");
const { getInputsFromSheetUI } = require("../helpers/sheetUiHelpers");
const { formattedDate } = require("../utilities");
const { copyDriveDocToFolder } = require("../utils/driveAppUtils");

function copyResumeTemplate() {
    const ui = SpreadsheetApp.getUi();

    const company = getNamedRangeValue(NAMED_RANGES.APPLICATION_LOGGER.COMPANY);
    if (!company || company.trim() === '') {
        ui.alert('Company name required.');
        return;
    }
    setNamedRangeValue(NAMED_RANGES.APPLICATION_LOGGER.RESUME, '');

    const resumeTemplate = getNamedRangeValue(NAMED_RANGES.APPLICATION_LOGGER.RESUME_TEMPLATE);
    if (!resumeTemplate) {
        ui.alert('Select a resume template from the dropdown and try again.');
        return;
    }

    let templateId;
    try {
        templateId = getResumeTemplateFileID(resumeTemplate);
    } catch (e) {
        ui.alert(e.message);
        return;
    }

    const folderId = getNamedRangeValue(NAMED_RANGES.DATA.TAILORED_RESUMES_DRIVE_FOLDER_ID);
    const fileName = `${formattedDate(new Date())} ${company}`;

    const copyUrl = copyDriveDocToFolder(templateId, folderId, fileName)
    
    setNamedRangeValue(NAMED_RANGES.APPLICATION_LOGGER.RESUME, copyUrl);
}

function getResumeTemplateFileID(selectedTemplate) {
    const resumeTemplates = getInputsFromSheetUI('Data_ResumeTemplates');

    if (!resumeTemplates.has(selectedTemplate)) {
        throw new Error(`Resume template label "${selectedTemplate}" does not exist.`);
    }

    if (resumeTemplates.get(selectedTemplate).trim() === '') {
        throw new Error(`File ID missing for resume template with label "${selectedTemplate}.`);
    }

    return resumeTemplates.get(selectedTemplate);
}