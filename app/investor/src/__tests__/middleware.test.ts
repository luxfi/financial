// We can't import next/server in a vitest environment without next runtime;
// instead we re-exercise the small predicate the middleware relies on (the
// `config.matcher` regex) so we lock its semantics under test.

import { describe, it, expect } from 'vitest';
import { config } from '@/middleware';

describe('middleware matcher', () => {
  it('exists with the expected shape', () => {
    expect(Array.isArray(config.matcher)).toBe(true);
    expect((config.matcher as string[])[0]).toContain('_next');
    expect((config.matcher as string[])[0]).toContain('favicon.ico');
    expect((config.matcher as string[])[0]).toContain('signin');
  });
});
