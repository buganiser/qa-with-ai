# Playwright 8-Layer Architecture

A comprehensive, production-ready Playwright E2E testing framework organized into 8 distinct layers following industry best practices.

## 🏗️ Architecture Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        8-LAYER ARCHITECTURE                      │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌─────────────┐  ┌─────────────┐  ┌─────────────┐             │
│  │   LAYER 1   │  │   LAYER 2   │  │   LAYER 3   │             │
│  │ CONFIGURATION│  │   FIXTURES  │  │  BASE PAGE  │             │
│  │             │  │             │  │             │             │
│  │ playwright. │  │ auth.fixture│  │ base.page.ts│             │
│  │ config.ts   │  │ .ts         │  │             │             │
│  └──────┬──────┘  └──────┬──────┘  └──────┬──────┘             │
│         │                │                │                     │
│         └────────────────┼────────────────┘                     │
│                          ▼                                      │
│  ┌─────────────────────────────────────────────┐               │
│  │              LAYER 4: PAGE OBJECTS           │               │
│  │  login.page.ts  │  dashboard.page.ts         │               │
│  │  cart.page.ts   │  checkout.page.ts          │               │
│  └────────────────────┬────────────────────────┘               │
│                       │                                        │
│         ┌─────────────┼─────────────┐                          │
│         ▼             ▼             ▼                          │
│  ┌─────────────┐ ┌─────────────┐ ┌─────────────┐             │
│  │   LAYER 5   │ │   LAYER 6   │ │   LAYER 7   │             │
│  │ TEST DATA/  │ │ TEST SPECS  │ │    AUTH     │             │
│  │   UTILS     │ │             │ │    SETUP    │             │
│  │             │ │ e2e/        │ │             │             │
│  │ test-data.ts│ │  auth/      │ │ auth.setup.ts│             │
│  │ helpers.ts  │ │  dashboard/ │ └──────┬──────┘             │
│  └─────────────┘ │  checkout/  │        │                    │
│                  └─────────────┘        ▼                    │
│                                 ┌─────────────┐             │
│                                 │   LAYER 8   │             │
│                                 │ GLOBAL SETUP│             │
│                                 │  /TEARDOWN  │             │
│                                 │             │             │
│                                 │global-setup.ts           │
│                                 │global-teardown.ts        │
│                                 └─────────────┘             │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

## 📁 Project Structure

```
playwright-8-layer/
├── playwright.config.ts          # Layer 1: Configuration
├── global-setup.ts               # Layer 8: Global Setup
├── global-teardown.ts            # Layer 8: Global Teardown
├── package.json
├── tsconfig.json
├── playwright/
│   └── .auth/                    # Authentication state files
├── tests/
│   ├── auth.setup.ts             # Layer 7: Auth Setup
│   ├── fixtures/
│   │   └── auth.fixture.ts       # Layer 2: Fixtures
│   ├── pages/                    # Layer 3 & 4: Page Objects
│   │   ├── base.page.ts          # Layer 3: Base Page
│   │   ├── login.page.ts         # Layer 4: Login Page
│   │   ├── dashboard.page.ts     # Layer 4: Dashboard Page
│   │   ├── cart.page.ts          # Layer 4: Cart Page
│   │   └── checkout.page.ts      # Layer 4: Checkout Page
│   ├── utils/                    # Layer 5: Test Data/Utils
│   │   ├── test-data.ts          # Test data constants
│   │   └── helpers.ts            # Helper functions
│   └── e2e/                      # Layer 6: Test Specs
│       ├── auth/
│       │   └── login.spec.ts
│       ├── dashboard/
│       │   └── dashboard.spec.ts
│       └── checkout/
│           ├── cart.spec.ts
│           └── payment.spec.ts
```

## 🎯 Layer Responsibilities

