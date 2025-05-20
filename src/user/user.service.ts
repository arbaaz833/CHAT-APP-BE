import { UserModel } from "./user.model"

const getUserRooms = async (userId:string) =>{
    try{
        const user = await UserModel.findById(userId).lean()
        const conversations= user?.conversations || []
        if(conversations.length) {
            const convIds= conversations.map((convId)=>`${convId}`)
            return convIds
        }else return []
    }catch(e){
    }
}

export const userServices = {
    getUserRooms
}