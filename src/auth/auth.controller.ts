import jwt from 'jsonwebtoken'
import { Request, Response } from "express";
import { UserModel } from '../user/user.model';
import bcrypt from 'bcrypt'

const users = [
    {
        email:'user1@yopmail.com',
        id:1,
        password:'password1'
    },
    {
        email:'user2@yopmail.com',
        id:2,
        password:'password2'  
    }
]

export const register = async (req:Request, res:Response) => {
    try{
        const salt = await bcrypt.genSalt();
        const hashedPassword = await bcrypt.hash(req.body.password, salt);
        await UserModel.create({
            ...req.body,
            password:hashedPassword,
        })
        res.status(201).json({error:null,data:{message:'User created successfully'}})
    }catch(err){
        res.status(500).json({error:'Internal server error',data:null})
    }
}



export const login  = async (req:Request, res:Response) => {
    console.log('req: ', req.body);
    try{
    const {email,password} = req.body
    const user = users.find(user=>user.email===email && user.password===password)
    if(user){
        const accessToken = jwt.sign(
            { id: user.id },
            process.env.ACCESS_TOKEN_SECRET as string,
            { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any }
        );

        const refreshToken = jwt.sign(
            { id: user.id },
            process.env.REFRESH_TOKEN_SECRET as string,
            { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any }
        );
        res.status(200).json({error:null,data:{accessToken,refreshToken,user}})
    }else{
        res.status(401).json({message:'Invalid credentials',data:null})
    }
}catch(err){
    res.status(500).json({error:'Internal server error',data:null})
 }
}