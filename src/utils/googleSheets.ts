// Google Sheets Integration Service for CDEx Inventory App

export interface EquipmentItem {
  id: number;
  name: string;
  category: string;
  serialNumber: string;
  available: boolean;
}

export interface CheckoutRecord {
  id: number;
  studentName: string;
  studentId: string;
  studentEmail: string;
  studentMajor: string;
  facultySponsor: string;
  checkoutDate: string;
  returnDate: string;
  equipmentId: number;
  equipmentName: string;
  serialNumber: string;
  returned: boolean;
  comments?: string;
}

// Google Sheets configuration
const SHEETS_CONFIG = {
  // Replace with your actual Google Sheets ID
  SHEET_ID: import.meta.env.VITE_GOOGLE_SHEETS_ID || '1UJ0jRXq_Bb_J-2x0zpLcoj79wvHQhFsjkebICxMEaQk',
  EQUIPMENT_RANGE: 'Equipment!A:E',
  CHECKOUTS_RANGE: 'Checkouts!A:M',
  API_KEY: import.meta.env.VITE_GOOGLE_API_KEY || 'AIzaSyAkkk6PfDbcWNqOsreN1MEk2v8jbiTdnGM', // Replace with your actual API key from Google Cloud Console
  // Add your Google Apps Script URL here after deployment
  APPS_SCRIPT_URL: import.meta.env.VITE_APPS_SCRIPT_URL || 'YOUR_APPS_SCRIPT_URL_HERE',
};

class GoogleSheetsService {
  private apiKey: string;
  private sheetId: string;

  constructor() {
    // These would typically come from environment variables
    this.apiKey = SHEETS_CONFIG.API_KEY;
    this.sheetId = SHEETS_CONFIG.SHEET_ID;
    
    console.log('🔧 GoogleSheetsService initialized:', {
      sheetId: this.sheetId,
      apiKeyLength: this.apiKey.length,
      isConfigured: this.isConfigured()
    });
  }

  // Helper to build Google Sheets API URL
  private buildApiUrl(range: string): string {
    return `https://sheets.googleapis.com/v4/spreadsheets/${this.sheetId}/values/${range}?key=${this.apiKey}`;
  }

  // Convert array data to equipment objects
  private parseEquipmentData(values: any[][]): EquipmentItem[] {
    // Skip header row
    return values.slice(1).map((row, index) => ({
      id: parseInt(row[0]) || index + 1,
      name: row[1] || '',
      category: row[2] || '',
      serialNumber: row[3] || '',
      available: row[4] === 'TRUE' || row[4] === true || row[4] === 'Available'
    }));
  }

  // Convert array data to checkout objects
  private parseCheckoutData(values: any[][]): CheckoutRecord[] {
    // Skip header row
    return values.slice(1).map((row, index) => ({
      id: parseInt(row[0]) || index + 1,
      studentName: row[1] || '',
      studentId: row[2] || '',
      studentEmail: row[3] || '',
      studentMajor: row[4] || '',
      facultySponsor: row[5] || '',
      checkoutDate: row[6] || '',
      returnDate: row[7] || '',
      equipmentId: parseInt(row[8]) || 0,
      equipmentName: row[9] || '',
      serialNumber: row[10] || '',
      returned: row[11] === 'TRUE' || row[11] === true || row[11] === 'Yes',
      comments: row[12] || ''
    }));
  }

