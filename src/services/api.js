const BASE_URL = '/api';

async function request(endpoint, options = {}) {
  const url = `${BASE_URL}${endpoint}`;
  const config = {
    headers: { 'Content-Type': 'application/json', ...options.headers },
    ...options,
  };

  const response = await fetch(url, config);
  if (!response.ok) {
    const error = new Error(`API error: ${response.status}`);
    error.status = response.status;
    throw error;
  }
  return response.json();
}

export function getProducts(params = {}) {
  const query = new URLSearchParams(params).toString();
  return request(`/products${query ? `?${query}` : ''}`);
}

export function getProductById(id) {
  return request(`/products/${id}`);
}

export function createProduct(product) {
  return request('/products', { method: 'POST', body: JSON.stringify(product) });
}

export function login(email, password) {
  return request('/auth/login', {
    method: 'POST',
    body: JSON.stringify({ email, password }),
  });
}

export function register(userData) {
  return request('/auth/register', {
    method: 'POST',
    body: JSON.stringify(userData),
  });
}

export function placeOrder(orderData) {
  return request('/orders', { method: 'POST', body: JSON.stringify(orderData) });
}

export function getOrders() {
  return request('/orders');
}
