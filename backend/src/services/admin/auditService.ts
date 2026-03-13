import logger from '../../config/logger';
import { AuditLog } from '../../models/AuditLog';
import { Request } from 'express';

interface AuditLogData {
  user?: string;
  action: string;
  resource: string;
  resourceId?: string;
  method: string;
  path: string;
  ipAddress: string;
  userAgent?: string;
  statusCode?: number;
  changes?: { before?: any; after?: any };
  metadata?: Record<string, any>;
  tenant?: string; // TODO: Rename to match your tenant field
}

class AuditService {
  async log(data: AuditLogData): Promise<void> {
    try {
      await AuditLog.create(data);
    } catch (error) {
      logger.error({ error }, 'Failed to write audit log');
    }
  }

  async logFromRequest(req: Request & { user?: any }, action: string, resource: string, metadata?: Record<string, any>): Promise<void> {
    await this.log({
      user: req.user?.id,
      action,
      resource,
      method: req.method,
      path: req.path,
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('user-agent'),
      tenant: req.user?.tenantId,
      metadata,
    });
  }
}

export const auditService = new AuditService();
