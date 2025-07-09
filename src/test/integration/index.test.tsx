import { describe, beforeEach } from 'vitest';
import { setupMocks } from './test-setup';

// Import all test suites
import './auth.test';
import './app-core.test';
import './features.test';
import './external-services.test';

describe('Complete Integration Test Suite', () => {
  beforeEach(() => {
    setupMocks();
  });
});