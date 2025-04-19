function addResumeLink() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  
  const inputRange = ss.getRangeByName("AddResumeLinkInputValues");
  const inputValues = to1DArray(inputRange.getValues());
  const inputLabels = to1DArray(ss.getRangeByName("AddResumeLinkInputLabels").getValues());

  const link = getInputValueByLabel("Link", inputLabels, inputValues);
  if (!link || link.trim() === "") {
    throw new Error("Resume link required.");
    return;
  }

  // Add the row with the version key at the beginning
  ss.getSheetByName("ResumeLinks").appendRow(
    [getVersionKey(inputLabels, inputValues), ...inputValues]
    );

  // Reset Inputs
  setInputValueByLabel("Date", inputLabels, inputValues, "=today()");
  setInputValueByLabel("Role", inputLabels, inputValues, "SWE");
  setInputValueByLabel("Major Changes", inputLabels, inputValues, "");
  setInputValueByLabel("Minor Changes", inputLabels, inputValues, "");
  inputRange.setValues(to2DColumnArray(inputValues));

  ss.getRangeByName("AddResumeLinkDate").activate()
}

function getVersionKey(inputLabels, inputValues) {
  const role = getInputValueByLabel("Role", inputLabels, inputValues);
  const date = formattedDate(getInputValueByLabel("Date", inputLabels, inputValues));
  return `${role} ${date}`;
}