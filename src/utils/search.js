export function filterProducts(products, filters = {}) {
  if (!Array.isArray(products)) return [];

  return products.filter((product) => {
    if (filters.category && product.category !== filters.category) return false;
    if (filters.minPrice != null && product.price < filters.minPrice) return false;
    if (filters.maxPrice != null && product.price > filters.maxPrice) return false;
    if (filters.inStock && product.stock <= 0) return false;
    if (filters.query) {
      const q = filters.query.toLowerCase();
      const nameMatch = product.name?.toLowerCase().includes(q);
      const descMatch = product.description?.toLowerCase().includes(q);
      if (!nameMatch && !descMatch) return false;
    }
    return true;
  });
}

export function sortProducts(products, sortBy = 'name', order = 'asc') {
  if (!Array.isArray(products)) return [];

  const sorted = [...products].sort((a, b) => {
    let valA = a[sortBy];
    let valB = b[sortBy];
    if (typeof valA === 'string') valA = valA.toLowerCase();
    if (typeof valB === 'string') valB = valB.toLowerCase();

    if (valA < valB) return -1;
    if (valA > valB) return 1;
    return 0;
  });

  return order === 'desc' ? sorted.reverse() : sorted;
}

export function paginateProducts(products, page = 1, perPage = 12) {
  if (!Array.isArray(products)) return { items: [], totalPages: 0, currentPage: 1 };
  const totalPages = Math.max(1, Math.ceil(products.length / perPage));
  const currentPage = Math.max(1, Math.min(page, totalPages));
  const start = (currentPage - 1) * perPage;
  return {
    items: products.slice(start, start + perPage),
    totalPages,
    currentPage,
  };
}
