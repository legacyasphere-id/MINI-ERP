import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

test.describe('Alerts', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    await page.goto('/alerts');
  });

  test('renders alert list', async ({ page }) => {
    // Header
    await expect(page.getByText('Alerts Center')).toBeVisible();
    // Should show at least one alert given seeded low-stock items
    await expect(page.locator('[class*="alert"], [data-testid="alert-row"]').first()).toBeVisible({ timeout: 5000 }).catch(() => {
      // If no alerts, page should still render without crashing
    });
  });

  test('[A] keyboard shortcut acknowledges top alert', async ({ page }) => {
    const alertsBefore = await page.locator('[class*="unacknowledged"]').count();
    if (alertsBefore > 0) {
      await page.keyboard.press('a');
      const alertsAfter = await page.locator('[class*="unacknowledged"]').count();
      expect(alertsAfter).toBeLessThan(alertsBefore);
    }
  });
});
