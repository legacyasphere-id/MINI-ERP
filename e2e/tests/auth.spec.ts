import { test, expect } from '@playwright/test';

const DEMO_EMAIL    = 'admin@inventoryos.com';
const DEMO_PASSWORD = 'password123';

test.describe('Auth', () => {
  test('unauthenticated user is redirected to /login', async ({ page }) => {
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });

  test('login page renders form and demo hint', async ({ page }) => {
    await page.goto('/login');
    await expect(page.getByLabel('Email')).toBeVisible();
    await expect(page.getByLabel('Password')).toBeVisible();
    await expect(page.getByRole('button', { name: /sign in/i })).toBeVisible();
    await expect(page.getByText('admin@inventoryos.com')).toBeVisible();
  });

  test('wrong credentials show error message', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(DEMO_EMAIL);
    await page.getByLabel('Password').fill('wrongpassword');
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page.getByText(/invalid email or password/i)).toBeVisible();
  });

  test('successful login redirects to dashboard', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(DEMO_EMAIL);
    await page.getByLabel('Password').fill(DEMO_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    await expect(page).toHaveURL(/\/dashboard/);
    await expect(page.getByText('Admin User')).toBeVisible();
  });

  test('logout clears session and redirects to /login', async ({ page }) => {
    await page.goto('/login');
    await page.getByLabel('Email').fill(DEMO_EMAIL);
    await page.getByLabel('Password').fill(DEMO_PASSWORD);
    await page.getByRole('button', { name: /sign in/i }).click();
    await page.waitForURL(/\/dashboard/);

    await page.getByTitle('Sign out').click();
    await expect(page).toHaveURL(/\/login/);

    // Token should be gone — protected route redirects again
    await page.goto('/dashboard');
    await expect(page).toHaveURL(/\/login/);
  });
});
