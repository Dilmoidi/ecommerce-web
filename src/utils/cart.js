export function calculateSubtotal(items) {
  if (!Array.isArray(items)) return 0;
  return items.reduce((sum, item) => {
    const price = Number(item.price) || 0;
    const quantity = Number(item.quantity) || 0;
    return sum + price * quantity;
  }, 0);
}

export function calculateTax(subtotal, taxRate = 0.08) {
  if (typeof subtotal !== 'number' || subtotal < 0) return 0;
  return Math.round(subtotal * taxRate);
}

export function calculateShipping(subtotal, method = 'standard') {
  if (typeof subtotal !== 'number' || subtotal < 0) return 0;
  if (subtotal === 0) return 0;
  if (subtotal >= 5000) return 0; // free shipping over $50

  const rates = { standard: 499, express: 999, overnight: 1999 };
  return rates[method] ?? rates.standard;
}

export function calculateTotal(items, taxRate = 0.08, shippingMethod = 'standard') {
  const subtotal = calculateSubtotal(items);
  const tax = calculateTax(subtotal, taxRate);
  const shipping = calculateShipping(subtotal, shippingMethod);
  return { subtotal, tax, shipping, total: subtotal + tax + shipping };
}

export function applyDiscount(subtotal, coupon) {
  if (typeof subtotal !== 'number' || subtotal <= 0 || !coupon) return subtotal;

  if (coupon.type === 'percentage') {
    const discount = Math.min(coupon.value, 100);
    return Math.round(subtotal * (1 - discount / 100));
  }
  if (coupon.type === 'fixed') {
    return Math.max(0, subtotal - (coupon.value || 0));
  }
  return subtotal;
}

export function updateCartItem(items, productId, quantity) {
  if (!Array.isArray(items)) return [];
  if (quantity <= 0) return items.filter((item) => item.id !== productId);

  const index = items.findIndex((item) => item.id === productId);
  if (index === -1) return items;

  const updated = [...items];
  updated[index] = { ...updated[index], quantity };
  return updated;
}

export function addToCart(items, product, quantity = 1) {
  if (!Array.isArray(items)) return [{ ...product, quantity }];
  const existing = items.find((item) => item.id === product.id);
  if (existing) {
    return updateCartItem(items, product.id, existing.quantity + quantity);
  }
  return [...items, { ...product, quantity }];
}

export function removeFromCart(items, productId) {
  if (!Array.isArray(items)) return [];
  return items.filter((item) => item.id !== productId);
}
