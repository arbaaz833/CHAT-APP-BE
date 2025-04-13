import express from 'express';
import { validateSchema } from '../../utilities/utils';
import { loginValidation } from './auth.validation';
import { login } from './auth.controller';
const authRouter = express.Router();

authRouter.post('/login',validateSchema(loginValidation),login)

export default authRouter;