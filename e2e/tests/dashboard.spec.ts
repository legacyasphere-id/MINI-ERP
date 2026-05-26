import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ page }) => { await loginAs(page); });

  test('shows KPI cards', async ({ page }) => {
    await expect(page.getByText('Stock Value')).toBeVisible();
    await expect(page.getByText('Low / Critical Stock')).toBeVisible();
    await expect(page.getByText('Stockout Risk')).toBeVisible();
    await expect(page.getByText('Critical Alerts')).toBeVisible();
  });

  test('stock value KPI loads a non-zero dollar amount', async ({ page }) => {
    const card = page.locator('[class*="KPICard"]').filter({ hasText: 'Stock Value' });
    // Wait for loading to finish (value changes from '…')
    await expect(card.locator('[class*="tabular-nums"]').first()).not.toHaveText('…', { timeout: 5000 });
    await expect(card.getByText(/\$[\d,]+/)).toBeVisible();
  });

  test('daily inbound value chart renders', async ({ page }) => {
    await expect(page.getByText('Daily Inbound Value')).toBeVisible();
    // Recharts SVG should render
    await expect(page.locator('svg.recharts-surface')).toBeVisible({ timeout: 5000 });
  });

  test('alerts panel visible', async ({ page }) => {
    await expect(page.getByText('Active Alerts')).toBeVisible();
  });
});
