function logApplied() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();

  const inputValuesRange = ss.getRangeByName("LoggerInputValues");
  const inputValues = inputValuesRange.getValues().flat();
  const inputLabels = ss.getRangeByName("LoggerInputLabels").getValues().flat();

  // Validate Company input
  const companyValue = getInputValueByLabel("Company", inputLabels, inputValues);
  if (!companyValue || companyValue.trim() === "") {
    SpreadsheetApp.getUi().alert("Please enter a company name before logging.");
    return;
  }

  multiplySalaryByThousand(inputLabels, inputValues);

  // Save the row to Applied with inserted ID at the beginning
  const appliedSheet = ss.getSheetByName("Applied");
  appliedSheet.appendRow([Utilities.getUuid(), ...inputValues]);

  const newRowNumber = appliedSheet.getLastRow();
  const appliedHeaders = ss.getRangeByName("AppliedColumnNames").getValues().flat();

  formatDateCell(appliedSheet, newRowNumber, appliedHeaders.indexOf("Date") + 1);
  setAppliedSheetFormulas(appliedSheet, appliedHeaders, newRowNumber);
  resetInputValues(inputValuesRange, inputLabels, inputValues);

  ss.getRangeByName("LoggerListingJobTitle").activate();
  ss.getRangeByName("LoggerOverrideResume").clearContent();
}

function resetInputValues(inputValuesRange, inputLabels, inputValues) {
  setInputValueByLabel("Date", inputLabels, inputValues, "=today()");
  setInputValueByLabel("Company", inputLabels, inputValues, "");
  setInputValueByLabel("Listing Job Title", inputLabels, inputValues, "=LoggerRole");
  setInputValueByLabel("Link", inputLabels, inputValues, "");
  setInputValueByLabel("Yrs XP Min", inputLabels, inputValues, "");
  setInputValueByLabel("Salary Min (K)", inputLabels, inputValues, "");
  setInputValueByLabel("Salary Max (K)", inputLabels, inputValues, "");
  setInputValueByLabel("Specialization", inputLabels, inputValues, "");
  setInputValueByLabel("Resume Version", inputLabels, inputValues, '=if(LoggerOverrideResume="",LoggerSuggestedResume,LoggerOverrideResume)');
  setInputValueByLabel("Skill Gaps", inputLabels, inputValues, "");
  setInputValueByLabel("Notes", inputLabels, inputValues, "");
  setInputValueByLabel("Desired Salary", inputLabels, inputValues, "");
  
  inputValuesRange.setValues(inputValues.map(value => [value]));
}

function setAppliedSheetFormulas(sheet, headers, row) {
  const rejectionDateCol = getColumnLetterByHeader("Rejection Date", headers);
  const notSelectedIndeedCol = getColumnLetterByHeader("Not Selected (Indeed)", headers);
  const notSelectedPortalCol = getColumnLetterByHeader("Not Selected (Portal)", headers);
  const rejectedFormulaCol = getColumnLetterByHeader("Rejected", headers);
  const nextStepsFormulaCol = getColumnLetterByHeader("Next Steps", headers);
  const idCol = getColumnLetterByHeader("ID", headers);

  const rejectedFormula = `=OR(${rejectionDateCol}${row}<>"", ${notSelectedIndeedCol}${row}<>"", ${notSelectedPortalCol}${row}<>"")`;
  sheet.getRange(rejectedFormulaCol + row).setFormula(rejectedFormula);

  const nextStepsFormula = `=IF(ISNUMBER(MATCH(${idCol}${row}, NextStepsID, 0)), TRUE, FALSE)`;
  sheet.getRange(nextStepsFormulaCol + row).setFormula(nextStepsFormula);
}

function getColumnLetterByHeader(label, headerLabels) {
  const index = headerLabels.indexOf(label);
  if (index === -1) {
    throw new Error(`Label "${label}" not found in header labels`);
  }
  return String.fromCharCode(65 + index); // 65 = 'A'
}

function multiplySalaryByThousand(labels, values) {
  const salaryFields = ["Salary Min (K)", "Salary Max (K)", "Desired Salary"];
  salaryFields.forEach(label => {
    const index = labels.indexOf(label);
    if (index === -1) throw new Error(`Label "${label}" not found`);
    const currentValue = values[index];
    if (currentValue !== "" && !isNaN(currentValue)) {
      values[index] = currentValue * 1000;
    }
  });
}