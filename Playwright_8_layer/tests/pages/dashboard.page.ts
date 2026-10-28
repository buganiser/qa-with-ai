/**
 * LAYER 4: PAGE OBJECTS LAYER - Dashboard Page
 * ============================================
 * Concrete page object for dashboard functionality.
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class DashboardPage extends BasePage {
  // ===== Selectors =====
  readonly welcomeHeading: Locator;
  readonly userMenu: Locator;
  readonly logoutButton: Locator;
  readonly profileLink: Locator;
  readonly statsCards: Locator;
  readonly recentActivity: Locator;
  readonly quickActions: Locator;

  constructor(page: Page) {
    super(page);
    this.welcomeHeading = page.getByRole('heading', { name: /welcome/i });
    this.userMenu = page.getByRole('button', { name: /user menu|profile/i });
    this.logoutButton = page.getByRole('menuitem', { name: /logout|sign out/i });
    this.profileLink = page.getByRole('link', { name: /profile|account/i });
    this.statsCards = page.getByRole('region', { name: /statistics|stats/i });
    this.recentActivity = page.getByRole('region', { name: /recent activity/i });
    this.quickActions = page.getByRole('region', { name: /quick actions/i });
  }

  // ===== Navigation =====
  async goto(): Promise<void> {
    await this.navigate('/dashboard');
    await this.waitForPageLoad();
  }

  // ===== Actions =====

  async openUserMenu(): Promise<void> {
    await this.userMenu.click();
  }

  async logout(): Promise<void> {
    await this.openUserMenu();
    await this.logoutButton.click();
    await this.waitForPageLoad();
  }

  async gotoProfile(): Promise<void> {
    await this.openUserMenu();
    await this.profileLink.click();
    await this.waitForPageLoad();
  }

  async clickQuickAction(actionName: string): Promise<void> {
    await this.page.getByRole('button', { name: actionName }).click();
    await this.waitForPageLoad();
  }

  // ===== Validations =====

  async expectOnDashboard(): Promise<void> {
    await this.expectURL(/\/dashboard/);
    await this.expectVisible(this.welcomeHeading);
  }

  async expectWelcomeMessage(username: string): Promise<void> {
    await this.expectContainText(this.welcomeHeading, username);
  }

  async expectStatsVisible(): Promise<void> {
    await this.expectVisible(this.statsCards);
  }

  async expectActivityCount(count: number): Promise<void> {
    await this.expectCount(this.recentActivity.getByRole('listitem'), count);
  }
}