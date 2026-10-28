/**
 * LAYER 8: GLOBAL SETUP LAYER
 * ===========================
 * Runs once before all tests.
 * Sets up test environment, databases, external services.
 */
import { chromium, FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalSetup(config: FullConfig) {
  console.log('🚀 Starting global test setup...');

  // ===== 1. Create necessary directories =====
  const dirs = [
    'playwright/.auth',
    'test-results',
    'screenshots',
    'playwright-report',
    'tests/snapshots',
  ];

  for (const dir of dirs) {
    const fullPath = path.resolve(__dirname, dir);
    if (!fs.existsSync(fullPath)) {
      fs.mkdirSync(fullPath, { recursive: true });
      console.log(`📁 Created directory: ${dir}`);
    }
  }

  // ===== 2. Verify base URL is accessible =====
  const baseURL = process.env.BASE_URL || 'https://example.com';
  console.log(`🌐 Base URL: ${baseURL}`);

  // Skip URL check for CI if no server
  if (!process.env.CI) {
    try {
      const browser = await chromium.launch();
      const page = await browser.newPage();
      const response = await page.goto(baseURL, { waitUntil: 'networkidle', timeout: 30_000 });

      if (response?.ok()) {
        console.log('✅ Base URL is accessible');
      } else {
        console.warn(`⚠️  Base URL returned status: ${response?.status()}`);
      }
      await browser.close();
    } catch (error) {
      console.warn(`⚠️  Could not verify base URL: ${error.message}`);
    }
  }

  // ===== 3. Set up test database (if applicable) =====
  // await setupTestDatabase();

  // ===== 4. Seed test data =====
  // await seedTestData();

  // ===== 5. Start mock servers (if needed) =====
  // await startMockServers();

  // ===== 6. Verify authentication setup exists =====
  const authFiles = ['playwright/.auth/user.json', 'playwright/.auth/admin.json'];
  for (const authFile of authFiles) {
    const fullPath = path.resolve(__dirname, authFile);
    if (!fs.existsSync(fullPath)) {
      console.log(`📝 Auth file not found (will be created by auth.setup.ts): ${authFile}`);
    }
  }

  // ===== 7. Set global test metadata =====
  process.env.TEST_RUN_ID = `run_${Date.now()}`;
  process.env.TEST_START_TIME = new Date().toISOString();

  console.log('✅ Global setup completed');
}

export default globalSetup;