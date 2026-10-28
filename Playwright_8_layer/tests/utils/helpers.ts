/**
 * LAYER 5: TEST UTILS LAYER - Helpers
 * ==================================
 * Reusable helper functions for common test operations.
 */
import { Page, Locator, expect } from '@playwright/test';

// ===== Wait Helpers =====

/**
 * Wait for element to be visible with custom timeout
 */
export async function waitForVisible(locator: Locator, timeout = 10_000): Promise<void> {
  await expect(locator).toBeVisible({ timeout });
}

/**
 * Wait for element to be hidden
 */
export async function waitForHidden(locator: Locator, timeout = 10_000): Promise<void> {
  await expect(locator).toBeHidden({ timeout });
}

/**
 * Wait for element to have specific text
 */
export async function waitForText(locator: Locator, text: string | RegExp, timeout = 10_000): Promise<void> {
  await expect(locator).toHaveText(text, { timeout });
}

/**
 * Wait for URL to match pattern
 */
export async function waitForURL(page: Page, url: string | RegExp, timeout = 10_000): Promise<void> {
  await expect(page).toHaveURL(url, { timeout });
}

// ===== Form Helpers =====

/**
 * Fill multiple form fields at once
 */
export async function fillForm(page: Page, fields: Record<string, string>): Promise<void> {
  for (const [label, value] of Object.entries(fields)) {
    await page.getByLabel(label).fill(value);
  }
}

/**
 * Select option from dropdown by label
 */
export async function selectOption(page: Page, label: string, value: string): Promise<void> {
  await page.getByLabel(label).selectOption(value);
}

/**
 * Check/uncheck checkbox
 */
export async function setCheckbox(page: Page, label: string, checked: boolean): Promise<void> {
  const checkbox = page.getByRole('checkbox', { name: label });
  const isChecked = await checkbox.isChecked();
  if (isChecked !== checked) {
    await checkbox.click();
  }
}

/**
 * Select radio button
 */
export async function selectRadio(page: Page, label: string): Promise<void> {
  await page.getByRole('radio', { name: label }).check();
}

// ===== Navigation Helpers =====

/**
 * Navigate and wait for network idle
 */
export async function navigateAndWait(page: Page, path: string): Promise<void> {
  await page.goto(path, { waitUntil: 'networkidle' });
}

/**
 * Go back and wait
 */
export async function goBackAndWait(page: Page): Promise<void> {
  await page.goBack({ waitUntil: 'networkidle' });
}

/**
 * Reload and wait
 */
export async function reloadAndWait(page: Page): Promise<void> {
  await page.reload({ waitUntil: 'networkidle' });
}

// ===== Assertion Helpers =====

/**
 * Assert element is visible with custom message
 */
export async function assertVisible(locator: Locator, message?: string): Promise<void> {
  await expect(locator, message).toBeVisible();
}

/**
 * Assert element count
 */
export async function assertCount(locator: Locator, count: number, message?: string): Promise<void> {
  await expect(locator, message).toHaveCount(count);
}

/**
 * Soft assert visible
 */
export async function softAssertVisible(locator: Locator, message?: string): Promise<void> {
  await expect.soft(locator, message).toBeVisible();
}

/**
 * Soft assert text
 */
export async function softAssertText(locator: Locator, text: string | RegExp, message?: string): Promise<void> {
  await expect.soft(locator, message).toHaveText(text);
}

// ===== Screenshot Helpers =====

/**
 * Take full page screenshot
 */
export async function takeFullPageScreenshot(page: Page, name: string): Promise<Buffer> {
  return page.screenshot({ path: `screenshots/${name}.png`, fullPage: true });
}

/**
 * Take element screenshot
 */
export async function takeElementScreenshot(locator: Locator, name: string): Promise<Buffer> {
  return locator.screenshot({ path: `screenshots/${name}.png` });
}

// ===== Keyboard Helpers =====

/**
 * Press key combination
 */
export async function pressKeys(page: Page, keys: string): Promise<void> {
  await page.keyboard.press(keys);
}

/**
 * Type text with delay
 */
export async function typeText(page: Page, text: string, delay = 50): Promise<void> {
  await page.keyboard.type(text, { delay });
}

// ===== Date/Time Helpers =====

/**
 * Get formatted date for test data
 */
export function getTestDate(daysOffset = 0): string {
  const date = new Date();
  date.setDate(date.getDate() + daysOffset);
  return date.toISOString().split('T')[0];
}

/**
 * Get formatted time
 */
export function getTestTime(): string {
  return new Date().toLocaleTimeString('en-US', { hour12: false });
}

// ===== Environment Helpers =====

/**
 * Check if running in CI
 */
export function isCI(): boolean {
  return !!process.env.CI;
}

/**
 * Get base URL from environment
 */
export function getBaseURL(): string {
  return process.env.BASE_URL || 'https://example.com';
}

/**
 * Get test environment name
 */
export function getTestEnv(): string {
  return process.env.TEST_ENV || 'local';
}

// ===== Debug Helpers =====

/**
 * Pause test execution (for debugging)
 */
export async function debugPause(page: Page): Promise<void> {
  await page.pause();
}

/**
 * Log page URL and title
 */
export async function logPageInfo(page: Page): Promise<void> {
  console.log(`URL: ${page.url()}`);
  console.log(`Title: ${await page.title()}`);
}

/**
 * Dump page content (for debugging)
 */
export async function dumpPageContent(page: Page): Promise<void> {
  const content = await page.content();
  console.log(content.substring(0, 5000));
}