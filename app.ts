import express, { Request, Response } from 'express';
import authRouter from './src/auth/auth.router';
import cors from 'cors';
import multer from 'multer'
import { queryParser } from 'express-query-parser';
import conversationRouter from './src/conversation/conversation.router';
import messageRouter from './src/messages/messages.router';
const storage = multer.memoryStorage();
export const app = express();
export const upload = multer({storage:storage})

// app.use(upload.single('file'))

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
app.use('/conversation',conversationRouter)
app.use('/message',messageRouter)

app.get('/status',(req:Request,res:Response)=>{
    res.status(200).json({data:'All systems good.',error:null})
})



