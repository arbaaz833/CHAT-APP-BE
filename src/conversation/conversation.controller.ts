import { Request, Response } from "express";
import { Conversation, conversationModel } from "./conversation.model";
import { toResponse } from "../../utilities/utils";
import { conversationService} from "./conversation.service";
import { storageService } from "../../storage/storage.service";
import mongoose from "mongoose";
import { MessageModel } from "../messages/messages.model";
import { UserModel } from "../user/user.model";

async function create(req:Request<{},{},Conversation>,res:Response):Promise<any> {
    try{
        const reqUser = res.locals.user
        const data = req.body
        data.members.push(reqUser)
        const id = new mongoose.Types.ObjectId()
        await Promise.all(data.members.map((memberId)=>UserModel.findByIdAndUpdate({_id:memberId},{$push:{conversations:id}})))
        if(data.type === 'group'){
            data.admins.push(reqUser)
            if(req.file){
               const url =await storageService.save(req.file,`${id}/${req.file.originalname}`)
               data.groupAvatar = url
            } 
        }
        data.createdBy = reqUser
        // data.lastUpdatedAt = new Date()
        const conDoc = new conversationModel({_id:id,...data})
        const doc =  await conDoc.save()
         res.status(201).json(toResponse({ data: doc.populate('members', 'username profilePicture') }));
    }catch(e){
        console.log('e: ', e);
         res.status(500).json(toResponse({error:'Internal server Error'}))
    }
}

async function list(req:Request,res:Response) {
    try{
        const reqUserId = res.locals.user
        console.log('reqUserId: ', reqUserId);
        const docs= await conversationService.fetchList({members:{$in:[reqUserId]},...req.query})
         res.status(200).json(toResponse({data:docs}))
    }catch(e){
         res.status(500).json(toResponse({error:'Internal server Error'}))
    }
}

async function search(req:Request,res:Response):Promise<any> {
    try{
        const reqUserId = res.locals.user
        const searchTerm = req.query.name as string
        if(!searchTerm) return res.status(400).json(toResponse({error:'Please provide search term'}))
        const regex = new RegExp(searchTerm, 'i')
        const users = await UserModel.find({username:regex}).select('_id')
        const userIds =  users.map((user)=>user._id)

        const docs = await conversationModel.find({
            $or:[
                {groupName:regex},
                {$and:[{members:{$in:[reqUserId]}},{members:{$in:userIds}}]}]},   
        )

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
        await MessageModel.deleteMany({conversation:convId})
        await Promise.all(conv.members.map((memberId)=>UserModel.findByIdAndUpdate({_id:memberId},{$pull:{conversations:convId}})))
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


async function addAdmins(req:Request,res:Response):Promise<any> {
    try{
        const convId = req.params.id
        const data = req.body
        if(!convId) return res.status(400).json(toResponse({error:'Please provide conversation Id'}))
        const conv = await conversationModel.findById(convId)
        if(!conv) return res.status(404).json(toResponse({error:'no conversation found'}))
        if(conv.type !=='group') return res.status(400).json(toResponse({error:'Cannot update chat'}))
        const _res = await conversationModel.findByIdAndUpdate({_id:convId},{$push:{admins:{$each:[...data.admins]}}},{new:true})
        res.status(200).json(toResponse({data:_res}))
    }catch(e){
        res.status(500).json(toResponse({error:'Internal server Error'}))
    }
}

async function leave(req:Request,res:Response):Promise<any> {
    try{
        const convId = req.params.id
        const reqUser = res.locals.id
        if(!convId) return res.status(400).json(toResponse({error:'Please provide conversation Id'}))
        const conv = await conversationModel.findById(convId)
        if(!conv) return res.status(404).json(toResponse({error:'no conversation found'}))
        const _res = await conversationModel.findByIdAndUpdate({_id:convId},{$pull:{members:reqUser},$push:{pastMembers:reqUser}},{new:true})
        res.status(200).json(toResponse({data:_res}))
    }catch(e){
        res.status(500).json(toResponse({error:'Internal server Error'}))
    }
}



export const conversationController = {
    create,
    list,
    remove,
    update,
    addAdmins,
    leave,
    search
}