import { InferSchemaType, model, Schema } from "mongoose";
import mongoosePaginate from 'mongoose-paginate-v2'

const conversationSchema = new Schema({
    type:{
        type:String,
        enum:['chat','group'],
        required:true,
    },
    members:{
        type:[{
            type: Schema.Types.ObjectId,
            ref:'User'
        }],
        required:true,
    },
    groupName: {
        type: String,
        required: true
      },
      groupAvatar: {
        type: String,
        required:true
      },
      admins:{
        type:[{
            type: Schema.Types.ObjectId,
        }],
        required:true,
      },
      createdBy:{
        type:Schema.Types.ObjectId,
        required:true
      },
      lastUpdatedAt:{
        type:Date,
        required:true
      }
},{timestamps:true})
 
export type Conversation =  InferSchemaType<typeof conversationSchema>

conversationSchema.plugin(mongoosePaginate)

export const conversationModel = model('conversations',conversationSchema)