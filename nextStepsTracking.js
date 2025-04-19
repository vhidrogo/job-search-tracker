const LAST_APPLIED_COPY_COL = "Resume Version"
const INTERVIEW_STAGE_COUNT = 6

function logInterviewStage() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const inputLabels = ss.getRangeByName("InterviewStageLoggerInputLabels").getValues().flat();
  const inputValuesRange = ss.getRangeByName("InterviewStageLoggerInputValues");
  const inputValues = to1DArray(inputValuesRange.getValues());

  const searchField = getInputValue("Next Steps Search Field", inputLabels, inputValues);
  const searchValue = getInputValue("Next Steps Search Value", inputLabels, inputValues);
  const interviewDate = getInputValue("Interview Date", inputLabels, inputValues);
  const interviewStage = getInputValue("Interview Stage", inputLabels, inputValues);

  const rowNumber = findRowInNamedRange(ss, "Next Steps" + searchField, searchField, searchValue);

  // Reste inputs
  setInputValueByLabel("Next Steps Search Field", inputLabels, inputValues, "Company");
  setInputValueByLabel("Next Steps Search Value", inputLabels, inputValues, "");
  setInputValueByLabel("Interview Date", inputLabels, inputValues, "");
  setInputValueByLabel("Interview Stage", inputLabels, inputValues, "Recruiter Screen");
  inputValuesRange.setValues(to2DColumnArray(inputValues));

  const nextStepsSheet = ss.getSheetByName("NextSteps");
  const nextStepsHeaders = to1DArray(ss.getRangeByName("NextStepsHeaders").getValues());
  const currentInterviewStageNumber = getCurrentInterviewStageNumber(nextStepsSheet, nextStepsHeaders, rowNumber);
  
  const stageColNumber = nextStepsHeaders.indexOf(`Stage ${currentInterviewStageNumber}`) + 1;
  nextStepsSheet.getRange(rowNumber, stageColNumber).setValue(interviewStage);
  
  const stageDateColNumber = nextStepsHeaders.indexOf(`Stage ${currentInterviewStageNumber} Date`) + 1;
  nextStepsSheet.getRange(rowNumber, stageDateColNumber).setValue(interviewDate);
  formatDateCell(nextStepsSheet, rowNumber, stageDateColNumber);

  if (ss.getRangeByName("InterviewStageLoggerCheckbox").getValue()) {
    applyNextStepsFilterByID(nextStepsSheet, nextStepsHeaders, rowNumber);
  }
}

function applyNextStepsFilterByID(sheet, headers, rowNumber) {
  const range = sheet.getDataRange();

  let filter = range.getFilter();
  if (filter) filter.remove();
  range.createFilter();
  filter = range.getFilter();

  const colNumber = headers.indexOf("ID") + 1;
  const id = sheet.getRange(rowNumber, colNumber).getValue();
  
  filter.setColumnFilterCriteria(colNumber, SpreadsheetApp.newFilterCriteria().whenTextEqualTo(id));
}

function getCurrentInterviewStageNumber(sheet, headers, rowNumber) {
  let i = 1;
  while (i <= INTERVIEW_STAGE_COUNT) {
    const colNumber = headers.indexOf(`Stage ${i}`) + 1;
    if (!sheet.getRange(rowNumber, colNumber).getValue()) {
      return i;
    }
    i++;
  }
}

