import http from 'http';
import dotenv from 'dotenv';
import { app } from './app';
import mongoose from 'mongoose';
import { initSocket } from './socket';
dotenv.config();

export const server = http.createServer(app)
const PORT = process.env.SERVER_PORT || 3000;



(async () => {
    mongoose.connection.once('open',()=>{
        console.log('MongoDB connected');
    })
    mongoose.connection.on('error',(err)=>{
        console.log('MongoDB connection error: ', err);
    })
    console.log(" DB URI: ", process.env.MONGODB_URI);
    await mongoose.connect(process.env.MONGODB_URI!)
    initSocket(server)
    server.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
})()

