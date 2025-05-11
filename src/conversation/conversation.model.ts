import { InferSchemaType, model, Schema } from "mongoose";

const conversationSchema = new Schema({
    type:{
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
            ref:'User'
        }],
        required:true,
      },
      createdBy:{
        type:Schema.Types.ObjectId,
        required:true
      },
      updatedBy:{
        type:Schema.Types.ObjectId,
        required:true
      }
},{timestamps:true})
 
export type Conversation =  InferSchemaType<typeof conversationSchema>

export const conversationModel = model('conversations',conversationSchema)