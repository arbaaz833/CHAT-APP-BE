import { InferSchemaType, model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const messageSchema = new Schema({
    text:{
        type:String,
    },
    media:{
        type:[String],
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
messageSchema.plugin(mongoosePaginate)
export const MessageModel = model('messages',messageSchema)