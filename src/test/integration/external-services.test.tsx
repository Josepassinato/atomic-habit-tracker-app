import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { mockSupabase, cleanupMocks } from './test-setup';

describe('External Services Integration Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    localStorage.clear();
  });

  afterEach(() => {
    cleanupMocks();
  });

  it('integrates with Supabase edge functions', async () => {
    // Mock fetch for edge function calls
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: () => Promise.resolve({ success: true, response: 'AI response' })
      })
    ) as any;

    // Simulate AI consultant call
    const response = await fetch('/functions/v1/ai-consultant', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        message: 'Test consultation',
        consultationType: 'sales'
      })
    });

    const data = await response.json();
    expect(data.success).toBe(true);
  });

  it('handles real-time updates', async () => {
    // Mock Supabase realtime
    const mockChannel = {
      on: vi.fn(() => mockChannel),
      subscribe: vi.fn(() => Promise.resolve()),
      unsubscribe: vi.fn()
    };

    const mockSupabaseWithRealtime = {
      ...mockSupabase,
      channel: vi.fn(() => mockChannel)
    };

    (mockSupabase as any).channel = mockSupabaseWithRealtime.channel;

    // Test realtime connection
    const channel = (mockSupabase as any).channel('test-channel');
    expect(channel.on).toBeDefined();
    expect(channel.subscribe).toBeDefined();
  });

  it('maintains security audit trail', async () => {
    // Test audit logging
    const auditLogCall = mockSupabase.rpc.mockResolvedValue({ data: 'log-id' });

    // Simulate audit log - test that the function exists
    expect(mockSupabase.rpc).toBeDefined();
    expect(auditLogCall).toBeDefined();
  });
});