function copyDriveDocToFolder(targetFileId, destinationFolderId, destinationFileName) {
    const copy = DriveApp.getFileById(targetFileId).makeCopy();
    copy.setName(destinationFileName);
    moveFileToFolder(copy.getId(), destinationFolderId);
    return copy.getUrl();
}

function moveFileToFolder(fileId, folderId) {
  const folder = DriveApp.getFolderById(folderId);
  DriveApp.getFileById(fileId).moveTo(folder);
}

module.exports = { copyDriveDocToFolder }
