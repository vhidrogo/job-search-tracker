const { formattedDate } = require("../utilities");
const { getNamedRangeValue } = require("./dataSheetUtils");
const { relatedLoggerWorkflow } = require("./relatedLogger");

function onConsiderationLoggerLogClick() {
    const requiredFields = [
        'Initiation Method',
        'Date Initiated',
    ];

    const defaultsMap = {
        'Initiation Method': 'Recruiter',
        'Date Initiated': '=today()',
    };

    const appSearchInputs = getInputsFromSheetUI('ConsiderationLogger_AppSearchInputs');
    const application = findApplication(...appSearchInputs.values());

    const fileName = `${formattedDate(application['Applied Date'])} ${application['Role']} at ${application['Company']}`;

    const suffixValues = [
        createJobDescriptionDoc(fileName),
        copyInterviewDoc(fileName),
    ];
    
    relatedLoggerWorkflow({
        relatedName: 'Consideration',
        applicationId: application['ID'],
        requiredFields: requiredFields,
        defaultsMap: defaultsMap,
        suffixValues: suffixValues
    });
}

function copyInterviewDoc(fileName) {
  const copy = DriveApp.getFileById(getNamedRangeValue('DataInterviewNotesTemplateFileID')).makeCopy();
  copy.setName(fileName);
  moveFileToFolder(copy.getId(), getNamedRangeValue('DataInterviewNotesDriveFolderID'));
  return copy.getUrl();
}

function createJobDescriptionDoc(fileName) {
  const doc = DocumentApp.create(fileName);
  moveFileToFolder(doc.getId(), getNamedRangeValue('DataJDDriveFolderID'));
  return doc.getUrl();
}

function moveFileToFolder(fileId, folderId) {
  const folder = DriveApp.getFolderById(folderId);
  DriveApp.getFileById(fileId).moveTo(folder);
}