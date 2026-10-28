/**
 * LAYER 7: AUTHENTICATION SETUP LAYER
 * ====================================
 * Setup scripts for authentication state reuse.
 * Runs once before tests to store authenticated sessions.
 */
import { test as setup, expect } from '@playwright/test';
import { testUsers } from './tests/utils/test-data';

const USER_AUTH_FILE = 'playwright/.auth/user.json';
const ADMIN_AUTH_FILE = 'playwright/.auth/admin.json';

/**
 * Standard user authentication setup
 * Stores session state for regular user tests
 */
setup('authenticate standard user', async ({ page }) => {
  await page.goto('/login');

  // Fill login form using semantic selectors
  await page.getByLabel('Email').fill(testUsers.standard.email);
  await page.getByLabel('Password').fill(testUsers.standard.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  // Verify successful login
  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();

  // Save authentication state (cookies, localStorage, etc.)
  await page.context().storageState({ path: USER_AUTH_FILE });
});

/**
 * Admin user authentication setup
 * Stores session state for admin tests
 */
setup('authenticate admin user', async ({ page }) => {
  await page.goto('/login');

  await page.getByLabel('Email').fill(testUsers.admin.email);
  await page.getByLabel('Password').fill(testUsers.admin.password);
  await page.getByRole('button', { name: 'Sign in' }).click();

  await expect(page).toHaveURL(/\/dashboard/);
  await expect(page.getByRole('heading', { name: /welcome/i })).toBeVisible();

  // Verify admin access
  await expect(page.getByText(/admin|administrator/i)).toBeVisible();

  await page.context().storageState({ path: ADMIN_AUTH_FILE });
});

/**
 * Optional: Setup with API authentication
 * For applications using token-based auth
 */
setup('authenticate via API', async ({ request }) => {
  const response = await request.post('/api/auth/login', {
    data: {
      email: testUsers.standard.email,
      password: testUsers.standard.password,
    },
  });

  expect(response.ok()).toBeTruthy();

  const body = await response.json();
  const { token, user } = body;

  // Store token for API tests
  process.env.API_TOKEN = token;

  // Also create browser context with token
  // This would be used in a separate fixture
});