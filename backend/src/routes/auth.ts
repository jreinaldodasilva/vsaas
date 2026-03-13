import express, { Request, Response, NextFunction } from 'express';
import { authService } from '../services/auth';
import { authenticate, AuthenticatedRequest } from '../middleware/auth/auth';
import { maskEmail } from '../utils/masking';
import { auditService } from '../services/admin/auditService';
import { UnauthorizedError } from '../utils/errors';
import {
  loginValidation,
  changePasswordValidation,
  forgotPasswordValidation,
  resetPasswordValidation,
} from './validations/authValidation';
import { validateRequest } from '../middleware/validate';

const router = express.Router();

// TODO: Update cookie names to match your app (e.g. 'vsaas_access_token')
const ACCESS_COOKIE = 'vsaas_access_token';
const REFRESH_COOKIE = 'refreshToken';

const cookieOpts = (maxAge: number) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict' as const,
  maxAge,
});

router.post('/login', loginValidation, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    const deviceInfo = {
      userAgent: req.headers['user-agent'],
      ipAddress: req.ip,
      deviceId: req.headers['x-device-id'] as string,
    };
    const result = await authService.login(req.body, deviceInfo);
    const { accessToken, refreshToken, expiresIn, user } = result.data;

    res.cookie(ACCESS_COOKIE, accessToken, cookieOpts(15 * 60 * 1000));
    res.cookie(REFRESH_COOKIE, refreshToken, cookieOpts(7 * 24 * 60 * 60 * 1000));

    auditService.log({
      user: user.id,
      action: 'login',
      resource: 'auth',
      method: 'POST',
      path: req.path,
      ipAddress: req.ip || 'unknown',
      userAgent: req.get('user-agent'),
    }).catch(() => {});

    return res.json({ success: true, data: { user, expiresIn } });
  } catch (error) {
    if (error instanceof UnauthorizedError) {
      auditService.log({
        action: 'failed_login',
        resource: 'auth',
        method: 'POST',
        path: req.path,
        ipAddress: req.ip || 'unknown',
        metadata: { email: maskEmail(req.body?.email) },
      }).catch(() => {});
    }
    next(error);
  }
});

router.get('/me', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  try {
    if (!authReq.user?.id) return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    const user = await authService.getUserById(authReq.user.id);
    return res.json({ success: true, data: user });
  } catch (error) { next(error); }
});

router.post('/refresh', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const refreshToken = req.cookies?.[REFRESH_COOKIE] || req.body.refreshToken;
    if (!refreshToken) return res.status(401).json({ success: false, message: 'Token de atualização obrigatório' });

    const { accessToken, refreshToken: newRefresh, expiresIn } = await authService.refreshAccessToken(refreshToken);
    res.cookie(ACCESS_COOKIE, accessToken, cookieOpts(15 * 60 * 1000));
    res.cookie(REFRESH_COOKIE, newRefresh, cookieOpts(7 * 24 * 60 * 60 * 1000));
    return res.json({ success: true, data: { expiresIn } });
  } catch (error) { next(error); }
});

router.post('/logout', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  try {
    const refreshToken = authReq.cookies?.[REFRESH_COOKIE] || authReq.body.refreshToken;
    if (refreshToken) await authService.logout(refreshToken);
    res.clearCookie(ACCESS_COOKIE, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    res.clearCookie(REFRESH_COOKIE, { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'strict' });
    return res.json({ success: true, message: 'Logout realizado com sucesso' });
  } catch (error) { next(error); }
});

router.post('/logout-all', authenticate, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  try {
    if (!authReq.user?.id) return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    await authService.logoutAllDevices(authReq.user.id);
    return res.json({ success: true, message: 'Logout realizado em todos os dispositivos' });
  } catch (error) { next(error); }
});

router.patch('/change-password', authenticate, changePasswordValidation, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  const authReq = req as AuthenticatedRequest;
  try {
    if (!authReq.user?.id) return res.status(401).json({ success: false, message: 'Usuário não autenticado' });
    await authService.changePassword(authReq.user.id, req.body.currentPassword, req.body.newPassword);
    return res.json({ success: true, message: 'Senha alterada com sucesso' });
  } catch (error) { next(error); }
});

router.post('/forgot-password', forgotPasswordValidation, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.forgotPassword(req.body.email);
    return res.json({ success: true, message: 'Se o e-mail estiver registrado, um link de redefinição de senha foi enviado.' });
  } catch (error) { next(error); }
});

router.post('/reset-password', resetPasswordValidation, validateRequest, async (req: Request, res: Response, next: NextFunction) => {
  try {
    await authService.resetPasswordWithToken(req.body.token, req.body.newPassword);
    return res.json({ success: true, message: 'Senha redefinida com sucesso.' });
  } catch (error) { next(error); }
});

export default router;
