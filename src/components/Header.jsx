import { formatPrice } from '../utils/formatters';

export function Header({ cartItemCount = 0, cartTotal = 0, user = null, onLogout }) {
  return (
    <header data-testid="header">
      <h1>E-Commerce Store</h1>
      <nav>
        <a href="/">Home</a>
        <a href="/products">Products</a>
      </nav>
      <div data-testid="cart-badge">
        Cart ({cartItemCount}) — {formatPrice(cartTotal)}
      </div>
      <div data-testid="user-area">
        {user ? (
          <>
            <span data-testid="user-name">Hello, {user.name}</span>
            <button onClick={onLogout} data-testid="logout-btn">
              Logout
            </button>
          </>
        ) : (
          <a href="/login" data-testid="login-link">Login</a>
        )}
      </div>
    </header>
  );
}
