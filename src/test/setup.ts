import { cleanup } from '@testing-library/react';
import { afterEach, vi, expect } from 'vitest';
import * as matchers from '@testing-library/jest-dom/matchers';

expect.extend(matchers as any);

// Automatyczne czyszczenie po każdym teście
afterEach(() => {
  cleanup();
});

// Mockowanie fetch API
global.fetch = vi.fn();

// Mockowanie localStorage
const localStorageMock = {
  getItem: vi.fn(),
  setItem: vi.fn(),
  clear: vi.fn(),
  removeItem: vi.fn(),
  key: vi.fn(),
  length: 0,
};

global.localStorage = localStorageMock;

// Mockowanie intersectionObserver
class MockIntersectionObserver implements IntersectionObserver {
  readonly root: Element | Document | null = null;
  readonly rootMargin: string = "";
  readonly thresholds: ReadonlyArray<number> = [];

  constructor(_callback: IntersectionObserverCallback) {}

  observe = vi.fn();
  unobserve = vi.fn();
  disconnect = vi.fn();
  takeRecords(): IntersectionObserverEntry[] {
    return [];
  }
}

global.IntersectionObserver = MockIntersectionObserver;
