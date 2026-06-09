import { useState } from 'react';

export function SearchBar({ onSearch, placeholder = 'Search products...' }) {
  const [query, setQuery] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSearch?.(query.trim());
  };

  const handleClear = () => {
    setQuery('');
    onSearch?.('');
  };

  return (
    <form onSubmit={handleSubmit} data-testid="search-form" role="search">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder={placeholder}
        aria-label="Search"
        data-testid="search-input"
      />
      <button type="submit" data-testid="search-btn">Search</button>
      {query && (
        <button type="button" onClick={handleClear} data-testid="clear-btn">
          Clear
        </button>
      )}
    </form>
  );
}