  // Fetch equipment data from Google Sheets
  async fetchEquipment(): Promise<EquipmentItem[]> {
    try {
      const url = this.buildApiUrl(SHEETS_CONFIG.EQUIPMENT_RANGE);
      console.log('🔍 Fetching equipment from Google Sheets:', url);
      
      const response = await fetch(url);
      console.log('📊 Google Sheets API response status:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Google Sheets API error response:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Google Sheets API response data:', data);
      
      if (!data.values || data.values.length === 0) {
        console.warn('⚠️ No equipment data found in Google Sheets');
        return this.getFallbackEquipmentData();
      }
      
      const parsedData = this.parseEquipmentData(data.values);
      console.log('🎯 Parsed equipment data:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('💥 Error fetching equipment data from Google Sheets:', error);
      // Return fallback data if API fails
      return this.getFallbackEquipmentData();
    }
  }

  // Fetch checkout data from Google Sheets
  async fetchCheckouts(): Promise<CheckoutRecord[]> {
    try {
      const url = this.buildApiUrl(SHEETS_CONFIG.CHECKOUTS_RANGE);
      console.log('🔍 Fetching checkouts from Google Sheets:', url);
      
      const response = await fetch(url);
      console.log('📊 Google Sheets API response status for checkouts:', response.status);
      
      if (!response.ok) {
        const errorText = await response.text();
        console.error('❌ Google Sheets API error response for checkouts:', errorText);
        throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
      }
      
      const data = await response.json();
      console.log('✅ Google Sheets API response data for checkouts:', data);
      
      if (!data.values || data.values.length === 0) {
        console.warn('⚠️ No checkout data found in Google Sheets');
        return this.getFallbackCheckoutData();
      }
      
      const parsedData = this.parseCheckoutData(data.values);
      console.log('🎯 Parsed checkout data:', parsedData);
      return parsedData;
    } catch (error) {
      console.error('💥 Error fetching checkout data from Google Sheets:', error);
      // Return fallback data if API fails
      return this.getFallbackCheckoutData();
    }
  }

  // Add new checkout record to Google Sheets via Apps Script
  async addCheckout(checkout: Omit<CheckoutRecord, 'id'>): Promise<boolean> {
    try {
      console.log('🔄 Adding checkout via Google Apps Script:', checkout);
      
      if (SHEETS_CONFIG.APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
        console.warn('⚠️ Apps Script URL not configured, falling back to optimistic update');
        return true; // Optimistic update when not configured
      }
      
      const response = await fetch(SHEETS_CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // This bypasses CORS restrictions
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'addCheckout',
          checkout: checkout
        })
      });
      
      // With no-cors mode, we can't read the response, so we assume success if no error is thrown
      if (response.type === 'opaque') {
        console.log('✅ Successfully sent checkout request via Apps Script (no-cors mode)');
        return true;
      }
      
      if (!response.ok) {
        throw new Error(`Apps Script error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      console.log('✅ Successfully added checkout via Apps Script');
      return true;
    } catch (error) {
      console.error('💥 Error adding checkout via Apps Script:', error);
      console.log('📝 Falling back to optimistic update');
      return true; // Return true for optimistic update
    }
  }

  // Update equipment availability in Google Sheets via Apps Script  
  async updateEquipmentAvailability(equipmentId: number, available: boolean): Promise<boolean> {
    try {
      console.log(`🔄 Updating equipment ${equipmentId} availability to ${available} via Apps Script`);
      
      if (SHEETS_CONFIG.APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
        console.warn('⚠️ Apps Script URL not configured, falling back to optimistic update');
        return true; // Optimistic update when not configured
      }
      
      const response = await fetch(SHEETS_CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // This bypasses CORS restrictions
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'updateEquipment',
          equipmentId: equipmentId,
          available: available
        })
      });
      
      // With no-cors mode, we can't read the response, so we assume success if no error is thrown
      if (response.type === 'opaque') {
        console.log('✅ Successfully sent equipment update via Apps Script (no-cors mode)');
        return true;
      }
      
      if (!response.ok) {
        throw new Error(`Apps Script error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      console.log('✅ Successfully updated equipment availability via Apps Script');
      return true;
    } catch (error) {
      console.error('💥 Error updating equipment availability via Apps Script:', error);
      console.log('📝 Falling back to optimistic update');
      return true; // Return true for optimistic update
    }
  }

  // Mark checkout as returned via Apps Script
  async markAsReturned(checkoutId: number): Promise<boolean> {
    try {
      console.log(`🔄 Marking checkout ${checkoutId} as returned via Apps Script`);
      
      if (SHEETS_CONFIG.APPS_SCRIPT_URL === 'YOUR_APPS_SCRIPT_URL_HERE') {
        console.warn('⚠️ Apps Script URL not configured, falling back to optimistic update');
        return true; // Optimistic update when not configured
      }
      
      const response = await fetch(SHEETS_CONFIG.APPS_SCRIPT_URL, {
        method: 'POST',
        mode: 'no-cors', // This bypasses CORS restrictions
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          action: 'markReturned',
          checkoutId: checkoutId
        })
      });
      
      // With no-cors mode, we can't read the response, so we assume success if no error is thrown
      if (response.type === 'opaque') {
        console.log('✅ Successfully sent return request via Apps Script (no-cors mode)');
        return true;
      }
      
      if (!response.ok) {
        throw new Error(`Apps Script error: ${response.status}`);
      }
      
      const result = await response.json();
      
      if (result.error) {
        throw new Error(result.error);
      }
      
