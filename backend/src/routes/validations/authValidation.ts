import { body } from 'express-validator';

export const loginValidation = [
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
  body('password').notEmpty().withMessage('Senha é obrigatória'),
];

export const changePasswordValidation = [
  body('currentPassword').notEmpty().withMessage('Senha atual é obrigatória'),
  body('newPassword').isLength({ min: 8 }).withMessage('Nova senha deve ter pelo menos 8 caracteres'),
];

export const forgotPasswordValidation = [
  body('email').isEmail().normalizeEmail().withMessage('E-mail inválido'),
];

export const resetPasswordValidation = [
  body('token').notEmpty().withMessage('Token é obrigatório'),
  body('newPassword').isLength({ min: 8 }).withMessage('Nova senha deve ter pelo menos 8 caracteres'),
];
