import { describe, it, expect } from 'vitest';
import {
  createOrder,
  isValidStatus,
  canTransition,
  getOrderTotal,
  getOrderSummary,
} from '../Order';

describe('createOrder', () => {
  it('creates order with defaults', () => {
    const order = createOrder({
      id: 'o1',
      userId: 'u1',
      items: [{ id: '1', price: 2000, quantity: 2 }],
      shippingAddress: { city: 'NYC' },
    });
    expect(order.id).toBe('o1');
    expect(order.status).toBe('pending');
    expect(order.items).toHaveLength(1);
    expect(order.createdAt).toBeDefined();
  });

  it('defaults items to empty array', () => {
    const order = createOrder({ id: 'o1', userId: 'u1' });
    expect(order.items).toEqual([]);
  });
});

describe('isValidStatus', () => {
  it('accepts valid statuses', () => {
    expect(isValidStatus('pending')).toBe(true);
    expect(isValidStatus('confirmed')).toBe(true);
    expect(isValidStatus('shipped')).toBe(true);
    expect(isValidStatus('delivered')).toBe(true);
    expect(isValidStatus('cancelled')).toBe(true);
  });

  it('rejects invalid statuses', () => {
    expect(isValidStatus('processing')).toBe(false);
    expect(isValidStatus('')).toBe(false);
  });
});

describe('canTransition', () => {
  it('allows pending -> confirmed', () => {
    expect(canTransition('pending', 'confirmed')).toBe(true);
  });

  it('allows pending -> cancelled', () => {
    expect(canTransition('pending', 'cancelled')).toBe(true);
  });

  it('allows confirmed -> shipped', () => {
    expect(canTransition('confirmed', 'shipped')).toBe(true);
  });

  it('blocks delivered -> anything', () => {
    expect(canTransition('delivered', 'cancelled')).toBe(false);
    expect(canTransition('delivered', 'shipped')).toBe(false);
  });

  it('blocks cancelled -> anything', () => {
    expect(canTransition('cancelled', 'pending')).toBe(false);
  });

  it('blocks skipping states', () => {
    expect(canTransition('pending', 'shipped')).toBe(false);
    expect(canTransition('pending', 'delivered')).toBe(false);
  });
});

describe('getOrderTotal', () => {
  it('sums price * quantity', () => {
    const order = {
      items: [
        { price: 1000, quantity: 2 },
        { price: 500, quantity: 3 },
      ],
    };
    expect(getOrderTotal(order)).toBe(3500);
  });

  it('returns 0 for missing items', () => {
    expect(getOrderTotal({})).toBe(0);
    expect(getOrderTotal(null)).toBe(0);
  });
});

describe('getOrderSummary', () => {
  it('returns summary object', () => {
    const order = {
      id: 'o1',
      status: 'confirmed',
      items: [
        { price: 1000, quantity: 2 },
        { price: 500, quantity: 1 },
      ],
    };
    const summary = getOrderSummary(order);
    expect(summary.id).toBe('o1');
    expect(summary.status).toBe('confirmed');
    expect(summary.itemCount).toBe(3);
    expect(summary.total).toBe(2500);
  });

  it('returns null for null order', () => {
    expect(getOrderSummary(null)).toBeNull();
  });
});
