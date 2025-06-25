import { GenericObject, WithPagination } from "../../utilities/types";
import { findOrPaginate } from "../../utilities/utils";
import { MessageModel } from "./messages.model";

const fetchList = async ({page=0,limit=0,...filters}:WithPagination<GenericObject>) =>{
    const docs =  await findOrPaginate(MessageModel,filters,{page,limit},{createdAt:-1},{path:'sender',select:'username profilePicture'})
    return docs
}



export const messageService = {
    fetchList,
}

