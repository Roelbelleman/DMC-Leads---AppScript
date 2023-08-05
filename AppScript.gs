function trigger(e) {
  var sheet = e.source.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var column = 13;

  if (e.range.getValue()) {
    for (var row = 2; row <= lastRow; row++) {
      var cell = sheet.getRange(row, column);
      if (cell.getValue() === true && sheet.getRange(row, column + 1).getValue() == "") {
        takeScreenshot(cell);
      }
    }
  }
}

function takeScreenshot(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var url = sheet.getRange("G" + e.getRow()).getValue();
  const apiKey = "lzsYYf27CP3Fpz4b"; // Replace with your API key
  var format = "jpeg"; 

  // Construct the query string
  var queryString = "url=" + encodeURIComponent(url) +"&click_accept=True&hide_cookie_banners=true&block_ads=true&height=650&response_type=json"
  
  // Generate the auth token
  
  // Construct the authenticated API URL
  var apiUrl = "https://api.urlbox.io/v1/" + apiKey + "/" + "/" + format + "?" + queryString
  var response = UrlFetchApp.fetch(apiUrl);

  // Update the spreadsheet with the image link
  var row = e.getRow();
  sheet.getRange("N" + row).setValue(JSON.parse(response).renderUrl);
}
