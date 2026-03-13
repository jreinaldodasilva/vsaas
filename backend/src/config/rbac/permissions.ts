// Generic permissions for vsaas boilerplate.
// TODO: Replace resource names (e.g. RECORDS, APPOINTMENTS) with your domain entities.

export const PERMISSIONS = {
  // Users
  USERS_READ: 'users:read',
  USERS_WRITE: 'users:write',
  USERS_DELETE: 'users:delete',

  // Settings
  SETTINGS_READ: 'settings:read',
  SETTINGS_WRITE: 'settings:write',

  // Audit
  AUDIT_READ: 'audit:read',

  // Reports
  REPORTS_READ: 'reports:read',
  REPORTS_WRITE: 'reports:write',

  // TODO: Add domain-specific permissions here
  // Example:
  // RECORDS_READ: 'records:read',
  // RECORDS_WRITE: 'records:write',
  // APPOINTMENTS_READ: 'appointments:read',
  // APPOINTMENTS_WRITE: 'appointments:write',
} as const;

export type Permission = typeof PERMISSIONS[keyof typeof PERMISSIONS];
