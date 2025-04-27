import express, { Request, Response } from 'express';
import authRouter from './src/auth/auth.router';
import cors from 'cors';
//['https://nextjs-jwt-cookie-auth.vercel.app']

export const app = express();

app.use(express.json());
app.use(cors({credentials:true,origin:"*"}))
 
app.use('/auth', authRouter);

app.get('/status',(req:Request,res:Response)=>{
    res.status(200).json({data:'All systems good.',error:null})
})



