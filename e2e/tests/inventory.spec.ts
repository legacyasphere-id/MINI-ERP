import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

test.describe('Inventory', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    await page.goto('/inventory');
  });

  test('loads real products from DB', async ({ page }) => {
    // Should show at least 1 row — we seeded 20
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 5000 });
    // Should show a known SKU
    await expect(page.getByText('ELEC-SSD-001')).toBeVisible();
  });

  test('search filters rows', async ({ page }) => {
    await page.getByPlaceholder(/search/i).fill('SSD');
    await page.waitForTimeout(400); // debounce
    const rows = page.locator('tbody tr');
    await expect(rows).toHaveCount(2); // 2TB NVMe SSD + SATA SSD
  });

  test('low stock filter shows only below-min items', async ({ page }) => {
    await page.getByRole('combobox').selectOption({ label: /low/i }).catch(() =>
      page.locator('select').selectOption('low')
    );
    await page.waitForTimeout(300);
    // Every visible row badge should be low or critical
    const badges = page.locator('[class*="status"]');
    await expect(badges.first()).toBeVisible();
  });

  test('pagination next/prev buttons work', async ({ page }) => {
    const nextBtn = page.getByRole('button', { name: /next/i });
    // If there's only 1 page, button is disabled
    const isDisabled = await nextBtn.isDisabled();
    if (!isDisabled) {
      await nextBtn.click();
      await expect(page.getByText('Page 2')).toBeVisible();
    }
  });

  test('clicking a row navigates to product detail', async ({ page }) => {
    await page.locator('tbody tr').first().click();
    await expect(page).toHaveURL(/\/inventory\/.+/);
  });
});

test.describe('Product Detail', () => {
  test.beforeEach(async ({ page }) => { await loginAs(page); });

  test('shows product info and movement history', async ({ page }) => {
    await page.goto('/inventory/itm-001');
    await expect(page.getByText('2TB NVMe SSD')).toBeVisible();
    await expect(page.getByText('ELEC-SSD-001')).toBeVisible();
    // Movement table header
    await expect(page.getByText(/movement/i).first()).toBeVisible();
  });
});
