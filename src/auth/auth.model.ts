import { InferSchemaType, model, Schema } from "mongoose";

const tokenSchema = new Schema({
    accessToken: {
        type: String,
        required: true,
    },
    refreshToken: {
        type: String,
        required: true,
    },
    userId: {
        type: String,
        required: true,
    }
})

export type Token  =  InferSchemaType<typeof tokenSchema>
export const TokenModel = model('Token', tokenSchema)