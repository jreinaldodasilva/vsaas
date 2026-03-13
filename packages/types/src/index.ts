// @vsaas/types — Generic shared types for vertical SaaS boilerplate
// Replace domain-specific types (e.g. Patient, Provider) with your own entities.

export type ApiResult<T = any> = {
  success: boolean;
  data?: T;
  message?: string;
  error?: { code?: string; message: string; details?: any };
};

export type Pagination = {
  page?: number;
  limit?: number;
  total: number;
  pages?: number;
};

export type PaginatedData<T> = {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
  hasNext: boolean;
  hasPrev: boolean;
};

export type User = {
  id?: string;
  _id?: string;
  name: string;
  email: string;
  role: string;
  tenantId?: string; // Replace with your tenant field (e.g. clinicId, departmentId)
  isActive?: boolean;
  lastLogin?: string | Date;
  mfaEnabled?: boolean;
  phone?: string;
  phoneVerified?: boolean;
  emailVerified?: boolean;
  passwordChangedAt?: Date;
  passwordExpiresAt?: Date;
  forcePasswordChange?: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
  [key: string]: any;
};

export type LoginRequest = {
  email: string;
  password: string;
};

export type LoginResponse = {
  user: User;
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type RegisterRequest = {
  name: string;
  email: string;
  password: string;
  // Add tenant registration data here (e.g. clinic, department)
  tenant?: Record<string, any>;
};

export type RefreshTokenRequest = { refreshToken: string };
export type RefreshTokenResponse = {
  accessToken: string;
  refreshToken: string;
  expiresIn: string;
};

export type AuditLog = {
  id?: string;
  _id?: string;
  user?: string | User;
  action: 'login' | 'logout' | 'create' | 'read' | 'update' | 'delete' | 'failed_login' | 'authz_failure' | 'password_change' | 'mfa_setup' | 'mfa_disable' | 'export' | 'import';
  resource: string;
  resourceId?: string;
  method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';
  path: string;
  ipAddress: string;
  userAgent?: string;
  statusCode?: number;
  changes?: { before?: any; after?: any };
  metadata?: Record<string, any>;
  tenantId?: string;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type Session = {
  id?: string;
  _id?: string;
  user: string | User;
  refreshToken?: string;
  deviceInfo: { userAgent: string; browser?: string; os?: string; device?: string };
  ipAddress: string;
  lastActivity: string | Date;
  expiresAt: string | Date;
  isActive: boolean;
  createdAt?: string | Date;
  updatedAt?: string | Date;
};

export type HealthStatus = {
  timestamp: string;
  uptime: number;
  status: 'healthy' | 'degraded';
  checks: {
    database: { status: string; responseTime?: number };
    redis: { status: string; responseTime?: number };
  };
};

// ─── Status enums ────────────────────────────────────────────────────────────

export const UserRole = {
  SUPER_ADMIN: 'super_admin',
  ADMIN: 'admin',
  MANAGER: 'manager',
  STAFF: 'staff',
  // TODO: Add domain-specific roles here
} as const;

export type UserRoleType = typeof UserRole[keyof typeof UserRole];

// ─── Utility types ───────────────────────────────────────────────────────────

export type ID = string;
export type DateString = string;

// ─── TODO: Add domain-specific types below ───────────────────────────────────
// Example:
// export type Patient = { ... };
// export type Appointment = { ... };
