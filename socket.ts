import {Server} from 'socket.io';
import {Socket} from 'socket.io'
import http from 'http'

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

    io.on('connection',(socket)=>{
        const userId = socket.data.userID
        console.log(`user connected with id: ${userId}`)
        socket.emit('userJoined',{userId})

        socket.on('joinRoom',(data)=>{
            const {roomId} = data
            socket.join(roomId)
        })

        socket.on('disconnect',()=>{
            console.log("User disconnects")
        })
    })   
}

export const getSocketServer =  () =>{
    return io
}