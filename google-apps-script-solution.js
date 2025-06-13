// Google Apps Script solution for write operations
// Deploy this as a web app in Google Apps Script

function doPost(e) {
  try {
    const data = JSON.parse(e.postData.contents);
    const sheet = SpreadsheetApp.openById('1UJ0jRXq_Bb_J-2x0zpLcoj79wvHQhFsjkebICxMEaQk');
    
    switch(data.action) {
      case 'addCheckout':
        return addCheckout(sheet, data.checkout);
      case 'markReturned':
        return markReturned(sheet, data.checkoutId);
      case 'updateEquipment':
        return updateEquipment(sheet, data.equipmentId, data.available);
      default:
        return ContentService.createTextOutput(JSON.stringify({error: 'Unknown action'}));
    }
  } catch (error) {
    return ContentService.createTextOutput(JSON.stringify({error: error.toString()}));
  }
}

function addCheckout(sheet, checkout) {
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
  
  return ContentService.createTextOutput(JSON.stringify({success: true}));
}

function markReturned(sheet, checkoutId) {
  const checkoutSheet = sheet.getSheetByName('Checkouts');
  const equipmentSheet = sheet.getSheetByName('Equipment');
  
  // Find and update checkout
  const checkoutData = checkoutSheet.getDataRange().getValues();
  let equipmentId = null;
  
  for (let i = 1; i < checkoutData.length; i++) {
    if (checkoutData[i][0] === checkoutId) {
      checkoutSheet.getRange(i + 1, 12).setValue(true); // Column L (Returned)
      equipmentId = checkoutData[i][8]; // Column I (Equipment ID)
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
}
