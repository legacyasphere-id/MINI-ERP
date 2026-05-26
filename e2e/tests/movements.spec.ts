import { test, expect, request } from '@playwright/test';
import { loginAs } from './helpers';

test.describe('Movement Form', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    await page.goto('/movement');
  });

  test('renders form fields', async ({ page }) => {
    await expect(page.getByLabel(/sku/i)).toBeVisible();
    await expect(page.getByLabel(/type/i)).toBeVisible();
    await expect(page.getByLabel(/quantity/i)).toBeVisible();
  });

  test('create a receive movement and verify qty increases', async ({ page, request }) => {
    // Get current qty for itm-001 from API
    const token = await page.evaluate(() => localStorage.getItem('token'));
    const before = await request.get('http://localhost:3001/api/products/itm-001', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { currentQty: qtBefore } = await before.json();

    // Fill form
    await page.getByLabel(/sku/i).fill('ELEC-SSD-001');
    await page.getByLabel(/sku/i).press('Enter');
    await page.getByLabel(/type/i).selectOption('receive');
    await page.getByLabel(/quantity/i).fill('3');
    await page.getByRole('button', { name: /record/i }).click();

    // Row appears in log
    await expect(page.getByText('ELEC-SSD-001').first()).toBeVisible();

    // Verify qty in DB
    const after = await request.get('http://localhost:3001/api/products/itm-001', {
      headers: { Authorization: `Bearer ${token}` },
    });
    const { currentQty: qtAfter } = await after.json();
    expect(qtAfter).toBe(qtBefore + 3);
  });
});
