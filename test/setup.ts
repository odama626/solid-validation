import '@testing-library/jest-dom/vitest';
import { cleanup } from '@solidjs/testing-library';
import { afterEach, vi } from 'vitest';

// jsdom has no layout engine, so scrollIntoView is not implemented.
// useForm calls it every time it focuses a failing field.
Element.prototype.scrollIntoView = vi.fn();

afterEach(() => {
  cleanup();
  vi.restoreAllMocks();
  Element.prototype.scrollIntoView = vi.fn();
});
