/**
 * LAYER 6: TEST SPECS LAYER - Auth Tests
 * ======================================
 * Login and authentication test specifications.
 * Uses fixtures from Layer 2 and page objects from Layer 4.
 */
import { test, expect } from '../../fixtures/auth.fixture';
import { testUsers } from '../../utils/test-data';

test.describe('Login Functionality', () => {
  test.describe('Valid Credentials', () => {
    test('should login successfully with standard user @smoke', async ({ loginPage, page }) => {
      await loginPage.loginSuccessfully(
        testUsers.standard.email,
        testUsers.standard.password
      );
      await expect(page).toHaveURL(/\/dashboard/);
    });

    test('should login successfully with admin user', async ({ loginPage, page }) => {
      await loginPage.loginSuccessfully(
        testUsers.admin.email,
        testUsers.admin.password
      );
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Invalid Credentials', () => {
    test('should show error for invalid password @smoke', async ({ loginPage }) => {
      await loginPage.loginExpectFailure(
        testUsers.standard.email,
        testUsers.invalid.password,
        'Invalid email or password'
      );
    });

    test('should show error for non-existent user', async ({ loginPage }) => {
      await loginPage.loginExpectFailure(
        'nonexistent@example.com',
        'anypassword',
        'Invalid email or password'
      );
    });

    test('should show error for empty email', async ({ loginPage }) => {
      await loginPage.login('', testUsers.standard.password);
      await loginPage.expectErrorMessage('Email is required');
    });

    test('should show error for empty password', async ({ loginPage }) => {
      await loginPage.login(testUsers.standard.email, '');
      await loginPage.expectErrorMessage('Password is required');
    });
  });

  test.describe('Remember Me', () => {
    test('should persist login when remember me is checked', async ({ loginPage, page }) => {
      await loginPage.toggleRememberMe(true);
      await loginPage.loginSuccessfully(
        testUsers.standard.email,
        testUsers.standard.password
      );
      // Verify session persists after reload
      await page.reload({ waitUntil: 'networkidle' });
      await expect(page).toHaveURL(/\/dashboard/);
    });
  });

  test.describe('Navigation Links', () => {
    test('should navigate to forgot password page', async ({ loginPage, page }) => {
      await loginPage.clickForgotPassword();
      await expect(page).toHaveURL(/\/forgot-password/);
    });

    test('should navigate to signup page', async ({ loginPage, page }) => {
      await loginPage.clickSignup();
      await expect(page).toHaveURL(/\/signup/);
    });
  });

  test.describe('Locked Account', () => {
    test('should show locked account message', async ({ loginPage }) => {
      await loginPage.loginExpectFailure(
        testUsers.locked.email,
        testUsers.locked.password,
        'Account is locked'
      );
    });
  });
});

test.describe('Logout', () => {
  test('should logout successfully @smoke', async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.logout();
    await expect(authenticatedPage).toHaveURL(/\/login/);
  });
});