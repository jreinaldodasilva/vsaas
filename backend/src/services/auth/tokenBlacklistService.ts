import logger from '../../config/logger';
import Redis from 'ioredis';
import { env } from '../../config/env';

class TokenBlacklistService {
  private redis: Redis | null = null;
  private isConnected = false;
  private inMemoryBlacklist: Set<string> = new Set();

  constructor() {
    if (env.redis.url) {
      this.initializeRedis();
    } else if (env.nodeEnv === 'production') {
      throw new Error('REDIS_URL is required in production');
    } else {
      logger.warn('⚠️  REDIS_URL not set, using in-memory token blacklist (not suitable for production)');
    }
  }

  private async initializeRedis(): Promise<void> {
    try {
      this.redis = new Redis(env.redis.url!, {
        retryStrategy: (times) => (times > 3 ? null : Math.min(times * 100, 3000)),
        lazyConnect: true,
      });
      this.redis.on('error', (err) => { logger.error({ error: err.message }, 'Redis error'); this.isConnected = false; });
      this.redis.on('connect', () => { this.isConnected = true; });
      await this.redis.connect();
    } catch {
      logger.warn('Redis connection failed, using in-memory blacklist');
    }
  }

  async addToBlacklist(token: string, expiresAt: Date): Promise<void> {
    if (this.isConnected && this.redis) {
      const ttl = Math.floor((expiresAt.getTime() - Date.now()) / 1000);
      if (ttl > 0) await this.redis.setex(`blacklist:${token}`, ttl, '1');
      return;
    }
    if (env.nodeEnv === 'production') throw new Error('Redis unavailable — cannot blacklist token in production');
    this.inMemoryBlacklist.add(token);
    setTimeout(() => this.inMemoryBlacklist.delete(token), expiresAt.getTime() - Date.now());
  }

  async isBlacklisted(token: string): Promise<boolean> {
    if (this.isConnected && this.redis) {
      try {
        return (await this.redis.get(`blacklist:${token}`)) === '1';
      } catch {
        if (env.nodeEnv === 'production') return true;
      }
    }
    if (env.nodeEnv === 'production') return true;
    return this.inMemoryBlacklist.has(token);
  }
}

export const tokenBlacklistService = new TokenBlacklistService();
