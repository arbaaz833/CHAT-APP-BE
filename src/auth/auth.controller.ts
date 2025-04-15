import jwt from "jsonwebtoken";
import type {JwtPayload, VerifyErrors} from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../user/user.model";
import bcrypt from "bcrypt";
import { TokenModel } from "./auth.model";

export const register = async (req: Request, res: Response) => {
  try {
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    await UserModel.create({
      ...req.body,
      password: hashedPassword,
    });
    res
      .status(201)
      .json({ error: null, data: { message: "User created successfully" } });
  } catch (err) {
    res.status(500).json({ error: "Internal server error", data: null });
  }
};

export const login = async (req: Request, res: Response):Promise<any> => {
  try {
    const user = await UserModel.findOne({ email: req.body.email });
    if (!user)
      return res
        .status(404)
        .json({ error: "No user against this email.", data: null });

    const isMatch = await bcrypt.compare(req.body.password, user.password);
    if (!isMatch)
      return res.status(401).json({ error: "Invalid credentials", data: null });

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

    await TokenModel.create({
      accessToken,
      refreshToken,
      userId: user.id,
    });
     res
      .status(200)
      .json({
        error: null,
        data: { accessToken, refreshToken, user: user.toJSON() },
      });
  } catch (err) {
      res.status(500).json({ error: "Internal server error", data: null });
  }
};

export const authenticate = async(req:Request,res:Response,next:NextFunction)=>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(!token) return res.status(401).json({error:"Unauthorized",data:null})
        const tokenDoc = await TokenModel.findOne({accessToken:token})
        if(tokenDoc?.accessToken !== token) return res.status(401).json({error:"Unauthorized",data:null})
        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!,async (err,claim) => {
            if(err) return res.status(401).json({error:'Unauthorized',data:null})
            if(tokenDoc.userId !== (claim as JwtPayload).id) return res.status(401).json({error:'Unauthorized',data:null})
            next()
    })
    }catch(err){
        res.status(500).json({ error: "Internal server error", data: null });
    }
}

export const logout = async(req:Request,res:Response)=> {
    try {
        const authHeader = req.headers['authorization']
        const token = authHeader && authHeader?.split(' ')[1]
        if(!token) return res.status(401).json({ error: "Unauthorized", data: null });
        await TokenModel.deleteOne({accessToken:token})
        res.status(200).json({error:null,data:'logged out successfully'}) 
    }catch(err){
        res.status(500).json({ error: "Internal server error", data: null });
    }
}

export const refreshToken = async(req:Request,res:Response)=> {
    try {
        const authHeader = req.headers['authorization']
        const refreshToken = authHeader && authHeader?.split(' ')[1]
        if(!refreshToken) return res.status(401).json({ error: "Unauthorized", data: null });
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET!,async(err,claim)=>{
            if(err) return res.status(401).json({ error: "Invalid refresh token", data: null });
            await TokenModel.deleteOne({refreshToken:refreshToken})

            const newAccessToken = jwt.sign(
                { id: (claim as JwtPayload).id },
                process.env.ACCESS_TOKEN_SECRET as string,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRY as any }
              );
          
              const newRefreshToken = jwt.sign(
                { id: (claim as JwtPayload).id },
                process.env.REFRESH_TOKEN_SECRET as string,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRY as any}
              );
              await TokenModel.create({
                accessToken:newAccessToken,
                refreshToken:newRefreshToken,
                userId: (claim as JwtPayload).id
              })
              res.status(200).json({error:null,data:{
                accessToken:newAccessToken,
                refreshToken:newRefreshToken,
              }})
        })
    }catch(err){
        res.status(500).json({ error: "Internal server error", data: null });
    }
}

