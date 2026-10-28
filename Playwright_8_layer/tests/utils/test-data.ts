/**
 * LAYER 5: TEST DATA / UTILS LAYER
 * ================================
 * Centralized test data, constants, and helper functions.
 * Keeps test specs clean and data-driven.
 */

// ===== Test Users =====
export const testUsers = {
  standard: {
    email: process.env.TEST_USER_EMAIL || 'user@example.com',
    password: process.env.TEST_USER_PASSWORD || 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe',
    role: 'user',
  },
  admin: {
    email: process.env.TEST_ADMIN_EMAIL || 'admin@example.com',
    password: process.env.TEST_ADMIN_PASSWORD || 'AdminPass123!',
    firstName: 'Jane',
    lastName: 'Admin',
    role: 'admin',
  },
  locked: {
    email: 'locked@example.com',
    password: 'LockedPass123!',
    firstName: 'Locked',
    lastName: 'User',
    role: 'locked',
  },
  invalid: {
    email: 'invalid@example.com',
    password: 'wrongpassword',
    firstName: 'Invalid',
    lastName: 'User',
    role: 'none',
  },
};

// ===== Test Products =====
export const testProducts = {
  standard: {
    id: 'prod_001',
    name: 'Standard Widget',
    description: 'A basic widget for everyday use',
    price: 29.99,
    category: 'widgets',
    inStock: true,
  },
  premium: {
    id: 'prod_002',
    name: 'Premium Widget Pro',
    description: 'Advanced widget with premium features',
    price: 99.99,
    category: 'widgets',
    inStock: true,
  },
  outOfStock: {
    id: 'prod_003',
    name: 'Limited Edition Widget',
    description: 'Rare widget, currently unavailable',
    price: 199.99,
    category: 'widgets',
    inStock: false,
  },
};

// ===== Shipping Addresses =====
export const testAddresses = {
  us: {
    fullName: 'John Doe',
    address: '123 Main Street',
    city: 'San Francisco',
    state: 'CA',
    zip: '94102',
    country: 'US',
    phone: '+1-555-0123',
  },
  uk: {
    fullName: 'Jane Smith',
    address: '456 High Street',
    city: 'London',
    state: '',
    zip: 'SW1A 1AA',
    country: 'GB',
    phone: '+44-20-7946-0958',
  },
};

// ===== Payment Data =====
export const testPayments = {
  validVisa: {
    number: '4111111111111111',
    expiry: '12/28',
    cvc: '123',
    name: 'John Doe',
  },
  validMastercard: {
    number: '5555555555554444',
    expiry: '06/29',
    cvc: '456',
    name: 'Jane Smith',
  },
  declined: {
    number: '4000000000000002',
    expiry: '12/28',
    cvc: '123',
    name: 'Declined Card',
  },
};

// ===== Test Constants =====
export const testConstants = {
  timeouts: {
    short: 5_000,
    medium: 10_000,
    long: 30_000,
  },
  retries: {
    default: 2,
    flaky: 3,
  },
  urls: {
    home: '/',
    login: '/login',
    dashboard: '/dashboard',
    cart: '/cart',
    checkout: '/checkout',
    profile: '/profile',
  },
  selectors: {
    testId: 'data-testid',
  },
};

// ===== Helper Functions =====

/**
 * Generate random test email
 */
export function generateTestEmail(prefix = 'test'): string {
  const timestamp = Date.now();
  const random = Math.random().toString(36).substring(7);
  return `${prefix}_${timestamp}_${random}@example.com`;
}

/**
 * Generate random string
 */
export function generateRandomString(length = 10): string {
  return Math.random().toString(36).substring(2, length + 2);
}

/**
 * Format currency
 */
export function formatCurrency(amount: number, currency = 'USD'): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
  }).format(amount);
}

/**
 * Parse currency string to number
 */
export function parseCurrency(currencyString: string): number {
  return parseFloat(currencyString.replace(/[^0-9.-]/g, ''));
}

/**
 * Wait for condition with polling
 */
export async function waitForCondition(
  condition: () => Promise<boolean>,
  timeout = 10_000,
  interval = 500
): Promise<void> {
  const start = Date.now();
  while (Date.now() - start < timeout) {
    if (await condition()) return;
    await new Promise((resolve) => setTimeout(resolve, interval));
  }
  throw new Error(`Condition not met within ${timeout}ms`);
}

/**
 * Generate test data for parameterized tests
 */
export function generateTestCases<T>(base: T, variations: Partial<T>[]): T[] {
  return variations.map((v) => ({ ...base, ...v }));
}

/**
 * Deep merge objects
 */
export function deepMerge<T extends Record<string, any>>(target: T, source: Partial<T>): T {
  const result = { ...target };
  for (const key of Object.keys(source)) {
    if (
      source[key] &&
      typeof source[key] === 'object' &&
      !Array.isArray(source[key])
    ) {
      result[key] = deepMerge(target[key] || {}, source[key]);
    } else {
      result[key] = source[key] as T[Extract<keyof T, string>];
    }
  }
  return result;
}