import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { CartSummary } from '../CartSummary';

const items = [
  { id: '1', name: 'Shirt', price: 2000, quantity: 2 },
  { id: '2', name: 'Pants', price: 3500, quantity: 1 },
];

describe('CartSummary', () => {
  it('shows empty cart message when no items', () => {
    render(<CartSummary items={[]} />);
    expect(screen.getByTestId('empty-cart')).toHaveTextContent('Your cart is empty');
  });

  it('shows empty cart message when items is null', () => {
    render(<CartSummary items={null} />);
    expect(screen.getByTestId('empty-cart')).toBeInTheDocument();
  });

  it('renders all cart items', () => {
    render(<CartSummary items={items} />);
    const cartItems = screen.getAllByTestId('cart-item');
    expect(cartItems).toHaveLength(2);
  });

  it('displays correct subtotal', () => {
    render(<CartSummary items={items} />);
    // subtotal = 2000*2 + 3500*1 = 7500 => $75.00
    expect(screen.getByTestId('subtotal')).toHaveTextContent('$75.00');
  });

  it('displays tax', () => {
    render(<CartSummary items={items} />);
    // tax = 7500 * 0.08 = 600 => $6.00
    expect(screen.getByTestId('tax')).toHaveTextContent('$6.00');
  });

  it('displays FREE shipping for large orders', () => {
    render(<CartSummary items={items} />);
    expect(screen.getByTestId('shipping')).toHaveTextContent('FREE');
  });

  it('displays shipping cost for small orders', () => {
    const smallItems = [{ id: '1', name: 'Pin', price: 100, quantity: 1 }];
    render(<CartSummary items={smallItems} />);
    expect(screen.getByTestId('shipping')).toHaveTextContent('$4.99');
  });

  it('displays total', () => {
    render(<CartSummary items={items} />);
    expect(screen.getByTestId('total')).toHaveTextContent('$81.00');
  });
});
