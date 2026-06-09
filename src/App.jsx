import { CartProvider } from './context/CartContext';
import { Header } from './components/Header';

export function App() {
  return (
    <CartProvider>
      <Header />
      <main>
        <h2>Welcome to E-Commerce Store</h2>
        <p>Browse our products and enjoy shopping!</p>
      </main>
    </CartProvider>
  );
}
