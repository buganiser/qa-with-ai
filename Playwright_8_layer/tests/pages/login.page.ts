/**
 * LAYER 4: PAGE OBJECTS LAYER - Login Page
 * =========================================
 * Concrete page object for login functionality.
 * Encapsulates all selectors and actions for the login page.
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class LoginPage extends BasePage {
  // ===== Selectors (Priority: getByRole > getByLabel > getByTestId) =====
  readonly emailInput: Locator;
  readonly passwordInput: Locator;
  readonly submitButton: Locator;
  readonly errorMessage: Locator;
  readonly forgotPasswordLink: Locator;
  readonly rememberMeCheckbox: Locator;
  readonly signupLink: Locator;

  constructor(page: Page) {
    super(page);
    this.emailInput = page.getByLabel('Email');
    this.passwordInput = page.getByLabel('Password');
    this.submitButton = page.getByRole('button', { name: 'Sign in' });
    this.errorMessage = page.getByRole('alert');
    this.forgotPasswordLink = page.getByRole('link', { name: 'Forgot password?' });
    this.rememberMeCheckbox = page.getByRole('checkbox', { name: 'Remember me' });
    this.signupLink = page.getByRole('link', { name: 'Sign up' });
  }

  // ===== Navigation =====
  async goto(): Promise<void> {
    await this.navigate('/login');
    await this.waitForPageLoad();
  }

  // ===== Actions =====

  /**
   * Perform login with credentials
   */
  async login(email: string, password: string): Promise<void> {
    await this.emailInput.fill(email);
    await this.passwordInput.fill(password);
    await this.submitButton.click();
    await this.waitForPageLoad();
  }

  /**
   * Login and expect success (navigate to dashboard)
   */
  async loginSuccessfully(email: string, password: string): Promise<void> {
    await this.login(email, password);
    await this.expectURL(/\/dashboard/);
  }

  /**
   * Login and expect failure with specific error
   */
  async loginExpectFailure(email: string, password: string, expectedError: string): Promise<void> {
    await this.login(email, password);
    await this.expectErrorMessage(expectedError);
  }

  /**
   * Toggle remember me checkbox
   */
  async toggleRememberMe(checked: boolean): Promise<void> {
    if (checked !== (await this.rememberMeCheckbox.isChecked())) {
      await this.rememberMeCheckbox.click();
    }
  }

  /**
   * Click forgot password link
   */
  async clickForgotPassword(): Promise<void> {
    await this.forgotPasswordLink.click();
    await this.waitForPageLoad();
  }

  /**
   * Click signup link
   */
  async clickSignup(): Promise<void> {
    await this.signupLink.click();
    await this.waitForPageLoad();
  }

  // ===== Validations =====

  /**
   * Expect error message to be visible with specific text
   */
  async expectErrorMessage(message: string): Promise<void> {
    await this.expectVisible(this.errorMessage);
    await this.expectText(this.errorMessage, message);
  }

  /**
   * Expect no error message
   */
  async expectNoError(): Promise<void> {
    await this.expectHidden(this.errorMessage);
  }

  /**
   * Expect to be on login page
   */
  async expectOnLoginPage(): Promise<void> {
    await this.expectURL(/\/login/);
    await this.expectVisible(this.emailInput);
    await this.expectVisible(this.passwordInput);
    await this.expectVisible(this.submitButton);
  }

  /**
   * Expect form fields to be empty
   */
  async expectEmptyForm(): Promise<void> {
    await this.expectValue(this.emailInput, '');
    await this.expectValue(this.passwordInput, '');
  }

  /**
   * Check if login button is disabled
   */
  async isLoginDisabled(): Promise<boolean> {
    return this.submitButton.isDisabled();
  }
}