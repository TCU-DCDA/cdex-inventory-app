# CDEx Inventory Management - Google Sheets Template

Copy and paste this data into your Google Sheets document to get started quickly.

## Equipment Sheet Structure

**Sheet Name:** Equipment

**Headers (Row 1):**
```
ID	Name	Category	Serial Number	Available
```

**Sample Data (Rows 2+):**
```
1	Canon EOS R5	Video Camera - Professional	CR5001	TRUE
2	Canon EOS R5	Video Camera - Professional	CR5002	FALSE
3	Sony FX3	Video Camera - Professional	SF3001	TRUE
4	Canon EOS R6	Video Camera - Standard	CR6001	TRUE
5	Canon EOS R6	Video Camera - Standard	CR6002	TRUE
6	Sony A7 III	Video Camera - Standard	SA7001	FALSE
7	Canon 5D Mark IV	DSLR Camera	5D001	TRUE
8	Canon 5D Mark IV	DSLR Camera	5D002	TRUE
9	Nikon D850	DSLR Camera	ND001	FALSE
10	Blue Yeti	Yeti Microphone	BY001	TRUE
11	Blue Yeti	Yeti Microphone	BY002	TRUE
12	Blue Yeti	Yeti Microphone	BY003	FALSE
13	Blue Yeti	Yeti Microphone	BY004	TRUE
14	Dell XPS 15	PC Laptop	DX001	TRUE
15	Dell XPS 15	PC Laptop	DX002	FALSE
16	HP Spectre x360	PC Laptop	HS001	TRUE
17	HP Spectre x360	PC Laptop	HS002	TRUE
18	Lenovo ThinkPad X1	PC Laptop	LT001	TRUE
19	MacBook Pro 16"	Mac Laptop	MBP001	TRUE
20	MacBook Pro 16"	Mac Laptop	MBP002	FALSE
21	MacBook Pro 16"	Mac Laptop	MBP003	TRUE
22	MacBook Pro 16"	Mac Laptop	MBP004	TRUE
23	MacBook Pro 16"	Mac Laptop	MBP005	TRUE
24	MacBook Pro 16"	Mac Laptop	MBP006	FALSE
25	MacBook Pro 16"	Mac Laptop	MBP007	TRUE
26	MacBook Pro 16"	Mac Laptop	MBP008	TRUE
27	MacBook Pro 16"	Mac Laptop	MBP009	TRUE
28	MacBook Pro 16"	Mac Laptop	MBP010	FALSE
29	MacBook Pro 16"	Mac Laptop	MBP011	TRUE
30	MacBook Pro 16"	Mac Laptop	MBP012	TRUE
31	MacBook Pro 16"	Mac Laptop	MBP013	TRUE
32	MacBook Pro 16"	Mac Laptop	MBP014	TRUE
33	MacBook Pro 16"	Mac Laptop	MBP015	TRUE
```

## Checkouts Sheet Structure

**Sheet Name:** Checkouts

**Headers (Row 1):**
```
ID	Student Name	Student ID	Student Email	Student Major	Faculty Sponsor	Checkout Date	Return Date	Equipment ID	Equipment Name	Serial Number	Returned	Comments
```

**Sample Data (Rows 2+):**
```
1	Sarah Johnson	SJ12345	sarah.johnson@tcu.edu	Film Production	Dr. Smith	2024-06-10	2024-06-17	2	Canon EOS R5	CR5002	FALSE	Needed for senior capstone project
2	Mike Chen	MC67890	mike.chen@tcu.edu	Journalism	Prof. Johnson	2024-06-08	2024-06-15	6	Sony A7 III	SA7001	FALSE	Documentary filming project
```

## Quick Setup Instructions

1. **Create a new Google Sheets document**
2. **Rename the first sheet to "Equipment"**
3. **Copy and paste the Equipment data above** (including headers)
4. **Create a second sheet called "Checkouts"**
5. **Copy and paste the Checkouts data above** (including headers)
6. **Make the sheet publicly viewable:**
   - Click "Share" → "Change to anyone with the link" → "Viewer"
7. **Copy the Sheet ID from the URL**
8. **Update your app configuration** with the Sheet ID

## Data Format Notes

- **Available column:** Use `TRUE` for available equipment, `FALSE` for checked out
- **Returned column:** Use `TRUE` for returned equipment, `FALSE` for active checkouts
- **Dates:** Use YYYY-MM-DD format (e.g., 2024-06-13)
- **Equipment ID:** Must match the ID in the Equipment sheet
- **Categories:** Must match exactly:
  - Video Camera - Professional
  - Video Camera - Standard
  - DSLR Camera
  - Yeti Microphone
  - PC Laptop
  - Mac Laptop

## Validation Rules (Optional)

You can add data validation in Google Sheets to ensure data consistency:

1. **Available column (Equipment sheet):** Dropdown with `TRUE, FALSE`
2. **Returned column (Checkouts sheet):** Dropdown with `TRUE, FALSE`
3. **Category column:** Dropdown with the six categories listed above
4. **Equipment ID (Checkouts sheet):** Reference to Equipment sheet IDs
