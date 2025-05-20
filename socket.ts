import {Server} from 'socket.io';
import {Socket} from 'socket.io'
import http from 'http'
import { Actions } from './utilities/types';
import { userServices } from './src/user/user.service';

let io: Server;

export const initSocket = (server:http.Server) => {
    io = new Server(server,{
        cors:{
            origin:'*'
        }
    })

    io.use((socket:Socket,next)=>{
        const userId = socket.handshake.auth.id

        if(!userId) return next(new Error('Connected without userID'))
        socket.data.userId = userId
        next()
    })

    io.on('connection',async(socket)=> {
        const userId = socket.data.userID
        console.log(`user connected with id: ${userId}`)
        
        const userRooms = await userServices.getUserRooms(userId)
        if(userRooms?.length) socket.to(userRooms).emit(Actions.USER_ONLINE,{userId})
            
        socket.on(Actions.JOIN_ROOM,(data)=> {
            const {roomId} = data
            socket.join(roomId)
        })

        socket.on('disconnect',()=>{
            socket.emit(Actions.USER_OFFLINE,{userId})
            console.log("User disconnects")
        })
    })   
}

export const getSocketServer =  () =>{
    return io
}