import React, { useState } from 'react';
import { googleSheetsService } from '../utils/googleSheets';

const GoogleSheetsDebug: React.FC = () => {
  const [status, setStatus] = useState<string>('Ready to test');
  const [data, setData] = useState<any>(null);

  const testConnection = async () => {
    setStatus('Testing connection...');
    setData(null);

    try {
      console.log('🧪 Starting Google Sheets test...');
      
      // Test configuration
      const isConfigured = googleSheetsService.isConfigured();
      console.log('📋 Is configured:', isConfigured);
      
      if (!isConfigured) {
        setStatus('❌ Not configured - check API key and Sheet ID');
        return;
      }

      // Test equipment fetch
      setStatus('Fetching equipment data...');
      const equipment = await googleSheetsService.fetchEquipment();
      console.log('📊 Equipment data:', equipment);

      // Test checkouts fetch
      setStatus('Fetching checkout data...');
      const checkouts = await googleSheetsService.fetchCheckouts();
      console.log('📋 Checkout data:', checkouts);

      setData({
        equipment: equipment.slice(0, 3), // Show first 3 items
        checkouts: checkouts.slice(0, 3),
        equipmentCount: equipment.length,
        checkoutCount: checkouts.length
      });

      setStatus('✅ Test completed successfully!');
    } catch (error) {
      console.error('💥 Test failed:', error);
      setStatus(`❌ Test failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="fixed bottom-4 right-4 bg-white p-4 rounded-lg shadow-lg border border-gray-200 max-w-md z-50">
      <h3 className="font-bold text-sm mb-2">🔧 Google Sheets Debug</h3>
      
      <button
        onClick={testConnection}
        className="bg-blue-500 text-white px-3 py-1 rounded text-sm mb-2 hover:bg-blue-600"
      >
        Test Connection
      </button>
      
      <div className="text-xs text-gray-600 mb-2">
        Status: {status}
      </div>
      
      {data && (
        <div className="text-xs">
          <div>Equipment: {data.equipmentCount} items</div>
          <div>Checkouts: {data.checkoutCount} items</div>
          {data.equipment.length > 0 && (
            <div className="mt-1">
              <strong>Sample equipment:</strong>
              <div className="max-h-20 overflow-y-auto">
                {data.equipment.map((item: any, i: number) => (
                  <div key={i}>{item.name} ({item.category})</div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}
      
      <div className="text-xs text-gray-500 mt-2">
        Check browser console for detailed logs
      </div>
    </div>
  );
};

export default GoogleSheetsDebug;
