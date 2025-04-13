import express from 'express';
import authRouter from './src/auth/auth.router';

export const app = express();

app.use(express.json());
 
app.use('/auth', authRouter);



