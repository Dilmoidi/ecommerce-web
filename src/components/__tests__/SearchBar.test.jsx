import { describe, it, expect, vi } from 'vitest';
import { render, screen, fireEvent } from '@testing-library/react';
import { SearchBar } from '../SearchBar';

describe('SearchBar', () => {
  it('renders with placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.getByPlaceholderText('Search products...')).toBeInTheDocument();
  });

  it('accepts custom placeholder', () => {
    render(<SearchBar onSearch={vi.fn()} placeholder="Find items" />);
    expect(screen.getByPlaceholderText('Find items')).toBeInTheDocument();
  });

  it('calls onSearch on form submit', () => {
    const handler = vi.fn();
    render(<SearchBar onSearch={handler} />);
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'laptop' },
    });
    fireEvent.submit(screen.getByTestId('search-form'));
    expect(handler).toHaveBeenCalledWith('laptop');
  });

  it('trims whitespace from query', () => {
    const handler = vi.fn();
    render(<SearchBar onSearch={handler} />);
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: '  shoes  ' },
    });
    fireEvent.submit(screen.getByTestId('search-form'));
    expect(handler).toHaveBeenCalledWith('shoes');
  });

  it('shows clear button when query is not empty', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'test' },
    });
    expect(screen.getByTestId('clear-btn')).toBeInTheDocument();
  });

  it('hides clear button when query is empty', () => {
    render(<SearchBar onSearch={vi.fn()} />);
    expect(screen.queryByTestId('clear-btn')).not.toBeInTheDocument();
  });

  it('clears query and calls onSearch with empty string', () => {
    const handler = vi.fn();
    render(<SearchBar onSearch={handler} />);
    fireEvent.change(screen.getByTestId('search-input'), {
      target: { value: 'test' },
    });
    fireEvent.click(screen.getByTestId('clear-btn'));
    expect(handler).toHaveBeenCalledWith('');
    expect(screen.getByTestId('search-input').value).toBe('');
  });
});
