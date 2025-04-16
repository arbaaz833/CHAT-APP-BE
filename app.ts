import express, { Request, Response } from 'express';
import authRouter from './src/auth/auth.router';

export const app = express();

app.use(express.json());
 
app.use('/auth', authRouter);

app.get('/status',(req:Request,res:Response)=>{
    res.status(200).json({data:'All systems good.',error:null})
})



