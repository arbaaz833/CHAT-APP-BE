import { Request, Response } from "express";
import { Conversation, conversationModel } from "./conversation.model";
import { toResponse } from "../../utilities/utils";
import { conversationService} from "./conversation.service";
import { storageService } from "../../storage/storage.service";
import mongoose from "mongoose";
import { messageModel } from "../messages/messages.model";

async function create(req:Request<{},{},Conversation>,res:Response):Promise<any> {
    try{
        const reqUser = res.locals.id
        const data = req.body
        data.members.push(reqUser)
        data.admins.push(reqUser)
        const id = new mongoose.Types.ObjectId()
        if(data.type === 'group'){
            if(req.file){
               const url =await storageService.save(req.file,`${id}/${req.file.originalname}`)
               data.groupAvatar = url
            } 
        }
        data.createdBy = res.locals.id
        data.lastUpdatedAt = new Date()
        const conDoc = new conversationModel({_id:id,...data})
        const doc =  await conDoc.save()
         res.status(201).json(toResponse({ data: doc.toJSON() }));
    }catch(e){
         res.status(500).json(toResponse({error:'Internal server Error'}))
    }
}

async function list(req:Request,res:Response) {
    try{
        const reqUserId = res.locals.id
        const docs= await conversationService.fetchList({members:[reqUserId],...req.query})
         res.status(200).json(toResponse({data:docs}))
    }catch(e){
         res.status(500).json(toResponse({error:'Internal server Error'}))
    }
}

async function remove(req:Request,res:Response):Promise<any> {
    try{
        const convId = req.params.id
        if(!convId) return res.status(400).json(toResponse({error:'Please provide conversation Id'}))
        const conv = await conversationModel.findById(convId)
        if(!conv) return res.status(404).json(toResponse({error:'no conversation found'}))
        await messageModel.deleteMany({conversation:convId})
        await storageService.deleteS3Folder(convId)
        res.status(200).json(toResponse({data:'conversation deleted successfully'}))
    }catch(e){
        res.status(500).json(toResponse({error:'Internal server Error'}))
    }

}

async function update(req:Request,res:Response):Promise<any> {
    try{
        const convId = req.params.id
        const data = req.body
        if(!convId) return res.status(400).json(toResponse({error:'Please provide conversation Id'}))
        const conv = await conversationModel.findById(convId)
        if(!conv) return res.status(404).json(toResponse({error:'no conversation found'}))
        if(conv.type !=='group') return res.status(400).json(toResponse({error:'Cannot update chat'}))
            if(req.file) {
               const url= await storageService.save(req.file,`${conv._id}/${req.file.originalname}`)
               data.groupAvatar = url
            }
        await conv.updateOne(data)
        res.status(200).json(toResponse({data:'conversation deleted successfully'}))
    }catch(e){
        res.status(500).json(toResponse({error:'Internal server Error'}))
    }

}


export const conversationController = {
    create,
    list,
    remove,
    update
}