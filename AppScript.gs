function trigger(e) {
  var sheet = e.source.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var column = 13;

  if (e.range.getValue()) {
    for (var row = 2; row <= lastRow; row++) {
      var cell = sheet.getRange(row, column);
      Logger.log(sheet.getRange(row, column + 1).getValue());
      if (cell.getValue() === true && sheet.getRange(row, column + 1).getValue() == "") {
        takeScreenshot(cell);
      }
    }
  }
}

function takeScreenshot(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var url = sheet.getRange("G" + e.getRow()).getValue();
  const apiKey = "5S6k0XoVtOXixXeu"; // Replace with your API key
  const apiSecret = "8e92f8533a8644b197a9c4b6e3d8c5ca"; // Replace with your API secret
  var format = "jpeg"; 

  // Construct the query string
  var queryString = "url=" + encodeURIComponent(url) +"&click_accept=True&hide_cookie_banners=true&block_ads=true&height=650&response_type=json"
  
  // Generate the auth token
  
  // Construct the authenticated API URL
  var apiUrl = "https://api.urlbox.io/v1/" + apiKey + "/" + "/" + format + "?" + queryString


  Logger.log(apiUrl);
  
  var response = UrlFetchApp.fetch(apiUrl);

  // Create or get the "screenshots" folder
  var rootFolder = DriveApp.getRootFolder();
  var folderName = "screenshots";
  var folder;
  var folders = rootFolder.getFoldersByName(folderName);
  if (folders.hasNext()) {
    folder = folders.next();
  } else {
    folder = rootFolder.createFolder(folderName);
  }
  
  // Save the image to the "screenshots" folder
  var imageBlob = response.getBlob();
  var timestamp = new Date().getTime();
  var fileName = "screenshot_" + timestamp + ".jpeg"; // Customize the filename
  var file = folder.createFile(imageBlob.setName(fileName));
  
  var imageUrl = file.getUrl();
  
  // Update the spreadsheet with the image link
  var row = e.getRow();
  sheet.getRange("N" + row).setValue(imageUrl);
  
  Logger.log("Image saved to Google Drive: " + file.getName());
}
