import { Model, Document, FilterQuery, UpdateQuery } from 'mongoose';
import { NotFoundError } from '../../utils/errors';

export interface QueryOptions {
  page?: number;
  limit?: number;
  sort?: Record<string, 1 | -1>;
  tenantId?: string;
  // TODO: Add domain-specific filter fields
}

export abstract class BaseService<T extends Document> {
  constructor(protected readonly model: Model<T>) {}

  protected tenantFilter(tenantId?: string): FilterQuery<T> {
    // TODO: Replace 'tenant' with your tenant field name (e.g. 'clinic', 'department')
    return tenantId ? ({ tenant: tenantId } as FilterQuery<T>) : ({} as FilterQuery<T>);
  }

  async findById(id: string, tenantId?: string): Promise<T> {
    const doc = await this.model.findOne({
      _id: id,
      ...this.tenantFilter(tenantId),
    } as FilterQuery<T>);
    if (!doc) throw new NotFoundError(this.model.modelName);
    return doc;
  }

  async findAll(options: QueryOptions = {}) {
    const { page = 1, limit = 10, sort = { createdAt: -1 }, tenantId } = options;
    const filter = this.tenantFilter(tenantId);
    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit),
      this.model.countDocuments(filter),
    ]);
    return { items, total, page, limit, totalPages: Math.ceil(total / limit) };
  }

  async create(data: Partial<T>): Promise<T> {
    return this.model.create(data);
  }

  async updateById(id: string, data: UpdateQuery<T>, tenantId?: string): Promise<T> {
    const doc = await this.model.findOneAndUpdate(
      { _id: id, ...this.tenantFilter(tenantId) } as FilterQuery<T>,
      data,
      { new: true, runValidators: true }
    );
    if (!doc) throw new NotFoundError(this.model.modelName);
    return doc;
  }

  async deleteById(id: string, tenantId?: string): Promise<void> {
    const result = await this.model.findOneAndDelete({
      _id: id,
      ...this.tenantFilter(tenantId),
    } as FilterQuery<T>);
    if (!result) throw new NotFoundError(this.model.modelName);
  }

  async softDeleteById(id: string, tenantId?: string): Promise<T> {
    return this.updateById(id, { isDeleted: true, deletedAt: new Date() } as UpdateQuery<T>, tenantId);
  }
}
