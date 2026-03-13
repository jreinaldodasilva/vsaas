import { Router } from 'express';
import authRoutes from '../auth';
import healthRoutes from '../monitoring/health';
import { authenticate } from '../../middleware/auth/auth';

// TODO: Import and register domain-specific routes here
// import domainRoutes from '../domain';

const router: Router = Router();

router.use('/auth', authRoutes);
router.use('/health', healthRoutes);

// TODO: Add domain-specific routes below, e.g.:
// router.use('/patients', authenticate, domainRoutes);
// router.use('/appointments', authenticate, appointmentRoutes);

export default router;
