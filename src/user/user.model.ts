import { InferSchemaType, model, Schema } from "mongoose";
import { toJsonTransformer } from "../../utilities/utils";

const userSchema = new Schema({
    userName: {
        type: String,
        required: true, 
    },
    email: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true,
    },
    profilePicture:{
        type: String,
    },
    lastSeen:{
        type: Date,
        default:null,
    },
    password:{
        type: String,
        required: true,
        private: true,
    },
    unreadCount:{
         type:[
            {
                _id:false,
                id:{
                    type:Schema.Types.ObjectId,
                    required:true
                },
                count:Number
            }
        ],
        default:[],
        private:true 
    }
    }).set('toJSON', {
    transform: toJsonTransformer
});

export type User = InferSchemaType<typeof userSchema>
export const UserModel = model('User', userSchema)
