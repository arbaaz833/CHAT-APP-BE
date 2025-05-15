import express from 'express';
import { validateSchema } from '../../utilities/utils';
import { loginValidation, registerValidation } from './auth.validation';
import { authenticate, login, logout, refreshToken, register } from './auth.controller';
import { upload } from '../../app';
const authRouter = express.Router();

authRouter.post('/login',validateSchema(loginValidation),login)
authRouter.post('/signup',validateSchema(registerValidation),register)
authRouter.post('/refresh',refreshToken)
authRouter.delete('/logout',authenticate,logout)

export default authRouter;