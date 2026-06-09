import { describe, it, expect } from 'vitest';
import { cartReducer } from '../CartContext';

const initialState = { items: [] };

const item1 = { id: '1', name: 'Shirt', price: 2000, quantity: 1 };
const item2 = { id: '2', name: 'Pants', price: 3500, quantity: 2 };

describe('cartReducer', () => {
  it('ADD_ITEM adds new item', () => {
    const state = cartReducer(initialState, { type: 'ADD_ITEM', payload: item1 });
    expect(state.items).toHaveLength(1);
    expect(state.items[0]).toMatchObject({ id: '1', quantity: 1 });
  });

  it('ADD_ITEM increments quantity for existing item', () => {
    const stateWith1 = { items: [{ ...item1 }] };
    const state = cartReducer(stateWith1, {
      type: 'ADD_ITEM',
      payload: { id: '1', quantity: 3 },
    });
    expect(state.items[0].quantity).toBe(4);
  });

  it('ADD_ITEM defaults quantity to 1', () => {
    const state = cartReducer(initialState, {
      type: 'ADD_ITEM',
      payload: { id: '5', name: 'Hat', price: 1000 },
    });
    expect(state.items[0].quantity).toBe(1);
  });

  it('REMOVE_ITEM removes item by id', () => {
    const stateWith2 = { items: [item1, item2] };
    const state = cartReducer(stateWith2, { type: 'REMOVE_ITEM', payload: '1' });
    expect(state.items).toHaveLength(1);
    expect(state.items[0].id).toBe('2');
  });

  it('UPDATE_QUANTITY updates item quantity', () => {
    const stateWith1 = { items: [{ ...item1 }] };
    const state = cartReducer(stateWith1, {
      type: 'UPDATE_QUANTITY',
      payload: { id: '1', quantity: 5 },
    });
    expect(state.items[0].quantity).toBe(5);
  });

  it('UPDATE_QUANTITY removes item when quantity <= 0', () => {
    const stateWith1 = { items: [{ ...item1 }] };
    const state = cartReducer(stateWith1, {
      type: 'UPDATE_QUANTITY',
      payload: { id: '1', quantity: 0 },
    });
    expect(state.items).toHaveLength(0);
  });

  it('CLEAR empties the cart', () => {
    const stateWith2 = { items: [item1, item2] };
    const state = cartReducer(stateWith2, { type: 'CLEAR' });
    expect(state.items).toEqual([]);
  });

  it('returns current state for unknown action', () => {
    const state = cartReducer(initialState, { type: 'UNKNOWN' });
    expect(state).toBe(initialState);
  });
});
