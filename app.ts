import express, { Request, Response } from 'express';
import authRouter from './src/auth/auth.router';
import cors from 'cors';
import multer from 'multer'
import { queryParser } from 'express-query-parser';

export const upload = multer()
export const app = express();

app.use(express.json());
app.use(cors({credentials:true,origin:"*"}))
app.use(queryParser(
    {
        parseNull: true,
        parseUndefined: true,
        parseBoolean: true,
        parseNumber: true,
      }
))
 
app.use('/auth', authRouter);

app.get('/status',(req:Request,res:Response)=>{
    res.status(200).json({data:'All systems good.',error:null})
})



