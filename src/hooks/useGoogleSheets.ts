import { useState, useEffect } from 'react';
import { googleSheetsService } from '../utils/googleSheets';
import type { EquipmentItem, CheckoutRecord } from '../utils/googleSheets';

export const useGoogleSheets = () => {
  const [equipment, setEquipment] = useState<EquipmentItem[]>([]);
  const [checkouts, setCheckouts] = useState<CheckoutRecord[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isOnline, setIsOnline] = useState(navigator.onLine);

  // Monitor online status
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Load initial data from Google Sheets
  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    try {
      setIsLoading(true);
      setError(null);

      if (!isOnline) {
        throw new Error('No internet connection. Using offline data.');
      }

      const [equipmentData, checkoutData] = await Promise.all([
        googleSheetsService.fetchEquipment(),
        googleSheetsService.fetchCheckouts()
      ]);

      setEquipment(equipmentData);
      setCheckouts(checkoutData);
    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
      setError(errorMessage);
      console.warn('Loading fallback data due to error:', errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  // Add new checkout
  const addCheckout = async (checkoutData: Omit<CheckoutRecord, 'id'>) => {
    try {
      // Generate new ID
      const newId = Math.max(...checkouts.map(c => c.id), 0) + 1;
      const newCheckout: CheckoutRecord = {
        ...checkoutData,
        id: newId
      };

      // Update local state immediately (optimistic update)
      setCheckouts(prev => [...prev, newCheckout]);
      
      // Update equipment availability
      setEquipment(prev => 
        prev.map(item => 
          item.id === checkoutData.equipmentId 
            ? { ...item, available: false }
            : item
        )
      );

      // Sync with Google Sheets if online and configured
      if (isOnline && googleSheetsService.isConfigured()) {
        const success = await googleSheetsService.addCheckout(checkoutData);
        if (!success) {
          console.warn('Failed to sync checkout with Google Sheets');
        }
      }

      return true;
    } catch (err) {
      console.error('Error adding checkout:', err);
      return false;
    }
  };

  // Mark checkout as returned
  const markAsReturned = async (checkoutId: number) => {
    try {
      const checkout = checkouts.find(c => c.id === checkoutId);
      if (!checkout) return false;

      // Update local state immediately (optimistic update)
      setCheckouts(prev => 
        prev.map(c => 
          c.id === checkoutId 
            ? { ...c, returned: true }
            : c
        )
      );

      // Update equipment availability
      setEquipment(prev => 
        prev.map(item => 
          item.id === checkout.equipmentId 
            ? { ...item, available: true }
            : item
        )
      );

      // Sync with Google Sheets if online and configured
      if (isOnline && googleSheetsService.isConfigured()) {
        const success = await googleSheetsService.markAsReturned(checkoutId);
        if (!success) {
          console.warn('Failed to sync return status with Google Sheets');
        }
      }

      return true;
    } catch (err) {
      console.error('Error marking checkout as returned:', err);
      return false;
    }
  };

  // Refresh data from Google Sheets
  const refreshData = async () => {
    await loadData();
  };

  return {
    equipment,
    checkouts,
    isLoading,
    error,
    isOnline,
    isConfigured: googleSheetsService.isConfigured(),
    addCheckout,
    markAsReturned,
    refreshData
  };
};