function logNextSteps() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const inputLabels = ss.getRangeByName("NextStepsLoggerInputLabels").getValues().flat();
  const inputValuesRange = ss.getRangeByName("NextStepsLoggerInputValues");
  const inputValues = to1DArray(inputValuesRange.getValues());

  const searchField = getInputValue("Applied Search Field", inputLabels, inputValues);
  const searchValue = getInputValue("Applied Search Value", inputLabels, inputValues);
  const rowNumber = findRowInNamedRange(ss, "Applied" + searchField, searchField, searchValue);

  const appliedHeaders = to1DArray(ss.getRangeByName("AppliedColumnNames").getValues());
  const rowValues = getAppliedRowValues(ss, rowNumber, appliedHeaders);

  const source = getInputValueByLabel("Source", appliedHeaders, rowValues);
  const callbackDateInput = getInputValueByLabel("Callback Date", inputLabels, inputValues);
  const callbackDate = getCallbackDate(source, callbackDateInput);

  const fileName = getFileName(appliedHeaders, rowValues);
  const jobDescriptionLink = createJobDescriptionDoc(ss, fileName);
  const interviewNotesLink = copyInterviewNotesDoc(ss, fileName);

  const resumeVersion = getInputValueByLabel("Resume Version", appliedHeaders, rowValues);

  const resumeLink = resumeVersion === "Tailored"
    ? getTailoredResumeLink(fileName)
    : getResumeVersionLink(ss, resumeVersion);

  // Add new row values
  rowValues.push(resumeLink);
  rowValues.push(jobDescriptionLink);
  rowValues.push(interviewNotesLink);
  rowValues.push(callbackDate);
  
  const nextStepsSheet = ss.getSheetByName("NextSteps");
  const nextStepsHeaders = to1DArray(ss.getRangeByName("NextStepsHeaders").getValues());
  nextStepsSheet.appendRow(rowValues);
  const newRowNumber = nextStepsSheet.getLastRow();
  
  // Format the date columns
  const callbackDateColumn = nextStepsHeaders.indexOf("Callback Date") + 1
  formatDateCell(nextStepsSheet, newRowNumber, callbackDateColumn);
  formatDateCell(nextStepsSheet, newRowNumber, appliedHeaders.indexOf("Date") + 1);

  // Reset inputs
  setInputValueByLabel("Applied Search Field", inputLabels, inputValues, "Company");
  setInputValueByLabel("Applied Search Value", inputLabels, inputValues, "");
  setInputValueByLabel("Callback Date", inputLabels, inputValues, "=today()");
  inputValuesRange.setValues(to2DColumnArray(inputValues));

  if (ss.getRangeByName("NextStepsLoggerCheckbox").getValue()) {
    applyNextStepsFilterByID(nextStepsSheet, nextStepsHeaders, newRowNumber);
  }
}

function getResumeVersionLink(ss, version) {
    const allVersions = to1DArray(ss.getRangeByName("ResumeLinksVersion").getValues());
    const index = allVersions.findIndex(value => value === version)
    if (index === -1) {
      throw new Error(`Resume link missing for version "${version}"`);
    }
    const links = to1DArray(ss.getRangeByName("ResumeLinksLink").getValues());
    return links[index];
}

function getTailoredResumeLink(fileName) {
  // TODO: Search for tailored resume in tailored resumes folder
  return "";
}

function copyInterviewNotesDoc(ss, fileName) {
  const copy = DriveApp.getFileById(ss.getRangeByName("DataInterviewNotesTemplateFileID").getValue()).makeCopy();
  copy.setName(fileName);
  moveFileToFolder(copy.getId(), ss.getRangeByName("DataInterviewNotesDriveFolderID").getValue());
  return copy.getUrl();
}

function createJobDescriptionDoc(ss, fileName) {
  const doc = DocumentApp.create(fileName);
  moveFileToFolder(doc.getId(), ss.getRangeByName("DataJDDriveFolderID").getValue());
  return doc.getUrl();
}

function moveFileToFolder(fileId, folderId) {
  const folder = DriveApp.getFolderById(folderId);
  DriveApp.getFileById(fileId).moveTo(folder);
}

function getFileName(headers, data) {
  const date = formattedDate(getInputValueByLabel("Date", headers, data));
  const jobTitle = getInputValueByLabel("Role", headers, data);
  const companyName = getInputValueByLabel("Company", headers, data);
  
  return `${date} ${jobTitle} at ${companyName}`;
}

function getCallbackDate(source, callbackDateInput) {
  if (source.includes("Recruiter")) return "N/A";
  if (!callbackDateInput) {
    throw new Error("Callback Date required.");
  }
  return callbackDateInput;
}

function getAppliedRowValues(ss, row, headers) {
  const sheet = ss.getSheetByName("Applied");
  const col = headers.indexOf(LAST_APPLIED_COPY_COL) + 1;
  return to1DArray(sheet.getRange(row, 1, 1, col).getValues());
}

function findRowInNamedRange(ss, rangeName, searchField, searchValue) {
  const rangeValues = to1DArray(ss.getRangeByName(toRangeName(rangeName)).getValues());
  return findRowIndexOrThrow(rangeValues, searchField, searchValue) + 1;
}

function findRowIndexOrThrow(rangeValues, searchField, searchValue) {
  const matchIndexes = findMatchingIndexes(rangeValues, searchValue);

  if (matchIndexes.length === 0) {
    throw new Error(`No ${searchField} match found for ${searchValue}`);
  } else if (matchIndexes.length > 1) {
    throw new Error(`Multiple ${searchField} matches found for ${searchValue}`);
  }

  return matchIndexes[0];
}

function findMatchingIndexes(rangeValues, searchValue) {
  return rangeValues
    .map((value, i) =>
      value.toString().toLowerCase().includes(searchValue.toLowerCase()) ? i : -1
    )
    .filter(index => index !== -1);
}

function getInputValue(label, labelsArray, valuesArray) {
  const value = getInputValueByLabel(label, labelsArray, valuesArray);
  if (!value) {
    throw new Error(`${label} required.`)
  }
  return value;
}