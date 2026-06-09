import { describe, it, expect, vi, beforeEach } from 'vitest';
import {
  getItem,
  setItem,
  removeItem,
  getCart,
  saveCart,
  getAuthToken,
  saveAuthToken,
  clearAuth,
} from '../storage';

describe('storage service', () => {
  beforeEach(() => {
    localStorage.clear();
    vi.restoreAllMocks();
  });

  describe('getItem / setItem', () => {
    it('stores and retrieves JSON values', () => {
      setItem('key', { a: 1 });
      expect(getItem('key')).toEqual({ a: 1 });
    });

    it('returns null for missing key', () => {
      expect(getItem('missing')).toBeNull();
    });

    it('returns null on parse error', () => {
      localStorage.setItem('bad', 'not-json{');
      expect(getItem('bad')).toBeNull();
    });

    it('returns false when localStorage throws on set', () => {
      vi.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
        throw new Error('quota');
      });
      expect(setItem('key', 'val')).toBe(false);
    });
  });

  describe('removeItem', () => {
    it('removes an item', () => {
      setItem('key', 'val');
      expect(removeItem('key')).toBe(true);
      expect(getItem('key')).toBeNull();
    });
  });

  describe('getCart / saveCart', () => {
    it('returns empty array when no cart saved', () => {
      expect(getCart()).toEqual([]);
    });

    it('persists cart items', () => {
      const items = [{ id: '1', quantity: 2 }];
      saveCart(items);
      expect(getCart()).toEqual(items);
    });
  });

  describe('getAuthToken / saveAuthToken / clearAuth', () => {
    it('saves and retrieves auth token', () => {
      saveAuthToken('tok123');
      expect(getAuthToken()).toBe('tok123');
    });

    it('clears auth data', () => {
      saveAuthToken('tok123');
      setItem('user', { name: 'A' });
      clearAuth();
      expect(getAuthToken()).toBeNull();
      expect(getItem('user')).toBeNull();
    });
  });
});
