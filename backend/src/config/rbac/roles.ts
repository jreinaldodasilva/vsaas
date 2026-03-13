// Generic roles for vsaas boilerplate.
// TODO: Replace or extend with domain-specific roles (e.g. dentist, instructor, journalist).

export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  // TODO: Add domain-specific roles here
} as const;

export type UserRole = typeof ROLES[keyof typeof ROLES];

export const ROLE_HIERARCHY: Record<UserRole, number> = {
  [ROLES.SUPER_ADMIN]: 100,
  [ROLES.ADMIN]: 80,
  [ROLES.MANAGER]: 60,
  [ROLES.STAFF]: 20,
};

export const hasRoleLevel = (userRole: UserRole, requiredRole: UserRole): boolean =>
  ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole];
