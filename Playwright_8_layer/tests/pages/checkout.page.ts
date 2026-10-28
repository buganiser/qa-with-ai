/**
 * LAYER 4: PAGE OBJECTS LAYER - Checkout Page
 * ===========================================
 * Concrete page object for checkout functionality.
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CheckoutPage extends BasePage {
  // ===== Selectors =====
  readonly checkoutHeading: Locator;
  readonly shippingForm: Locator;
  readonly billingForm: Locator;
  readonly fullNameInput: Locator;
  readonly emailInput: Locator;
  readonly addressInput: Locator;
  readonly cityInput: Locator;
  readonly stateInput: Locator;
  readonly zipInput: Locator;
  readonly countrySelect: Locator;
  readonly phoneInput: Locator;
  readonly sameAsShippingCheckbox: Locator;
  readonly paymentMethodSection: Locator;
  readonly creditCardRadio: Locator;
  readonly paypalRadio: Locator;
  readonly cardNumberInput: Locator;
  readonly cardExpiryInput: Locator;
  readonly cardCvcInput: Locator;
  readonly cardNameInput: Locator;
  readonly placeOrderButton: Locator;
  readonly orderSummary: Locator;
  readonly orderTotal: Locator;
  readonly successMessage: Locator;
  readonly orderNumber: Locator;

  constructor(page: Page) {
    super(page);
    this.checkoutHeading = page.getByRole('heading', { name: /checkout/i });
    this.shippingForm = page.getByRole('form', { name: /shipping/i });
    this.billingForm = page.getByRole('form', { name: /billing/i });
    this.fullNameInput = page.getByLabel(/full name|name/i);
    this.emailInput = page.getByLabel(/email/i);
    this.addressInput = page.getByLabel(/address/i);
    this.cityInput = page.getByLabel(/city/i);
    this.stateInput = page.getByLabel(/state|province/i);
    this.zipInput = page.getByLabel(/zip|postal code/i);
    this.countrySelect = page.getByLabel(/country/i);
    this.phoneInput = page.getByLabel(/phone/i);
    this.sameAsShippingCheckbox = page.getByRole('checkbox', { name: /same as shipping/i });
    this.paymentMethodSection = page.getByRole('region', { name: /payment/i });
    this.creditCardRadio = page.getByRole('radio', { name: /credit card/i });
    this.paypalRadio = page.getByRole('radio', { name: /paypal/i });
    this.cardNumberInput = page.getByLabel(/card number/i);
    this.cardExpiryInput = page.getByLabel(/expiry/i);
    this.cardCvcInput = page.getByLabel(/cvc|cvv/i);
    this.cardNameInput = page.getByLabel(/name on card/i);
    this.placeOrderButton = page.getByRole('button', { name: /place order|complete purchase/i });
    this.orderSummary = page.getByRole('region', { name: /order summary/i });
    this.orderTotal = page.getByRole('cell', { name: /total/i }).last();
    this.successMessage = page.getByRole('heading', { name: /order confirmed|thank you/i });
    this.orderNumber = page.getByText(/order #|confirmation #/i);
  }

  // ===== Navigation =====
  async goto(): Promise<void> {
    await this.navigate('/checkout');
    await this.waitForPageLoad();
  }

  // ===== Actions =====

  async fillShippingInfo(data: {
    fullName: string;
    email: string;
    address: string;
    city: string;
    state: string;
    zip: string;
    country: string;
    phone: string;
  }): Promise<void> {
    await this.fullNameInput.fill(data.fullName);
    await this.emailInput.fill(data.email);
    await this.addressInput.fill(data.address);
    await this.cityInput.fill(data.city);
    await this.stateInput.fill(data.state);
    await this.zipInput.fill(data.zip);
    await this.countrySelect.selectOption(data.country);
    await this.phoneInput.fill(data.phone);
  }

  async useSameBilling(): Promise<void> {
    await this.sameAsShippingCheckbox.check();
  }

  async selectCreditCard(): Promise<void> {
    await this.creditCardRadio.check();
  }

  async selectPayPal(): Promise<void> {
    await this.paypalRadio.check();
  }

  async fillCardDetails(data: {
    number: string;
    expiry: string;
    cvc: string;
    name: string;
  }): Promise<void> {
    await this.cardNumberInput.fill(data.number);
    await this.cardExpiryInput.fill(data.expiry);
    await this.cardCvcInput.fill(data.cvc);
    await this.cardNameInput.fill(data.name);
  }

  async placeOrder(): Promise<void> {
    await this.placeOrderButton.click();
    await this.waitForPageLoad();
  }

  // ===== Validations =====

  async expectOnCheckoutPage(): Promise<void> {
    await this.expectURL(/\/checkout/);
    await this.expectVisible(this.checkoutHeading);
  }

  async expectOrderSuccess(): Promise<void> {
    await this.expectVisible(this.successMessage);
    await this.expectVisible(this.orderNumber);
  }

  async getOrderNumber(): Promise<string> {
    const text = await this.orderNumber.textContent();
    return text?.match(/[A-Z0-9-]+/)?.[0] || '';
  }

  async expectOrderTotal(amount: number): Promise<void> {
    await this.expectText(this.orderTotal, new RegExp(`\\$${amount.toFixed(2)}`));
  }
}