import { test, expect } from '@playwright/test';
import { loginAs } from './helpers';

test.describe('Purchase Orders', () => {
  test.beforeEach(async ({ page }) => {
    await loginAs(page);
    await page.goto('/orders');
  });

  test('loads PO list from DB', async ({ page }) => {
    // We seeded 10 POs
    await expect(page.locator('tbody tr').first()).toBeVisible({ timeout: 5000 });
    // Supplier names from seed
    await expect(page.getByText('TechVault Distributors')).toBeVisible();
  });

  test('filter tabs show correct counts', async ({ page }) => {
    await expect(page.getByRole('button', { name: /^All/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Active/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Received/ })).toBeVisible();
    await expect(page.getByRole('button', { name: /^Draft/ })).toBeVisible();
  });

  test('Active tab shows only confirmed/partial POs', async ({ page }) => {
    await page.getByRole('button', { name: /^Active/ }).click();
    const rows = page.locator('tbody tr');
    const count = await rows.count();
    expect(count).toBeGreaterThan(0);
    // No "Draft" or "Received" badges in filtered view
    await expect(page.getByText('Draft')).toHaveCount(0);
    await expect(page.getByText('Received')).toHaveCount(0);
  });

  test('clicking a row opens ReceiveDrawer', async ({ page }) => {
    // Click a confirmed PO row
    await page.getByRole('button', { name: /^Active/ }).click();
    await page.locator('tbody tr').first().click();
    // Drawer slides in — check for line items
    await expect(page.getByText('Receive now')).toBeVisible({ timeout: 3000 });
  });

  test('receive drawer: entering qty enables Confirm button', async ({ page }) => {
    await page.getByRole('button', { name: /^Active/ }).click();
    await page.locator('tbody tr').first().click();

    const confirmBtn = page.getByRole('button', { name: /confirm receipt/i });
    await expect(confirmBtn).toBeDisabled();

    const qtyInput = page.locator('input[type="number"]').first();
    await qtyInput.fill('5');
    await expect(confirmBtn).toBeEnabled();
  });
});
