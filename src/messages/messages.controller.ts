import { Request, Response } from "express";
import { toResponse } from "../../utilities/utils";
import { conversationModel } from "../conversation/conversation.model";
import { messageService } from "./messages.service";
import { storageService } from "../../storage/storage.service";
import { MessageModel } from "./messages.model";
import mongoose from "mongoose";
import { getSocketServer } from "../../socket";
import { Actions } from "../../utilities/types";
import { userServices } from "../user/user.service";

const list = async(req:Request,res:Response):Promise<any> => {
    try{
        const roomId = req.params.id
        const conv = conversationModel.findById(roomId)
        if(!conv) res.status(404).json(toResponse({error:'Invalid ID'}))
        const messages = await messageService.fetchList({...req.query,conversation:roomId})
    return res.status(200).json(toResponse({data:messages}))
    }catch(e){
        return res.status(500).json(toResponse({error:'Internal server error'}))
    }
}

const create = async (req:Request,res:Response): Promise<any> => {
    const session = await mongoose.startSession()
    try {
        const roomId = req.params.id
        const senderId = res.locals.id
        const io = getSocketServer();
        const conv = await conversationModel.findById(roomId).lean()
        if(!conv) return res.status(404).json(toResponse({error:'Invalid ID'}))
        
        const data = req.body
        if(req.files?.length){
            const urls = await Promise.all((req.files as Express.Multer.File[]).map(file=>{
                return storageService.save(file,`${roomId}/${file.originalname}`)
            }))
            data.media =urls
        }
        data.sender = senderId
        const msg =  await MessageModel.create(data)
        io.to(roomId).emit(Actions.NEW_MESSAGE,msg)
        //get connected members to a socket
        //io.sockets.adapter.rooms is a MAP 
        const socketRoomIds = io.sockets.adapter.rooms.get(roomId)
        const connectedMembers = Array.from(socketRoomIds?.values()!).map((id)=>io.sockets.sockets.get(id)).filter(socketObj=>!!socketObj).map(socketObj=>socketObj.data.userId)
        const membersDisconnected = conv.members.filter(convMember=>!connectedMembers.includes(convMember))
        await userServices.incrementUnreadCount(membersDisconnected,roomId)
        let timeToLastUpdate = (Date.now() - conv.updatedAt.getTime())/1000
        // 4 seconds cooldown period
        if(timeToLastUpdate > 4){
            session.startTransaction()
            await conversationModel.findByIdAndUpdate(roomId,{lastUpdatedAt:new Date()},{session})
            await session.commitTransaction()
        } 
        return res.status(200).json(toResponse({data:msg}))
    }catch(e){
        await session.abortTransaction()
        return res.status(500).json(toResponse({error:'Internal server error'}))
    }finally{
        session.endSession()
    }
}

export const messageController={
    list,
    create
}

