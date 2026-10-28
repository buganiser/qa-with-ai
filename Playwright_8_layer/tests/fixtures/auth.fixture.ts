/**
 * LAYER 2: FIXTURES LAYER
 * =======================
 * Custom fixtures for shared test setup, page objects, and authenticated state.
 * Extends Playwright's base test to provide reusable test contexts.
 */
import { test as base, Page, BrowserContext } from '@playwright/test';
import { LoginPage } from '../pages/login.page';
import { DashboardPage } from '../pages/dashboard.page';
import { CartPage } from '../pages/cart.page';
import { CheckoutPage } from '../pages/checkout.page';
import { BasePage } from '../pages/base.page';

/**
 * Type definition for all custom fixtures
 * Provides type-safe access to page objects and authenticated contexts
 */
type TestFixtures = {
  // Page Object fixtures - auto-initialized per test
  loginPage: LoginPage;
  dashboardPage: DashboardPage;
  cartPage: CartPage;
  checkoutPage: CheckoutPage;
  basePage: BasePage;

  // Authenticated contexts
  authenticatedPage: Page;
  adminPage: Page;
  guestPage: Page;

  // Test data fixtures
  testUsers: TestUserData;
  testProducts: TestProductData;
};

/**
 * Test user data structure
 */
interface TestUserData {
  standard: { email: string; password: string; role: string };
  admin: { email: string; password: string; role: string };
  locked: { email: string; password: string; role: string };
}

/**
 * Test product data structure
 */
interface TestProductData {
  standard: { id: string; name: string; price: number };
  premium: { id: string; name: string; price: number };
}

/**
 * Extended test with all custom fixtures
 * Usage: import { test, expect } from '../fixtures/auth.fixture';
 */
export const test = base.extend<TestFixtures>({
  // Base page fixture - provides common utilities
  basePage: async ({ page }, use) => {
    await use(new BasePage(page));
  },

  // Login page fixture - navigates to login page
  loginPage: async ({ page }, use) => {
    const loginPage = new LoginPage(page);
    await loginPage.goto();
    await use(loginPage);
  },

  // Dashboard page fixture
  dashboardPage: async ({ page }, use) => {
    await use(new DashboardPage(page));
  },

  // Cart page fixture
  cartPage: async ({ page }, use) => {
    await use(new CartPage(page));
  },

  // Checkout page fixture
  checkoutPage: async ({ page }, use) => {
    await use(new CheckoutPage(page));
  },

  // Authenticated user context - uses stored auth state
  authenticatedPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/user.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // Admin context - separate storage state
  adminPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      storageState: 'playwright/.auth/admin.json',
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // Guest context - no authentication
  guestPage: async ({ browser }, use) => {
    const context = await browser.newContext({
      // No storage state - clean slate
    });
    const page = await context.newPage();
    await use(page);
    await context.close();
  },

  // Test user data - centralized test data
  testUsers: async ({}, use) => {
    const users: TestUserData = {
      standard: {
        email: process.env.TEST_USER_EMAIL || 'user@example.com',
        password: process.env.TEST_USER_PASSWORD || 'SecurePass123!',
        role: 'user',
      },
      admin: {
        email: process.env.TEST_ADMIN_EMAIL || 'admin@example.com',
        password: process.env.TEST_ADMIN_PASSWORD || 'AdminPass123!',
        role: 'admin',
      },
      locked: {
        email: 'locked@example.com',
        password: 'LockedPass123!',
        role: 'locked',
      },
    };
    await use(users);
  },

  // Test product data
  testProducts: async ({}, use) => {
    const products: TestProductData = {
      standard: {
        id: 'prod_001',
        name: 'Standard Widget',
        price: 29.99,
      },
      premium: {
        id: 'prod_002',
        name: 'Premium Widget',
        price: 99.99,
      },
    };
    await use(products);
  },
});

// Re-export expect for assertions
export { expect } from '@playwright/test';