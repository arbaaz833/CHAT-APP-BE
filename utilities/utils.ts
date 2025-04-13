import { NextFunction, Request, Response } from "express";
import Joi from "joi";

export const validateSchema = (schema:Joi.Schema)=>{
    return (req:Request,res:Response,next:NextFunction)=>{
        const {error} = schema.validate(req.body)
        console.log('error: ', error);
        if(error) res.status(400).json({error:error.message,data:null})
        else next()
    }
}