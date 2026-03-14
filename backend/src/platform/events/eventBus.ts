import logger from '../../config/logger';
import crypto from 'crypto';

export interface DomainEvent {
  id: string;
  type: string;
  timestamp: Date;
  tenantId?: string;
  userId?: string;
  payload: Record<string, any>;
  metadata?: Record<string, any>;
}

type EventHandler = (event: DomainEvent) => Promise<void>;

class EventBus {
  private handlers = new Map<string, EventHandler[]>();

  async emit(type: string, payload: Record<string, any>, metadata?: Record<string, any>): Promise<void> {
    const event: DomainEvent = {
      id: crypto.randomUUID(),
      type,
      timestamp: new Date(),
      tenantId: metadata?.tenantId,
      userId: metadata?.userId,
      payload,
      metadata,
    };

    logger.debug({ eventType: type, eventId: event.id }, 'Event emitted');

    const handlers = [
      ...(this.handlers.get(type) || []),
      ...(this.handlers.get('*') || []),
    ];

    await Promise.allSettled(
      handlers.map(async (handler) => {
        try {
          await handler(event);
        } catch (error) {
          logger.error({ eventType: type, eventId: event.id, error }, 'Event handler failed');
        }
      })
    );
  }

  on(type: string, handler: EventHandler): void {
    const existing = this.handlers.get(type) || [];
    this.handlers.set(type, [...existing, handler]);
  }

  off(type: string, handler: EventHandler): void {
    const existing = this.handlers.get(type) || [];
    this.handlers.set(type, existing.filter((h) => h !== handler));
  }

  removeAll(type?: string): void {
    if (type) {
      this.handlers.delete(type);
    } else {
      this.handlers.clear();
    }
  }

  listenerCount(type: string): number {
    return (this.handlers.get(type) || []).length;
  }
}

// Singleton
export const eventBus = new EventBus();
export { EventBus };
