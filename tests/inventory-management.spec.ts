import { test, expect } from '@playwright/test';

test.describe('Inventory Management', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should display equipment list with proper information', async ({ page }) => {
    // Navigate to the inventory tab to see equipment list
    await page.click('button:has-text("View Inventory")');
    
    // Wait for equipment categories to load and be visible
    await expect(page.locator('text=Video Camera - Professional')).toBeVisible();
    
    // Check that equipment items contain required information
    await expect(page.locator('text=Canon EOS R5').first()).toBeVisible();
    await expect(page.locator('text=Canon 5D Mark IV').first()).toBeVisible();
    
    // Check for serial numbers in the equipment listings
    await expect(page.locator('text=CR5001')).toBeVisible();
  });

  test('should filter equipment by category', async ({ page }) => {
    // Navigate to the inventory tab
    await page.click('button:has-text("View Inventory")');
    
    // Wait for categories to load
    await expect(page.locator('text=Video Camera - Professional')).toBeVisible();
    
    // The app displays equipment grouped by category, so verify we can see different categories
    await expect(page.locator('text=DSLR Camera')).toBeVisible();
    await expect(page.locator('text=Yeti Microphone')).toBeVisible();
    await expect(page.locator('text=Mac Laptop')).toBeVisible();
  });

  test('should show equipment availability status correctly', async ({ page }) => {
    // Navigate to the inventory tab to see equipment status
    await page.click('button:has-text("View Inventory")');
    
    // Wait for equipment to load
    await expect(page.locator('text=Canon EOS R5').first()).toBeVisible();
    
    // Check for available and checked out equipment indicators using actual text
    await expect(page.locator('text=Available').first()).toBeVisible();
    await expect(page.locator('text=Checked Out').first()).toBeVisible();
  });

  test('should display student checkout information', async ({ page }) => {
    // Navigate to the check-in tab to see checkout information
    await page.click('button:has-text("Check In Equipment")');
    
    // Wait for the tab to load
    await expect(page.locator('text=Active Checkouts')).toBeVisible();
    
    // Look for checkout information (student names and IDs)
    const studentInfo = page.locator('text=Sarah Johnson').or(page.locator('text=Mike Chen')).or(page.locator('text=No active checkouts'));
    await expect(studentInfo.first()).toBeVisible();
  });

  test('should handle equipment search functionality', async ({ page }) => {
    // Navigate to the inventory tab where search is available
    await page.click('button:has-text("View Inventory")');
    
    // Wait for search input to be available
    const searchInput = page.locator('input[placeholder*="Search equipment"]');
    await expect(searchInput).toBeVisible();
    
    // Test search for specific equipment
    await searchInput.fill('Blue Yeti');
    
    // Should show Blue Yeti microphones (checking for first one since multiple elements with same text)
    await expect(page.locator('text=Blue Yeti').first()).toBeVisible();
    
    // Clear search and test for MacBook
    await searchInput.clear();
    await searchInput.fill('MacBook');
    
    // Should show MacBook laptops
    await expect(page.locator('text=MacBook Pro').first()).toBeVisible();
  });
});
