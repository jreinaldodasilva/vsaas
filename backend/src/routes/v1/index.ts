import { Router } from 'express';
import authRoutes from '../auth';
import healthRoutes from '../monitoring/health';
import { tenantRoutes } from '../../platform/tenants';
import stripeWebhookRoutes from '../webhooks/stripe';
import userRoutes from '../users/user.routes';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);
router.use('/tenants', tenantRoutes);
router.use('/webhooks/stripe', stripeWebhookRoutes);
router.use('/users', userRoutes);

// Register generated domain modules here:
//   import { exampleRoutes } from '../../modules/domain/example';
//   router.use('/example', exampleRoutes);

export default router;
