// Google Apps Script solution for write operations with CORS support
// Deploy this as a web app in Google Apps Script

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('1UJ0jRXq_Bb_J-2x0zpLcoj79wvHQhFsjkebICxMEaQk');
    
    let result;
    switch(data.action) {
      case 'addCheckout':
        result = addCheckout(sheet, data.checkout);
        break;
      case 'markReturned':
        result = markReturned(sheet, data.checkoutId);
        break;
      case 'updateEquipment':
        result = updateEquipment(sheet, data.equipmentId, data.available);
        break;
      default:
        result = ContentService.createTextOutput(JSON.stringify({error: 'Unknown action'}));
    }
    
    // Add CORS headers
    return result
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
      
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}))
      .setMimeType(ContentService.MimeType.JSON)
      .setHeaders({
        'Access-Control-Allow-Origin': '*',
        'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      });
  }
}

// Handle preflight OPTIONS request
function doOptions(e) {
  return ContentService.createTextOutput('')
    .setMimeType(ContentService.MimeType.TEXT)
    .setHeaders({
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'POST, GET, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type',
      'Access-Control-Max-Age': '86400'
    });
}

function addCheckout(sheet, checkout) {
  try {
    const checkoutSheet = sheet.getSheetByName('Checkouts');
    const equipmentSheet = sheet.getSheetByName('Equipment');
    
    // Get next ID
    const lastRow = checkoutSheet.getLastRow();
    const nextId = lastRow > 1 ? checkoutSheet.getRange(lastRow, 1).getValue() + 1 : 1;
    
    // Add new checkout row
    checkoutSheet.appendRow([
      nextId,
      checkout.studentName,
      checkout.studentId,
      checkout.studentEmail,
      checkout.studentMajor,
      checkout.facultySponsor,
      checkout.staffMember,
      checkout.checkoutDate,
      checkout.returnDate,
      checkout.equipmentId,
      checkout.equipmentName,
      checkout.serialNumber,
      false, // returned
      checkout.comments || ''
    ]);
    
    // Update equipment availability
    const equipmentData = equipmentSheet.getDataRange().getValues();
    for (let i = 1; i < equipmentData.length; i++) {
      if (equipmentData[i][0] === checkout.equipmentId) {
        equipmentSheet.getRange(i + 1, 5).setValue(false); // Column E (Available)
        break;
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true, id: nextId}));
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}

function markReturned(sheet, checkoutId) {
  try {
    const checkoutSheet = sheet.getSheetByName('Checkouts');
    const equipmentSheet = sheet.getSheetByName('Equipment');
    
    // Find and update checkout
    const checkoutData = checkoutSheet.getDataRange().getValues();
    let equipmentId = null;
    
    for (let i = 1; i < checkoutData.length; i++) {
      if (checkoutData[i][0] === checkoutId) {
        checkoutSheet.getRange(i + 1, 13).setValue(true); // Column M (Returned)
        equipmentId = checkoutData[i][9]; // Column J (Equipment ID)
        break;
      }
    }
    
    // Update equipment availability
    if (equipmentId) {
      const equipmentData = equipmentSheet.getDataRange().getValues();
      for (let i = 1; i < equipmentData.length; i++) {
        if (equipmentData[i][0] === equipmentId) {
          equipmentSheet.getRange(i + 1, 5).setValue(true); // Column E (Available)
          break;
        }
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true}));
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}

function updateEquipment(sheet, equipmentId, available) {
  try {
    const equipmentSheet = sheet.getSheetByName('Equipment');
    
    // Find and update equipment
    const equipmentData = equipmentSheet.getDataRange().getValues();
    for (let i = 1; i < equipmentData.length; i++) {
      if (equipmentData[i][0] === equipmentId) {
        equipmentSheet.getRange(i + 1, 5).setValue(available); // Column E (Available)
        break;
      }
    }
    
    return ContentService.createTextOutput(JSON.stringify({success: true}));
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}
