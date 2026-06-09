export function getItem(key) {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : null;
  } catch {
    return null;
  }
}

export function setItem(key, value) {
  try {
    localStorage.setItem(key, JSON.stringify(value));
    return true;
  } catch {
    return false;
  }
}

export function removeItem(key) {
  try {
    localStorage.removeItem(key);
    return true;
  } catch {
    return false;
  }
}

export function getCart() {
  return getItem('cart') || [];
}

export function saveCart(items) {
  return setItem('cart', items);
}

export function getAuthToken() {
  return getItem('authToken');
}

export function saveAuthToken(token) {
  return setItem('authToken', token);
}

export function clearAuth() {
  removeItem('authToken');
  removeItem('user');
}
