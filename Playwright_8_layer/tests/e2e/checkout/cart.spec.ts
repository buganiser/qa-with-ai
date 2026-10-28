/**
 * LAYER 6: TEST SPECS LAYER - Cart Tests
 * ======================================
 * Shopping cart functionality test specifications.
 */
import { test, expect } from '../../fixtures/auth.fixture';
import { testProducts, testUsers } from '../../utils/test-data';

test.describe('Shopping Cart', () => {
  test.beforeEach(async ({ authenticatedPage, cartPage }) => {
    await cartPage.goto();
  });

  test('should display empty cart for new user @smoke', async ({ cartPage }) => {
    await cartPage.expectOnCartPage();
    await cartPage.expectCartEmpty();
  });

  test('should add product to cart', async ({ authenticatedPage, cartPage }) => {
    // Navigate to product and add to cart
    await authenticatedPage.goto(`/product/${testProducts.standard.id}`);
    await authenticatedPage.getByRole('button', { name: /add to cart/i }).click();
    await cartPage.goto();
    await cartPage.expectItemInCart(testProducts.standard.name, 1);
  });

  test('should update item quantity', async ({ cartPage }) => {
    // Pre-condition: item in cart
    await cartPage.updateQuantity(testProducts.standard.name, 3);
    await cartPage.expectItemInCart(testProducts.standard.name, 3);
  });

  test('should remove item from cart', async ({ cartPage }) => {
    await cartPage.removeItem(testProducts.standard.name);
    await cartPage.expectItemNotInCart(testProducts.standard.name);
  });

  test('should calculate subtotal correctly', async ({ cartPage }) => {
    await cartPage.updateQuantity(testProducts.standard.name, 2);
    await cartPage.expectSubtotal(testProducts.standard.price * 2);
  });

  test('should proceed to checkout', async ({ cartPage, page }) => {
    await cartPage.proceedToCheckout();
    await expect(page).toHaveURL(/\/checkout/);
  });

  test('should continue shopping', async ({ cartPage, page }) => {
    await cartPage.continueShopping();
    await expect(page).toHaveURL(/\//);
  });
});

test.describe('Cart - Multiple Items', () => {
  test.beforeEach(async ({ authenticatedPage }) => {
    // Add multiple items
    for (const product of [testProducts.standard, testProducts.premium]) {
      await authenticatedPage.goto(`/product/${product.id}`);
      await authenticatedPage.getByRole('button', { name: /add to cart/i }).click();
    }
  });

  test('should display multiple items', async ({ cartPage }) => {
    await cartPage.goto();
    await cartPage.expectItemInCart(testProducts.standard.name, 1);
    await cartPage.expectItemInCart(testProducts.premium.name, 1);
    const count = await cartPage.getItemCount();
    expect(count).toBe(2);
  });

  test('should calculate total with multiple items', async ({ cartPage }) => {
    await cartPage.goto();
    const expectedTotal = testProducts.standard.price + testProducts.premium.price;
    await cartPage.expectTotal(expectedTotal);
  });
});