/**
 * LAYER 8: GLOBAL TEARDOWN LAYER
 * ==============================
 * Runs once after all tests.
 * Cleans up test environment, databases, external services.
 */
import { FullConfig } from '@playwright/test';
import * as fs from 'fs';
import * as path from 'path';

async function globalTeardown(config: FullConfig) {
  console.log('🧹 Starting global test teardown...');

  // ===== 1. Clean up test database =====
  // await cleanupTestDatabase();

  // ===== 2. Stop mock servers =====
  // await stopMockServers();

  // ===== 3. Clean up temporary files =====
  // Keep auth files for next run, but clean temp files
  const tempDirs = [
    'test-results/temp',
    'screenshots/temp',
  ];

  for (const dir of tempDirs) {
    const fullPath = path.resolve(__dirname, dir);
    if (fs.existsSync(fullPath)) {
      fs.rmSync(fullPath, { recursive: true, force: true });
      console.log(`🗑️  Cleaned temp directory: ${dir}`);
    }
  }

  // ===== 4. Generate test run summary =====
  const runId = process.env.TEST_RUN_ID;
  const startTime = process.env.TEST_START_TIME;
  const endTime = new Date().toISOString();

  if (runId && startTime) {
    const duration = new Date(endTime).getTime() - new Date(startTime).getTime();
    console.log(`
╔══════════════════════════════════════════════╗
║           TEST RUN SUMMARY                   ║
╠══════════════════════════════════════════════╣
║  Run ID:     ${runId.padEnd(38)}║
║  Started:    ${startTime.padEnd(38)}║
║  Finished:   ${endTime.padEnd(38)}║
║  Duration:   ${(duration / 1000).toFixed(2)}s${' '.repeat(38 - (duration / 1000).toFixed(2).length)}║
╚══════════════════════════════════════════════╝
    `);
  }

  // ===== 5. Archive test artifacts (optional) =====
  // await archiveTestResults();

  console.log('✅ Global teardown completed');
}

export default globalTeardown;