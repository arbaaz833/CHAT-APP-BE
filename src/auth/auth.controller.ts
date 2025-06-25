import jwt from "jsonwebtoken";
import type {JwtPayload} from 'jsonwebtoken'
import { NextFunction, Request, Response } from "express";
import { UserModel } from "../user/user.model";
import bcrypt from "bcrypt";
import { TokenModel } from "./auth.model";
import { storageService } from "../../storage/storage.service";
import mongoose from "mongoose";
import { generateBase62UniqueString } from "../../utilities/utils";

export const register = async (req: Request, res: Response):Promise<any> => {
  try {
    const user = await UserModel.findOne({email:req.body.email})
    if(user) return res.status(403).json({error:'Email already taken',data:null})
    let userWithCode = true
    let code 
    while(userWithCode) {
      code = generateBase62UniqueString(6);
      const userWithCodeDoc = await UserModel.findOne({ userCode: code });
      if (!userWithCodeDoc) {
        req.body.verificationCode = code;
        userWithCode = false;
      }
    }
    const salt = await bcrypt.genSalt();
    const hashedPassword = await bcrypt.hash(req.body.password, salt);
    const id = new mongoose.Types.ObjectId()
    let url = ''
    if(req.file) {
      url = await storageService.save(req.file,`${id}/${req.file.originalname}`)
    }
    const userDoc = new UserModel({
      _id:id,
      ...req.body,
      userCode: code,
      profilePicture:url,
      password: hashedPassword,
    });
    await userDoc.save()
    res
      .status(201)
      .json({ error: null, data: { message: "User created successfully" } });
  } catch (err) {
    console.log('err: ', err);
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
    console.log('err: ', err);
      res.status(500).json({ error: "Internal server error", data: null });
  }
};

export const authenticate = async(req:Request,res:Response,next:NextFunction):Promise<any>=>{
    try{
        const authHeader = req.headers['authorization'];
        const token = authHeader && authHeader.split(' ')[1];
        if(!token) return res.status(401).json({error:"Unauthorized",data:null})
        const tokenDoc = await TokenModel.findOne({accessToken:token})

        if(tokenDoc?.accessToken !== token) return res.status(401).json({error:"Unauthorized",data:null})

        jwt.verify(token,process.env.ACCESS_TOKEN_SECRET!,async (err,claim:any) => {
            if(err?.name === 'TokenExpiredError') return res.status(401).json({error:'token expired',data:null})
            if(err) return res.status(401).json({error:'Unauthorized',data:null})
            if(tokenDoc.userId !== claim.id) return res.status(401).json({error:'Unauthorized',data:null})
            res.locals.user = claim.id
            next()
    })

    }catch(err){
        res.status(500).json({ error: "Internal server error", data: null });
    }
}

export const logout = async(req:Request,res:Response): Promise<any>=> {
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

export const refreshToken = async(req:Request,res:Response):Promise<any>=> {
    try {
        const authHeader = req.headers['authorization']
        const refreshToken = authHeader && authHeader?.split(' ')[1]
        if(!refreshToken) return res.status(401).json({ error: "Unauthorized", data: null });
        jwt.verify(refreshToken,process.env.REFRESH_TOKEN_SECRET!,async(err,claim)=> {
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

