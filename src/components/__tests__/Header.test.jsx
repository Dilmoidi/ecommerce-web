import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { Header } from '../Header';

describe('Header', () => {
  it('renders store name', () => {
    render(<Header />);
    expect(screen.getByText('E-Commerce Store')).toBeInTheDocument();
  });

  it('displays cart badge with count and total', () => {
    render(<Header cartItemCount={3} cartTotal={4500} />);
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('Cart (3) — $45.00');
  });

  it('displays defaults when no props', () => {
    render(<Header />);
    expect(screen.getByTestId('cart-badge')).toHaveTextContent('Cart (0) — $0.00');
  });

  it('shows login link when no user', () => {
    render(<Header />);
    expect(screen.getByTestId('login-link')).toBeInTheDocument();
    expect(screen.queryByTestId('user-name')).not.toBeInTheDocument();
  });

  it('shows user name and logout when logged in', () => {
    const user = { name: 'Alice' };
    render(<Header user={user} onLogout={vi.fn()} />);
    expect(screen.getByTestId('user-name')).toHaveTextContent('Hello, Alice');
    expect(screen.getByTestId('logout-btn')).toBeInTheDocument();
    expect(screen.queryByTestId('login-link')).not.toBeInTheDocument();
  });

  it('calls onLogout when logout clicked', () => {
    const handler = vi.fn();
    render(<Header user={{ name: 'Bob' }} onLogout={handler} />);
    fireEvent.click(screen.getByTestId('logout-btn'));
    expect(handler).toHaveBeenCalled();
  });
});
