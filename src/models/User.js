export function createUser({ id, name, email, role = 'customer' }) {
  return {
    id,
    name: String(name || ''),
    email: String(email || '').toLowerCase().trim(),
    role,
    createdAt: new Date().toISOString(),
  };
}

export function isAdmin(user) {
  return user?.role === 'admin';
}

export function hasPermission(user, permission) {
  const rolePermissions = {
    admin: ['read', 'write', 'delete', 'manage_users', 'manage_products'],
    seller: ['read', 'write', 'manage_products'],
    customer: ['read'],
  };
  const perms = rolePermissions[user?.role] || [];
  return perms.includes(permission);
}

export function formatUserDisplayName(user) {
  if (!user) return 'Guest';
  if (user.name) return user.name;
  if (user.email) return user.email.split('@')[0];
  return 'User';
}
