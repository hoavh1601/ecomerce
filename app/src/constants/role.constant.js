const ROLES = {
  ADMIN: "ADMIN",
  SELLER: "SELLER",
  BUYER: "BUYER",
};

const PERMISSIONS = {
  [ROLES.ADMIN]: [
    "manage_users",
    "view_all_products",
    "delete_products",
    "view_statistics",
  ],
  [ROLES.SELLER]: ["manage_own_products", "manage_orders"],
  [ROLES.BUYER]: ["view_products", "create_orders", "view_own_orders"],
};

module.exports = {
  ROLES,
  PERMISSIONS,
};
