import { describe, it, expect } from 'vitest';
import { createUser, isAdmin, hasPermission, formatUserDisplayName } from '../User';

describe('createUser', () => {
  it('creates user with defaults', () => {
    const u = createUser({ id: '1', name: 'Alice', email: 'Alice@Test.COM' });
    expect(u.name).toBe('Alice');
    expect(u.email).toBe('alice@test.com');
    expect(u.role).toBe('customer');
  });

  it('trims and lowercases email', () => {
    const u = createUser({ id: '1', name: 'B', email: '  BOB@Test.com  ' });
    expect(u.email).toBe('bob@test.com');
  });
});

describe('isAdmin', () => {
  it('returns true for admin role', () => {
    expect(isAdmin({ role: 'admin' })).toBe(true);
  });

  it('returns false for non-admin roles', () => {
    expect(isAdmin({ role: 'customer' })).toBe(false);
    expect(isAdmin(null)).toBe(false);
  });
});

describe('hasPermission', () => {
  it('admin has all permissions', () => {
    const admin = { role: 'admin' };
    expect(hasPermission(admin, 'read')).toBe(true);
    expect(hasPermission(admin, 'write')).toBe(true);
    expect(hasPermission(admin, 'delete')).toBe(true);
    expect(hasPermission(admin, 'manage_users')).toBe(true);
  });

  it('customer can only read', () => {
    const customer = { role: 'customer' };
    expect(hasPermission(customer, 'read')).toBe(true);
    expect(hasPermission(customer, 'write')).toBe(false);
    expect(hasPermission(customer, 'delete')).toBe(false);
  });

  it('seller can read, write, manage products', () => {
    const seller = { role: 'seller' };
    expect(hasPermission(seller, 'read')).toBe(true);
    expect(hasPermission(seller, 'write')).toBe(true);
    expect(hasPermission(seller, 'manage_products')).toBe(true);
    expect(hasPermission(seller, 'manage_users')).toBe(false);
  });

  it('returns false for unknown role', () => {
    expect(hasPermission({ role: 'guest' }, 'read')).toBe(false);
    expect(hasPermission(null, 'read')).toBe(false);
  });
});

describe('formatUserDisplayName', () => {
  it('returns name when available', () => {
    expect(formatUserDisplayName({ name: 'Alice', email: 'a@b.com' })).toBe('Alice');
  });

  it('falls back to email prefix', () => {
    expect(formatUserDisplayName({ email: 'bob@test.com' })).toBe('bob');
  });

  it('returns Guest for null user', () => {
    expect(formatUserDisplayName(null)).toBe('Guest');
  });

  it('returns User when no name or email', () => {
    expect(formatUserDisplayName({})).toBe('User');
  });
});
