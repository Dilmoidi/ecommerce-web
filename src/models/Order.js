const VALID_STATUSES = ['pending', 'confirmed', 'shipped', 'delivered', 'cancelled'];
const ALLOWED_TRANSITIONS = {
  pending: ['confirmed', 'cancelled'],
  confirmed: ['shipped', 'cancelled'],
  shipped: ['delivered'],
  delivered: [],
  cancelled: [],
};

export function createOrder({ id, userId, items, shippingAddress, status = 'pending' }) {
  return {
    id,
    userId,
    items: Array.isArray(items) ? items : [],
    shippingAddress: shippingAddress || {},
    status,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };
}

export function isValidStatus(status) {
  return VALID_STATUSES.includes(status);
}

export function canTransition(fromStatus, toStatus) {
  const allowed = ALLOWED_TRANSITIONS[fromStatus];
  return Array.isArray(allowed) && allowed.includes(toStatus);
}

export function getOrderTotal(order) {
  if (!order?.items || !Array.isArray(order.items)) return 0;
  return order.items.reduce((sum, item) => {
    return sum + (Number(item.price) || 0) * (Number(item.quantity) || 0);
  }, 0);
}

export function getOrderSummary(order) {
  if (!order) return null;
  const itemCount = (order.items || []).reduce((sum, i) => sum + (i.quantity || 0), 0);
  return {
    id: order.id,
    status: order.status,
    itemCount,
    total: getOrderTotal(order),
  };
}
