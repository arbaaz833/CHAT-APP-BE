import { InferSchemaType, model, Schema } from "mongoose";

const userSchema = new Schema({
    name: {
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
    password: {
        type: String,
        required: true,
        private: true,
    },
    emailVerified:{
        type: Boolean,
        default: false,
    }
}).set('toJSON', {
    transform: (doc, ret) => {
        for(let key in userSchema.paths){
            if(userSchema.paths[key].options.private){
                delete ret[key]
            }
        }
        ret.id = doc._id
        delete ret._id
        delete ret.__v
        return ret
    }
});

export type User = InferSchemaType<typeof userSchema>
export const UserModel = model('User', userSchema)
