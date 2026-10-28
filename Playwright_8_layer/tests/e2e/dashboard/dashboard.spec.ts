/**
 * LAYER 6: TEST SPECS LAYER - Dashboard Tests
 * ===========================================
 * Dashboard functionality test specifications.
 */
import { test, expect } from '../../fixtures/auth.fixture';
import { testUsers } from '../../utils/test-data';

test.describe('Dashboard', () => {
  test.beforeEach(async ({ authenticatedPage, dashboardPage }) => {
    await dashboardPage.goto();
  });

  test('should display welcome message with username @smoke', async ({ dashboardPage }) => {
    await dashboardPage.expectOnDashboard();
    await dashboardPage.expectWelcomeMessage(testUsers.standard.firstName);
  });

  test('should display stats cards', async ({ dashboardPage }) => {
    await dashboardPage.expectStatsVisible();
  });

  test('should display recent activity', async ({ dashboardPage }) => {
    await dashboardPage.expectActivityCount(5);
  });

  test('should navigate to profile from user menu', async ({ dashboardPage, page }) => {
    await dashboardPage.gotoProfile();
    await expect(page).toHaveURL(/\/profile/);
  });

  test('should logout from user menu', async ({ dashboardPage, page }) => {
    await dashboardPage.logout();
    await expect(page).toHaveURL(/\/login/);
  });

  test('should open quick actions', async ({ dashboardPage }) => {
    await dashboardPage.clickQuickAction('Create Order');
    await expect(page).toHaveURL(/\/orders\/new/);
  });
});

test.describe('Dashboard - Guest Access', () => {
  test('should redirect to login when accessing dashboard as guest', async ({ guestPage }) => {
    await guestPage.goto('/dashboard');
    await expect(guestPage).toHaveURL(/\/login/);
  });
});