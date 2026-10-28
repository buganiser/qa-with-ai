/**
 * LAYER 3: BASE PAGE LAYER
 * ========================
 * Abstract base class providing common functionality for all page objects.
 * Encapsulates shared selectors, navigation, and utility methods.
 */
import { Page, Locator, expect, Response } from '@playwright/test';

export abstract class BasePage {
  readonly page: Page;
  readonly baseURL: string;

  constructor(page: Page) {
    this.page = page;
    this.baseURL = process.env.BASE_URL || 'https://example.com';
  }

  // ===== Navigation =====

  /**
   * Navigate to a path relative to baseURL
   */
  async navigate(path: string): Promise<void> {
    await this.page.goto(path, { waitUntil: 'networkidle' });
  }

  /**
   * Navigate to absolute URL
   */
  async goto(url: string): Promise<void> {
    await this.page.goto(url, { waitUntil: 'networkidle' });
  }

  /**
   * Wait for page to fully load
   */
  async waitForPageLoad(): Promise<void> {
    await this.page.waitForLoadState('networkidle');
  }

  /**
   * Wait for specific network response
   */
  async waitForResponse(urlPattern: string | RegExp, timeout = 10_000): Promise<Response | null> {
    return this.page.waitForResponse(urlPattern, { timeout });
  }

  // ===== Page Information =====

  async getTitle(): Promise<string> {
    return this.page.title();
  }

  async getCurrentURL(): Promise<string> {
    return this.page.url();
  }

  async expectURL(path: string | RegExp): Promise<void> {
    await expect(this.page).toHaveURL(path);
  }

  async expectTitle(title: string | RegExp): Promise<void> {
    await expect(this.page).toHaveTitle(title);
  }

  // ===== Common Selectors (Semantic - High Priority) =====

  get mainContent(): Locator {
    return this.page.getByRole('main');
  }

  get header(): Locator {
    return this.page.getByRole('banner');
  }

  get footer(): Locator {
    return this.page.getByRole('contentinfo');
  }

  get navigation(): Locator {
    return this.page.getByRole('navigation');
  }

  // ===== Form Helpers =====

  /**
   * Fill form field by label
   */
  async fillByLabel(label: string, value: string): Promise<void> {
    await this.page.getByLabel(label).fill(value);
  }

  /**
   * Fill form field by placeholder
   */
  async fillByPlaceholder(placeholder: string, value: string): Promise<void> {
    await this.page.getByPlaceholder(placeholder).fill(value);
  }

  /**
   * Fill form field by role
   */
  async fillByRole(role: string, name: string, value: string): Promise<void> {
    await this.page.getByRole(role as any, { name }).fill(value);
  }

  /**
   * Click button by accessible name
   */
  async clickButton(name: string): Promise<void> {
    await this.page.getByRole('button', { name }).click();
  }

  /**
   * Click link by accessible name
   */
  async clickLink(name: string): Promise<void> {
    await this.page.getByRole('link', { name }).click();
  }

  // ===== Validation Helpers =====

  /**
   * Expect element to be visible
   */
  async expectVisible(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeVisible();
  }

  /**
   * Expect element to be hidden
   */
  async expectHidden(locator: Locator, message?: string): Promise<void> {
    await expect(locator, message).toBeHidden();
  }

  /**
   * Expect element to have text
   */
  async expectText(locator: Locator, text: string | RegExp, message?: string): Promise<void> {
    await expect(locator, message).toHaveText(text);
  }

  /**
   * Expect element to contain text
   */
  async expectContainText(locator: Locator, text: string | RegExp, message?: string): Promise<void> {
    await expect(locator, message).toContainText(text);
  }

  /**
   * Expect input to have value
   */
  async expectValue(locator: Locator, value: string, message?: string): Promise<void> {
    await expect(locator, message).toHaveValue(value);
  }

  /**
   * Expect element count
   */
  async expectCount(locator: Locator, count: number, message?: string): Promise<void> {
    await expect(locator, message).toHaveCount(count);
  }

  // ===== Screenshot & Debug =====

  async takeScreenshot(name: string): Promise<Buffer> {
    return this.page.screenshot({
      path: `screenshots/${name}.png`,
      fullPage: true,
    });
  }

  async takeElementScreenshot(locator: Locator, name: string): Promise<Buffer> {
    return locator.screenshot({ path: `screenshots/${name}.png` });
  }

  async pause(): Promise<void> {
    await this.page.pause();
  }

  // ===== Keyboard & Mouse =====

  async pressKey(key: string): Promise<void> {
    await this.page.keyboard.press(key);
  }

  async typeText(text: string): Promise<void> {
    await this.page.keyboard.type(text);
  }

  async hover(locator: Locator): Promise<void> {
    await locator.hover();
  }

  // ===== Dialog Handling =====

  async acceptDialog(message?: string): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      if (message) expect(dialog.message()).toContain(message);
      await dialog.accept();
    });
  }

  async dismissDialog(message?: string): Promise<void> {
    this.page.once('dialog', async (dialog) => {
      if (message) expect(dialog.message()).toContain(message);
      await dialog.dismiss();
    });
  }

  // ===== File Upload =====

  async uploadFile(locator: Locator, filePath: string): Promise<void> {
    await locator.setInputFiles(filePath);
  }

  // ===== Local Storage / Session Storage =====

  async setLocalStorage(key: string, value: string): Promise<void> {
    await this.page.evaluate(([k, v]) => localStorage.setItem(k, v), [key, value]);
  }

  async getLocalStorage(key: string): Promise<string | null> {
    return this.page.evaluate((k) => localStorage.getItem(k), key);
  }

  async clearLocalStorage(): Promise<void> {
    await this.page.evaluate(() => localStorage.clear());
  }

  // ===== Viewport =====

  async setViewport(width: number, height: number): Promise<void> {
    await this.page.setViewportSize({ width, height });
  }

  // ===== Soft Assertions =====

  async softExpectVisible(locator: Locator, message?: string): Promise<void> {
    await expect.soft(locator, message).toBeVisible();
  }

  async softExpectText(locator: Locator, text: string | RegExp, message?: string): Promise<void> {
    await expect.soft(locator, message).toHaveText(text);
  }

  async softExpectURL(path: string | RegExp, message?: string): Promise<void> {
    await expect.soft(this.page, message).toHaveURL(path);
  }
}