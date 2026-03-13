// Tenant-scoped mixin — isolates data per tenant (clinic, department, organization, etc.)
// TODO: Rename 'tenant' and 'Tenant' to match your domain (e.g. 'clinic'/'Clinic', 'department'/'Department').
import { Schema, SchemaDefinition } from 'mongoose';

export const tenantScopedFields: SchemaDefinition = {
  tenant: {
    type: Schema.Types.ObjectId,
    ref: 'Tenant', // TODO: Replace with your tenant model name
    required: true,
    index: true,
  },
};
