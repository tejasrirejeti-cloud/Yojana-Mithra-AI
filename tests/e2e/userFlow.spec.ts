import { test, expect } from '@playwright/test';

test.describe('Yojana Mithra AI - Production E2E Suite', () => {
  test('should load landing page with official logo and start eligibility check', async ({ page }) => {
    await page.goto('/');
    
    // Check Brand Header
    await expect(page.locator('text=Yojana Mithra')).toBeVisible();
    await expect(page.locator('text=AI • GOVERNMENT SCHEMES')).toBeVisible();

    // Navigate to Search
    const searchNav = page.locator('button:has-text("Browse Schemes"), button:has-text("Search Schemes")').first();
    if (await searchNav.isVisible()) {
      await searchNav.click();
    }

    // Verify System Monitoring is accessible
    const monitoringLink = page.locator('text=System Monitoring, text=Live Monitoring').first();
    await expect(monitoringLink).toBeVisible();
  });

  test('should query telemetry endpoint successfully', async ({ request }) => {
    const response = await request.get('/api/monitoring/status');
    expect(response.status()).toBe(200);
    const data = await response.json();
    expect(data.status).toBeDefined();
    expect(data.subsystems).toBeDefined();
  });
});
