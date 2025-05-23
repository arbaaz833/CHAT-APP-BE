import mongoose from "mongoose"
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

const incrementUnreadCount  = async(members:mongoose.Types.ObjectId[],convId:string)=>{
    await UserModel.updateMany({_id:{$in:members}},[ // Start of the aggregation pipeline for update
        {
            $set: { // Use $set to define the new value for unreadCount
                unreadCount: {
                    $cond: {
                        // Condition: Check if convId exists in the unreadCount array
                        if: { $in: [convId, '$unreadCount.id'] },
                        then: {
                            // If convId exists, map over the array and increment the count
                            $map: {
                                input: '$unreadCount', // The array to iterate over
                                as: 'item', // Alias for each element in the array
                                in: {
                                    $cond: {
                                        if: { $eq: ['$$item.id', convId] }, // If this item's id matches convId
                                        then: {
                                            id: '$$item.id',
                                            count: { $add: ['$$item.count', 1] } // Increment its count by 1
                                        },
                                        else: '$$item' // Otherwise, keep the item as is
                                    }
                                }
                            }
                        },
                        else: {
                            // If convId does NOT exist, concatenate the existing array with the new object
                            $concatArrays: [
                                '$unreadCount', // The original unreadCount array
                                [{ id: convId, count: 1 }] // A new array containing the object to add
                            ]
                        }
                    }
                }
            }
        }
    ])
}

async function resetUnreadCount(convId:string) {
        await UserModel.findByIdAndUpdate(
            convId, // Filter to find the specific user document
            { $pull: { unreadCount: { id: convId } } } // Atomically remove the object matching the convId
        );
}

export const userServices = {
    getUserRooms,
    incrementUnreadCount,
    resetUnreadCount
}