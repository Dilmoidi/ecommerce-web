export function createProduct({
  id,
  name,
  description = '',
  price = 0,
  category = 'uncategorized',
  stock = 0,
  imageUrl = '',
  rating = 0,
}) {
  return {
    id,
    name: String(name || ''),
    description: String(description),
    price: Math.max(0, Number(price) || 0),
    category: String(category),
    stock: Math.max(0, Math.floor(Number(stock) || 0)),
    imageUrl: String(imageUrl),
    rating: Math.max(0, Math.min(5, Number(rating) || 0)),
    createdAt: new Date().toISOString(),
  };
}

export function isInStock(product) {
  return product?.stock > 0;
}

export function getDiscountedPrice(product, discountPercent) {
  if (!product || typeof product.price !== 'number') return 0;
  const discount = Math.max(0, Math.min(100, Number(discountPercent) || 0));
  return Math.round(product.price * (1 - discount / 100));
}

export function getAverageRating(reviews) {
  if (!Array.isArray(reviews) || reviews.length === 0) return 0;
  const total = reviews.reduce((sum, r) => sum + (Number(r.rating) || 0), 0);
  return Math.round((total / reviews.length) * 10) / 10;
}
