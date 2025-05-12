import { Request, Response } from "express";
import { conversationModel } from "./conversation.model";
import { findOrPaginate, toResponse } from "../../utilities/utils";
import { fetchList } from "./conversation.service";

async function create(req:Request,res:Response) {
    try{
        const reqUser = res.locals.id
        req.body.members.push(reqUser)
        const doc =  await conversationModel.create(req.body)
        return res.status(201).json(toResponse({ data: doc.toJSON() }));
    }catch(e){
        res.status(500).json({error:'Internal server Error'})
    }
}

async function list(req:Request,res:Response) {
    try{
        const reqUserId = res.locals.id
        const docs= await fetchList({members:reqUserId,...req.query})
        res.status(200).json(toResponse({data:docs}))
    }catch(e){
        res.status(500).json({error:'Internal server Error'})
    }
}


export const conversationController = {
    create,
    list
}