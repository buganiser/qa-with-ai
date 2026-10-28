/**
 * LAYER 4: PAGE OBJECTS LAYER - Cart Page
 * =======================================
 * Concrete page object for shopping cart functionality.
 */
import { Page, Locator, expect } from '@playwright/test';
import { BasePage } from './base.page';

export class CartPage extends BasePage {
  // ===== Selectors =====
  readonly cartHeading: Locator;
  readonly cartItems: Locator;
  readonly cartItem: Locator;
  readonly itemName: Locator;
  readonly itemPrice: Locator;
  readonly itemQuantity: Locator;
  readonly itemSubtotal: Locator;
  readonly removeButton: Locator;
  readonly updateQuantityButton: Locator;
  readonly subtotal: Locator;
  readonly tax: Locator;
  readonly total: Locator;
  readonly continueShoppingLink: Locator;
  readonly checkoutButton: Locator;
  readonly emptyCartMessage: Locator;

  constructor(page: Page) {
    super(page);
    this.cartHeading = page.getByRole('heading', { name: /shopping cart|cart/i });
    this.cartItems = page.getByRole('list', { name: /cart items/i });
    this.cartItem = page.getByRole('listitem');
    this.itemName = page.getByRole('cell', { name: /product|name/i });
    this.itemPrice = page.getByRole('cell', { name: /price/i });
    this.itemQuantity = page.getByRole('spinbutton', { name: /quantity/i });
    this.itemSubtotal = page.getByRole('cell', { name: /subtotal/i });
    this.removeButton = page.getByRole('button', { name: /remove|delete/i });
    this.updateQuantityButton = page.getByRole('button', { name: /update/i });
    this.subtotal = page.getByRole('cell', { name: /subtotal/i }).last();
    this.tax = page.getByRole('cell', { name: /tax/i });
    this.total = page.getByRole('cell', { name: /total/i }).last();
    this.continueShoppingLink = page.getByRole('link', { name: /continue shopping/i });
    this.checkoutButton = page.getByRole('button', { name: /proceed to checkout|checkout/i });
    this.emptyCartMessage = page.getByText(/your cart is empty|no items in cart/i);
  }

  // ===== Navigation =====
  async goto(): Promise<void> {
    await this.navigate('/cart');
    await this.waitForPageLoad();
  }

  // ===== Actions =====

  async updateQuantity(productName: string, quantity: number): Promise<void> {
    const item = this.cartItem.filter({ hasText: productName });
    const quantityInput = item.getByRole('spinbutton', { name: /quantity/i });
    await quantityInput.fill(String(quantity));
    await item.getByRole('button', { name: /update/i }).click();
    await this.waitForPageLoad();
  }

  async removeItem(productName: string): Promise<void> {
    const item = this.cartItem.filter({ hasText: productName });
    await item.getByRole('button', { name: /remove|delete/i }).click();
    await this.waitForPageLoad();
  }

  async continueShopping(): Promise<void> {
    await this.continueShoppingLink.click();
    await this.waitForPageLoad();
  }

  async proceedToCheckout(): Promise<void> {
    await this.checkoutButton.click();
    await this.waitForPageLoad();
  }

  // ===== Validations =====

  async expectOnCartPage(): Promise<void> {
    await this.expectURL(/\/cart/);
    await this.expectVisible(this.cartHeading);
  }

  async expectCartEmpty(): Promise<void> {
    await this.expectVisible(this.emptyCartMessage);
  }

  async expectItemInCart(productName: string, expectedQuantity: number): Promise<void> {
    const item = this.cartItem.filter({ hasText: productName });
    await this.expectVisible(item);
    await this.expectValue(item.getByRole('spinbutton', { name: /quantity/i }), String(expectedQuantity));
  }

  async expectItemNotInCart(productName: string): Promise<void> {
    const item = this.cartItem.filter({ hasText: productName });
    await this.expectHidden(item);
  }

  async expectSubtotal(amount: number): Promise<void> {
    await this.expectText(this.subtotal, new RegExp(`\\$${amount.toFixed(2)}`));
  }

  async expectTotal(amount: number): Promise<void> {
    await this.expectText(this.total, new RegExp(`\\$${amount.toFixed(2)}`));
  }

  async getItemCount(): Promise<number> {
    return this.cartItem.count();
  }
}