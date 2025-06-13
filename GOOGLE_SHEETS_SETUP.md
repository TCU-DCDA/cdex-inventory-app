# Google Sheets Integration Setup Guide

This guide will help you set up Google Sheets integration for your CDEx Inventory Management app.

## Prerequisites

1. **Google Account** - You need a Google account to access Google Sheets and the Google Cloud Platform
2. **Google Sheets Document** - Create a new Google Sheets document for your inventory data
3. **Google Cloud Project** - Set up a Google Cloud project to enable the Sheets API

## Step 1: Create Your Google Sheets Document

1. Go to [Google Sheets](https://sheets.google.com) and create a new spreadsheet
2. Name it "CDEx Inventory Management"
3. Create two worksheets (tabs):

### Equipment Sheet
- **Sheet Name:** `Equipment`
- **Columns (Row 1 - Headers):**
  - A1: `ID`
  - B1: `Name`
  - C1: `Category`
  - D1: `Serial Number`
  - E1: `Available`

### Sample Equipment Data (Rows 2+):
```
ID | Name           | Category                     | Serial Number | Available
1  | Canon EOS R5   | Video Camera - Professional  | CR5001       | TRUE
2  | Canon EOS R5   | Video Camera - Professional  | CR5002       | FALSE
3  | Sony FX3       | Video Camera - Professional  | SF3001       | TRUE
4  | Canon EOS R6   | Video Camera - Standard      | CR6001       | TRUE
5  | Blue Yeti      | Yeti Microphone              | BY001        | TRUE
6  | MacBook Pro 16"| Mac Laptop                   | MBP001       | TRUE
```

### Checkouts Sheet
- **Sheet Name:** `Checkouts`
- **Columns (Row 1 - Headers):**
  - A1: `ID`
  - B1: `Student Name`
  - C1: `Student ID`
  - D1: `Student Email`
  - E1: `Student Major`
  - F1: `Faculty Sponsor`
  - G1: `Checkout Date`
  - H1: `Return Date`
  - I1: `Equipment ID`
  - J1: `Equipment Name`
  - K1: `Serial Number`
  - L1: `Returned`
  - M1: `Comments`

### Sample Checkout Data (Rows 2+):
```
ID | Student Name  | Student ID | Student Email        | Student Major | Faculty Sponsor | Checkout Date | Return Date | Equipment ID | Equipment Name | Serial Number | Returned | Comments
1  | Sarah Johnson | SJ12345    | sarah.johnson@tcu.edu| Film Production| Dr. Smith      | 2024-06-10    | 2024-06-17  | 2           | Canon EOS R5   | CR5002       | FALSE    | Senior capstone project
2  | Mike Chen     | MC67890    | mike.chen@tcu.edu    | Journalism    | Prof. Johnson   | 2024-06-08    | 2024-06-15  | 6           | MacBook Pro 16"| MBP001       | FALSE    | Documentary editing
```

## Step 2: Make Your Sheet Public (Read-Only Method)

**For simple read-only access:**

1. Click the "Share" button in the top-right corner of your Google Sheet
2. Click "Change to anyone with the link"
3. Set permissions to "Viewer"
4. Copy the sharing link
5. Extract the Sheet ID from the URL

**Example URL:** `https://docs.google.com/spreadsheets/d/1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms/edit#gid=0`

**Sheet ID:** `1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms`

## Step 3: Enable Google Sheets API (For Full Integration)

**For read/write access with API key:**

1. Go to the [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project or select an existing one
3. Enable the Google Sheets API:
   - Go to "APIs & Services" > "Library"
   - Search for "Google Sheets API"
   - Click on it and press "Enable"

4. Create an API Key:
   - Go to "APIs & Services" > "Credentials"
   - Click "Create Credentials" > "API Key"
   - Copy the generated API key
   - (Optional) Restrict the key to only the Sheets API for security

## Step 4: Configure Your Application

1. Open `/src/utils/googleSheets.ts`
2. Replace the placeholder values:

```typescript
const SHEETS_CONFIG = {
  // Replace with your actual Google Sheets ID
  SHEET_ID: 'YOUR_GOOGLE_SHEET_ID_HERE', // <- Put your Sheet ID here
  EQUIPMENT_RANGE: 'Equipment!A:E',
  CHECKOUTS_RANGE: 'Checkouts!A:M',
  API_KEY: 'YOUR_GOOGLE_API_KEY_HERE', // <- Put your API key here
};
```

**Example configuration:**
```typescript
const SHEETS_CONFIG = {
  SHEET_ID: '1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms',
  EQUIPMENT_RANGE: 'Equipment!A:E',
  CHECKOUTS_RANGE: 'Checkouts!A:M',
  API_KEY: 'AIzaSyBnOKfBW9VCGfthJyEJOQ6uqgRNw_Zex8w',
};
```

## Step 5: Environment Variables (Production Setup)

For production deployment, it's recommended to use environment variables instead of hardcoding values:

1. Create a `.env` file in your project root:
```
VITE_GOOGLE_SHEETS_ID=1BxiMVs0XRA5nFMdKvBdBZjgmUUqptlbs74OgvE2upms
VITE_GOOGLE_API_KEY=AIzaSyBnOKfBW9VCGfthJyEJOQ6uqgRNw_Zex8w
```

2. Update the configuration to use environment variables:
```typescript
const SHEETS_CONFIG = {
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEETS_ID || 'YOUR_GOOGLE_SHEET_ID_HERE',
  EQUIPMENT_RANGE: 'Equipment!A:E',
  CHECKOUTS_RANGE: 'Checkouts!A:M',
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || 'YOUR_GOOGLE_API_KEY_HERE',
};
```

3. Add `.env` to your `.gitignore` file to keep credentials secure

## Step 6: Test the Integration

1. Start your development server: `npm run dev`
2. Open the application in your browser
3. Look for the status indicators in the header:
   - 🟢 "Google Sheets Connected" = Successfully configured
   - 🟡 "Local Storage Only" = Using fallback data
4. Use the "Refresh" button to test data loading
5. Try checking out equipment to test write operations

## Troubleshooting

### Common Issues:

1. **"Local Storage Only" Status**
   - Check that your Sheet ID and API key are correctly set
   - Verify the Google Sheets API is enabled in your Google Cloud project

2. **CORS Errors**
   - Make sure your sheet is publicly viewable (if using public method)
   - Check that the API key restrictions allow your domain

3. **Data Not Loading**
   - Verify the sheet structure matches the expected format
   - Check browser console for error messages
   - Ensure the sheet ranges are correct (`Equipment!A:E` and `Checkouts!A:M`)

4. **Permission Errors**
   - For public sheets: Ensure "Anyone with the link" can view
   - For API access: Check that the API key has proper permissions

### Read-Only vs Full Integration

**Current Implementation (API Key):**
- ✅ Read data from Google Sheets
- ✅ Fallback to local data if Sheets unavailable
- ✅ Optimistic updates (changes appear immediately in UI)
- ❌ Write operations will fail (API keys are read-only)

**Limitation:** API keys only provide read-only access to public Google Sheets. Write operations require OAuth 2.0 or service account authentication.

**For Full Write Access:**
You would need to implement OAuth 2.0 authentication or use a service account, which requires more complex setup but provides true read/write capabilities.

**Alternative: Google Apps Script Solution (Recommended)**
1. Create a Google Apps Script web app that handles write operations
2. Deploy it with appropriate permissions
3. Update the app to use the script URL for write operations
4. This bypasses the API key limitation while keeping setup simple

## Benefits of This Integration

1. **Persistent Data Storage** - Data survives browser refreshes and app restarts
2. **Easy Data Management** - TCU staff can update inventory directly in Google Sheets
3. **Backup and Export** - Built-in Google Sheets features for data backup
4. **Collaboration** - Multiple staff members can manage inventory data
5. **Offline Support** - App continues working with cached data when offline
6. **No Database Required** - Simple solution without complex backend setup

## Next Steps

Once configured, you can:
- Add more equipment directly in the Google Sheet
- Customize the categories and equipment types
- Export data for reporting
- Set up automated backups
- Add data validation rules in Google Sheets
