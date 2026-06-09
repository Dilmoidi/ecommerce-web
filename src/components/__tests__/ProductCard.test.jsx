import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '../ProductCard';

const inStockProduct = {
  id: '1',
  name: 'Blue Widget',
  price: 1999,
  stock: 10,
  imageUrl: '/widget.png',
  rating: 4,
};

const outOfStockProduct = {
  id: '2',
  name: 'Red Gadget',
  price: 2999,
  stock: 0,
  imageUrl: '',
  rating: 0,
};

describe('ProductCard', () => {
  it('renders product name and formatted price', () => {
    render(<ProductCard product={inStockProduct} />);
    expect(screen.getByText('Blue Widget')).toBeInTheDocument();
    expect(screen.getByText('$19.99')).toBeInTheDocument();
  });

  it('renders image when imageUrl is present', () => {
    render(<ProductCard product={inStockProduct} />);
    const img = screen.getByAltText('Blue Widget');
    expect(img).toHaveAttribute('src', '/widget.png');
  });

  it('does not render image when imageUrl is empty', () => {
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.queryByRole('img')).not.toBeInTheDocument();
  });

  it('shows stock status', () => {
    render(<ProductCard product={inStockProduct} />);
    expect(screen.getByTestId('stock-status')).toHaveTextContent('10 in stock');
  });

  it('shows out of stock message', () => {
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByTestId('stock-status')).toHaveTextContent('Out of stock');
  });

  it('renders star rating when > 0', () => {
    render(<ProductCard product={inStockProduct} />);
    expect(screen.getByTestId('product-rating')).toBeInTheDocument();
  });

  it('hides rating when 0', () => {
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.queryByTestId('product-rating')).not.toBeInTheDocument();
  });

  it('enables add-to-cart button when in stock', () => {
    render(<ProductCard product={inStockProduct} />);
    expect(screen.getByTestId('add-to-cart-btn')).not.toBeDisabled();
  });

  it('disables add-to-cart button when out of stock', () => {
    render(<ProductCard product={outOfStockProduct} />);
    expect(screen.getByTestId('add-to-cart-btn')).toBeDisabled();
  });

  it('calls onAddToCart when button clicked', () => {
    const handler = vi.fn();
    render(<ProductCard product={inStockProduct} onAddToCart={handler} />);
    fireEvent.click(screen.getByTestId('add-to-cart-btn'));
    expect(handler).toHaveBeenCalledWith(inStockProduct);
  });
});
