/**
 * Triggered when a cell value changes in the active sheet.
 * @param {Object} e - The event object containing information about the change.
 */
function trigger(e) {
  var sheet = e.source.getActiveSheet();
  var lastRow = sheet.getLastRow();
  var column = 14;

  if (e.range.getValue()) {
    for (var row = 2; row <= lastRow; row++) {
      var cell = sheet.getRange(row, column);
      if (cell.getValue() === true) {
        if (sheet.getRange(row, column + 1).getValue() === "") {
          takeScreenshot(cell);
        }
        if (sheet.getRange(row, 8).getValue() === "") {
          fetchData(cell);
        }
      }
    }
  }
}

/**
 * Takes a screenshot of the provided URL and updates the spreadsheet with the image link.
 * @param {Object} e - The cell containing the URL.
 */
function takeScreenshot(e) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var url = sheet.getRange("G" + e.getRow()).getValue();
  const apiKey = "lzsYYf27CP3Fpz4b"; // Replace with your API key
  var format = "jpeg"; 

  // Construct the query string
  var queryString = "url=" + encodeURIComponent(url) +
    "&click_accept=True&hide_cookie_banners=true&block_ads=true&height=650&scroll_to=%23page&response_type=json";
  
  // Construct the authenticated API URL
  var apiUrl = "https://api.urlbox.io/v1/" + apiKey + "/" + format + "?" + queryString;
  var response = UrlFetchApp.fetch(apiUrl);

  // Update the spreadsheet with the image link
  var row = e.getRow();
  sheet.getRange("o" + row).setValue(JSON.parse(response).renderUrl);
}

/**
 * Fetches data from the provided URL and updates the spreadsheet with the scraped value.
 * @param {Object} cell - The cell containing the URL.
 * @returns {string} - The scraped value.
 */
function fetchData(cell) {
  var sheet = SpreadsheetApp.getActiveSpreadsheet().getActiveSheet();
  var url = sheet.getRange("G" + cell.getRow()).getValue();
  var response = UrlFetchApp.fetch(url).getContentText();
  var $ = Cheerio.load(response);

  var row = cell.getRow();
  var valueToScrape = $(".dark\\:text-dj-mono-dark-200.text-2xl.font-medium").text();

  Logger.log(valueToScrape);
  
  // Find the index of the last character that is a number
  var lastIndex = valueToScrape.search(/\d(?![^\d]*\d)/);
  
  // Extract and trim the substring from the beginning until the last number
  valueToScrape = valueToScrape.slice(0, lastIndex + 1).trim();

  sheet.getRange("H" + row).setValue(valueToScrape);

  return valueToScrape;
}