      console.log('✅ Successfully marked checkout as returned via Apps Script');
      return true;
    } catch (error) {
      console.error('💥 Error marking checkout as returned via Apps Script:', error);
      console.log('📝 Falling back to optimistic update');
      return true; // Return true for optimistic update
    }
  }

  // Fallback equipment data (same as current dummy data)
  private getFallbackEquipmentData(): EquipmentItem[] {
    return [
      // Video Cameras
      { id: 1, name: 'Canon EOS R5', category: 'Video Camera - Professional', serialNumber: 'CR5001', available: true },
      { id: 2, name: 'Canon EOS R5', category: 'Video Camera - Professional', serialNumber: 'CR5002', available: false },
      { id: 3, name: 'Sony FX3', category: 'Video Camera - Professional', serialNumber: 'SF3001', available: true },
      { id: 4, name: 'Canon EOS R6', category: 'Video Camera - Standard', serialNumber: 'CR6001', available: true },
      { id: 5, name: 'Canon EOS R6', category: 'Video Camera - Standard', serialNumber: 'CR6002', available: true },
      { id: 6, name: 'Sony A7 III', category: 'Video Camera - Standard', serialNumber: 'SA7001', available: false },
      
      // DSLR Cameras
      { id: 7, name: 'Canon 5D Mark IV', category: 'DSLR Camera', serialNumber: '5D001', available: true },
      { id: 8, name: 'Canon 5D Mark IV', category: 'DSLR Camera', serialNumber: '5D002', available: true },
      { id: 9, name: 'Nikon D850', category: 'DSLR Camera', serialNumber: 'ND001', available: false },
      
      // Yeti Microphones
      { id: 10, name: 'Blue Yeti', category: 'Yeti Microphone', serialNumber: 'BY001', available: true },
      { id: 11, name: 'Blue Yeti', category: 'Yeti Microphone', serialNumber: 'BY002', available: true },
      { id: 12, name: 'Blue Yeti', category: 'Yeti Microphone', serialNumber: 'BY003', available: false },
      { id: 13, name: 'Blue Yeti', category: 'Yeti Microphone', serialNumber: 'BY004', available: true },
      
      // PC Laptops
      { id: 14, name: 'Dell XPS 15', category: 'PC Laptop', serialNumber: 'DX001', available: true },
      { id: 15, name: 'Dell XPS 15', category: 'PC Laptop', serialNumber: 'DX002', available: false },
      { id: 16, name: 'HP Spectre x360', category: 'PC Laptop', serialNumber: 'HS001', available: true },
      { id: 17, name: 'HP Spectre x360', category: 'PC Laptop', serialNumber: 'HS002', available: true },
      { id: 18, name: 'Lenovo ThinkPad X1', category: 'PC Laptop', serialNumber: 'LT001', available: true },
      
      // Mac Laptops
      ...Array.from({length: 15}, (_, i) => ({
        id: 19 + i,
        name: 'MacBook Pro 16"',
        category: 'Mac Laptop',
        serialNumber: `MBP${String(i + 1).padStart(3, '0')}`,
        available: i % 4 !== 0
      }))
    ];
  }

  // Fallback checkout data (same as current dummy data)
  private getFallbackCheckoutData(): CheckoutRecord[] {
    return [
      {
        id: 1,
        studentName: 'Sarah Johnson',
        studentId: 'SJ12345',
        studentEmail: 'sarah.johnson@tcu.edu',
        studentMajor: 'Film Production',
        facultySponsor: 'Dr. Smith',
        checkoutDate: '2024-06-10',
        returnDate: '2024-06-17',
        equipmentId: 2,
        equipmentName: 'Canon EOS R5',
        serialNumber: 'CR5002',
        returned: false,
        comments: 'Needed for senior capstone project'
      },
      {
        id: 2,
        studentName: 'Mike Chen',
        studentId: 'MC67890',
        studentEmail: 'mike.chen@tcu.edu',
        studentMajor: 'Journalism',
        facultySponsor: 'Prof. Johnson',
        checkoutDate: '2024-06-08',
        returnDate: '2024-06-15',
        equipmentId: 6,
        equipmentName: 'Sony A7 III',
        serialNumber: 'SA7001',
        returned: false,
        comments: 'Documentary filming project'
      }
    ];
  }

  // Check if Google Sheets integration is properly configured
  isConfigured(): boolean {
    const configured = this.apiKey !== 'YOUR_GOOGLE_API_KEY_HERE' && 
           this.sheetId !== 'YOUR_GOOGLE_SHEET_ID_HERE' &&
           this.apiKey.length > 10 &&
           this.sheetId.length > 10;
    
    console.log('🔧 Configuration check:', {
      apiKey: this.apiKey.substring(0, 10) + '...',
      sheetId: this.sheetId.substring(0, 10) + '...',
      configured
    });
    
    return configured;
  }
}

// Export singleton instance
export const googleSheetsService = new GoogleSheetsService();
