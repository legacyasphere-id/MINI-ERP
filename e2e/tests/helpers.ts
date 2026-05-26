import { Page } from '@playwright/test';

export async function loginAs(page: Page, email = 'admin@inventoryos.com', password = 'password123') {
  await page.goto('/login');
  await page.getByLabel('Email').fill(email);
  await page.getByLabel('Password').fill(password);
  await page.getByRole('button', { name: /sign in/i }).click();
  await page.waitForURL(/\/dashboard/);
}
