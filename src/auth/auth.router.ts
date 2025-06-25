import express from 'express';
import { validateSchema } from '../../utilities/utils';
import { loginValidation, registerValidation } from './auth.validation';
import { authenticate, login, logout, refreshToken, register } from './auth.controller';
import multer from 'multer'

const authRouter = express.Router();
const upload = multer({storage: multer.memoryStorage()})

authRouter.post('/login',validateSchema(loginValidation),login)
authRouter.post('/signup',validateSchema(registerValidation),upload.single('file'),register)
authRouter.post('/refresh',refreshToken)
authRouter.delete('/logout',authenticate,logout)

export default authRouter;