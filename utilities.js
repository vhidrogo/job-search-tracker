function getInputValueByLabel(label, labelsArray, valuesArray) {
  const index = labelsArray.indexOf(label);
  if (index === -1) {
    throw new Error(`Label "${label}" not found in input labels`);
  }
  return valuesArray[index];
}

function setInputValueByLabel(label, labelsArray, valuesArray, newValue) {
  const index = labelsArray.indexOf(label);
  if (index === -1) {
    throw new Error(`Label "${label}" not found in input labels`);
  }
  valuesArray[index] = newValue;
}

function formatDateCell(sheet, row, col) {
  sheet.getRange(row, col).setNumberFormat("MM-dd-yy");
}

function formattedDate(date) {
  return Utilities.formatDate(new Date(date), Session.getScriptTimeZone(), "yyyyMMdd");
}

function backfillUUIDs() {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName("Applied");
  const dataRange = sheet.getDataRange();
  const values = dataRange.getValues();
  
  const header = values[0];
  const idColIndex = header.indexOf("ID");

  if (idColIndex === -1) {
    throw new Error("No 'ID' column found.");
  }

  // Start at row 2 to skip header
  for (let row = 1; row < values.length; row++) {
    if (!values[row][idColIndex]) {
      const uuid = Utilities.getUuid();
      sheet.getRange(row + 1, idColIndex + 1).setValue(uuid); // +1 because ranges are 1-based
    }
  }
}

function toRangeName(rawName) {
  return rawName.replace(/ /g, "");
}

function to1DArray(twoDarray) {
  return twoDarray.flat();
}

function to2DColumnArray(array) {
  return array.map(value => [value]);
}