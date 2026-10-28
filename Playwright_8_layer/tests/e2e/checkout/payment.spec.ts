/**
 * LAYER 6: TEST SPECS LAYER - Checkout/Payment Tests
 * ==================================================
 * Checkout and payment flow test specifications.
 */
import { test, expect } from '../../fixtures/auth.fixture';
import { testProducts, testAddresses, testPayments } from '../../utils/test-data';

test.describe('Checkout Flow', () => {
  test.beforeEach(async ({ authenticatedPage, cartPage, checkoutPage }) => {
    // Add item to cart first
    await authenticatedPage.goto(`/product/${testProducts.standard.id}`);
    await authenticatedPage.getByRole('button', { name: /add to cart/i }).click();
    await cartPage.goto();
    await cartPage.proceedToCheckout();
  });

  test('should complete checkout with valid credit card @smoke @critical', async ({ checkoutPage }) => {
    await checkoutPage.fillShippingInfo(testAddresses.us);
    await checkoutPage.selectCreditCard();
    await checkoutPage.fillCardDetails(testPayments.validVisa);
    await checkoutPage.placeOrder();
    await checkoutPage.expectOrderSuccess();
  });

  test('should complete checkout with PayPal', async ({ checkoutPage, page }) => {
    await checkoutPage.fillShippingInfo(testAddresses.us);
    await checkoutPage.selectPayPal();
    // PayPal would redirect - mock in real tests
    await checkoutPage.placeOrder();
    // Verify redirect to PayPal
    await expect(page).toHaveURL(/paypal/);
  });

  test('should show error for declined card', async ({ checkoutPage }) => {
    await checkoutPage.fillShippingInfo(testAddresses.us);
    await checkoutPage.selectCreditCard();
    await checkoutPage.fillCardDetails(testPayments.declined);
    await checkoutPage.placeOrder();
    // Expect error message
    await expect(checkoutPage.page.getByRole('alert')).toContainText('declined');
  });

  test('should validate required shipping fields', async ({ checkoutPage }) => {
    await checkoutPage.placeOrder();
    await expect(checkoutPage.page.getByRole('alert')).toContainText('required');
  });

  test('should use same billing as shipping', async ({ checkoutPage }) => {
    await checkoutPage.fillShippingInfo(testAddresses.us);
    await checkoutPage.useSameBilling();
    await checkoutPage.selectCreditCard();
    await checkoutPage.fillCardDetails(testPayments.validVisa);
    await checkoutPage.placeOrder();
    await checkoutPage.expectOrderSuccess();
  });

  test('should allow different billing address', async ({ checkoutPage }) => {
    await checkoutPage.fillShippingInfo(testAddresses.us);
    await checkoutPage.useSameBilling(); // uncheck
    await checkoutPage.fillBillingInfo(testAddresses.uk);
    await checkoutPage.selectCreditCard();
    await checkoutPage.fillCardDetails(testPayments.validVisa);
    await checkoutPage.placeOrder();
    await checkoutPage.expectOrderSuccess();
  });
});

test.describe('Checkout - Order Summary', () => {
  test('should display correct order total', async ({ checkoutPage }) => {
    const expectedTotal = testProducts.standard.price;
    await checkoutPage.expectOrderTotal(expectedTotal);
  });

  test('should display order number after success', async ({ checkoutPage }) => {
    await checkoutPage.fillShippingInfo(testAddresses.us);
    await checkoutPage.selectCreditCard();
    await checkoutPage.fillCardDetails(testPayments.validVisa);
    await checkoutPage.placeOrder();
    const orderNumber = await checkoutPage.getOrderNumber();
    expect(orderNumber).toMatch(/[A-Z0-9-]+/);
  });
});