| Layer | File(s) | Responsibility |
|-------|---------|----------------|
| **1. Configuration** | `playwright.config.ts` | Browser config, reporters, projects, timeouts, webServer |
| **2. Fixtures** | `tests/fixtures/auth.fixture.ts` | Custom fixtures, page objects, authenticated contexts, test data |
| **3. Base Page** | `tests/pages/base.page.ts` | Abstract base class with common navigation, selectors, helpers |
| **4. Page Objects** | `tests/pages/*.page.ts` | Concrete page classes with selectors and actions per page |
| **5. Test Data/Utils** | `tests/utils/test-data.ts`, `helpers.ts` | Centralized test data, constants, helper functions |
| **6. Test Specs** | `tests/e2e/**/*.spec.ts` | Test specifications organized by feature |
| **7. Auth Setup** | `tests/auth.setup.ts` | Authentication state generation and storage |
| **8. Global Setup/Teardown** | `global-setup.ts`, `global-teardown.ts` | Environment setup/cleanup, test run metadata |

## 🚀 Quick Start

### Installation

```bash
# Install dependencies
npm install

# Install browsers
npm run install:browsers

# Install system dependencies (Linux only)
npm run install:deps
```

### Running Tests

```bash
# Run all tests
npm test

# Run with UI mode (interactive)
npm run test:ui

# Run headed (see browser)
npm run test:headed

# Debug specific test
npm run test:debug tests/e2e/auth/login.spec.ts

# Run specific project
npm run test:chromium
npm run test:firefox
npm run test:webkit

# Run mobile tests
npm run test:mobile

# Run only auth setup
npm run test:auth
```

### Environment Variables

```bash
# Required
BASE_URL=https://your-app.com
TEST_USER_EMAIL=user@example.com
TEST_USER_PASSWORD=yourpassword

# Optional
TEST_ADMIN_EMAIL=admin@example.com
TEST_ADMIN_PASSWORD=adminpassword
CI=true                    # Enable CI mode
TEST_ENV=staging          # Test environment name
```

## 📝 Writing Tests

### Using Fixtures (Recommended)

```typescript
import { test, expect } from '../fixtures/auth.fixture';
import { testUsers } from '../utils/test-data';

test('should login successfully', async ({ loginPage, page }) => {
  await loginPage.loginSuccessfully(
    testUsers.standard.email,
    testUsers.standard.password
  );
  await expect(page).toHaveURL(/\/dashboard/);
});
```

### Using Page Objects Directly

```typescript
import { test, expect } from '@playwright/test';
import { LoginPage } from '../pages/login.page';

test('should show error for invalid credentials', async ({ page }) => {
  const loginPage = new LoginPage(page);
  await loginPage.goto();
  await loginPage.loginExpectFailure('user@test.com', 'wrong', 'Invalid credentials');
});
```

## 🔑 Key Principles

1. **User-Centric Testing** - Tests mirror real user journeys
2. **Resilient Selectors** - Priority: `getByRole` → `getByLabel` → `getByTestId`
3. **Auto-Waiting** - No `waitForTimeout()`, use built-in waiting
4. **Isolation** - Each test independent, no shared state
5. **Readability** - Tests serve as documentation

## 🎨 Selector Priority

```typescript
// 1. Best - Accessibility tree
page.getByRole('button', { name: 'Submit' });

// 2. Form inputs with labels
page.getByLabel('Email');

// 3. Placeholder text
page.getByPlaceholder('Search...');

// 4. Visible text
page.getByText('Welcome');

// 5. Test IDs (when semantic not available)
page.getByTestId('submit-button');

// 6. Last resort - CSS/XPath
page.locator('.legacy-class >> nth=0');
```

## 📊 Reporting

```bash
# View HTML report
npm run test:report

# View trace for debugging
npx playwright show-trace test-results/trace.zip

# Generate code
npm run codegen https://example.com
```

## 🔧 Configuration

Key configuration options in `playwright.config.ts`:

- **Parallel execution**: `fullyParallel: true`
- **Retries**: 2 on CI, 0 locally
- **Trace**: On first retry
- **Screenshots**: Only on failure
- **Video**: Retain on failure
- **Projects**: Chromium, Firefox, WebKit, Mobile Chrome, Mobile Safari

## 📚 Resources

- [Playwright Documentation](https://playwright.dev/)
- [Page Object Model Guide](https://playwright.dev/docs/pom)
- [Best Practices](https://playwright.dev/docs/best-practices)
- [API Reference](https://playwright.dev/docs/api/class-playwright)

## 📄 License

MIT License - see LICENSE file for details.