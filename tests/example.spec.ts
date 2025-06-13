import { test, expect } from '@playwright/test';

test.describe('Inventory App', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  test('should load the inventory app homepage', async ({ page }) => {
    await expect(page).toHaveTitle(/Vite \+ React \+ TS/);
    
    // Check if the main app content is visible
    await expect(page.locator('text=CDEx Inventory Management')).toBeVisible();
  });

  test('should display equipment categories', async ({ page }) => {
    // Check if equipment categories are visible
    await expect(page.locator('text=Video Camera - Professional')).toBeVisible();
    await expect(page.locator('text=DSLR Camera')).toBeVisible();
    await expect(page.locator('text=Yeti Microphone')).toBeVisible();
    await expect(page.locator('text=Mac Laptop')).toBeVisible();
  });

  test('should be able to search for equipment', async ({ page }) => {
    // Navigate to the inventory tab first
    await page.click('button:has-text("View Inventory")');
    
    // Find the search input
    const searchInput = page.locator('input[placeholder*="Search equipment"]');
    await expect(searchInput).toBeVisible();
    
    // Search for Canon equipment
    await searchInput.fill('Canon');
    
    // Verify search results show Canon equipment
    await expect(page.locator('text=Canon EOS R5').first()).toBeVisible();
    await expect(page.locator('text=Canon 5D Mark IV').first()).toBeVisible();
  });

  test('should display equipment availability status', async ({ page }) => {
    // Navigate to the inventory tab to see availability status
    await page.click('button:has-text("View Inventory")');
    
    // Check for availability indicators using the actual classes and text from the app
    await expect(page.locator('text=Available').first()).toBeVisible();
    await expect(page.locator('text=Checked Out').first()).toBeVisible();
  });

  test('should be able to view checkouts', async ({ page }) => {
    // Navigate to the check-in tab to see active checkouts
    await page.click('button:has-text("Check In Equipment")');
    
    // Look for active checkout information
    await expect(page.locator('text=Active Checkouts')).toBeVisible();
    
    // Check if there are any checkout entries or at least the check-in button
    const checkInButton = page.locator('button:has-text("Check In")');
    const noCheckoutsMessage = page.locator('text=No active checkouts');
    
    // Either there should be checkouts with check-in buttons, or a "no checkouts" message
    await expect(checkInButton.first().or(noCheckoutsMessage)).toBeVisible();
  });
});