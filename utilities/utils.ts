import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import {omit} from "lodash"
export const validateSchema = (schema:Joi.Schema)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const {error} = schema.validate(req.body)
        console.log('error: ', error);
        if(error) res.status(400).json({error:error.message,data:null})
        else next()
    }
}

export const toJsonTransformer = (obj: any, ret: Record<string, any>) => {
    const privateKeys = Object.keys(obj.schema.obj).filter((key) => {
      return !!(obj.schema.obj[key] as any)?.private;
    });
  
    const res = {
      id: ret._id.toString(),
      ...omit(ret, [...privateKeys, "__v", "_id"]),
    };
    return res;
  };