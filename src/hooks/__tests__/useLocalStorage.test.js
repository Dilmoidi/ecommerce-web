import { describe, it, expect, beforeEach } from 'vitest';
import { renderHook, act } from '@testing-library/react';
import { useLocalStorage } from '../useLocalStorage';

describe('useLocalStorage', () => {
  beforeEach(() => localStorage.clear());

  it('returns initial value when key is not set', () => {
    const { result } = renderHook(() => useLocalStorage('theme', 'light'));
    expect(result.current[0]).toBe('light');
  });

  it('reads existing value from localStorage', () => {
    localStorage.setItem('theme', JSON.stringify('dark'));
    const { result } = renderHook(() => useLocalStorage('theme', 'light'));
    expect(result.current[0]).toBe('dark');
  });

  it('persists value to localStorage on set', () => {
    const { result } = renderHook(() => useLocalStorage('count', 0));
    act(() => result.current[1](42));
    expect(result.current[0]).toBe(42);
    expect(JSON.parse(localStorage.getItem('count'))).toBe(42);
  });

  it('supports updater function', () => {
    const { result } = renderHook(() => useLocalStorage('count', 10));
    act(() => result.current[1]((prev) => prev + 5));
    expect(result.current[0]).toBe(15);
  });

  it('removes value from localStorage', () => {
    const { result } = renderHook(() => useLocalStorage('key', 'val'));
    act(() => result.current[1]('stored'));
    act(() => result.current[2]());
    expect(result.current[0]).toBe('val');
    expect(localStorage.getItem('key')).toBeNull();
  });
});
