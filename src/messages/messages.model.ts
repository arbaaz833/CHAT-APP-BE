import { InferSchemaType, model, Schema } from "mongoose";

const messageSchema = new Schema({
    text:{
        type:String,
    },
    mediaUrl:{
        type:String,
    },
    conversation:{
        type:Schema.Types.ObjectId,
        required:true
    },
    sender:{
        type: Schema.Types.ObjectId,
        ref:'User'
    }
},{timestamps:true})

export type Message = InferSchemaType<typeof messageSchema>
export const messageModel = model('messages',messageSchema)