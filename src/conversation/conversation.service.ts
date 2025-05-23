import { GenericObject, WithPagination } from "../../utilities/types";
import { findOrPaginate } from "../../utilities/utils";
import { conversationModel } from "./conversation.model";
import { UserModel } from "../user/user.model";
import mongoose from "mongoose";

 const fetchList = async ({
  page,
  limit,
  ...filters
}: WithPagination<GenericObject>) => {
  const docs = await findOrPaginate(
    conversationModel,
    filters,
    { page, limit },
    { lastUpdatedAt: -1 },
    { path: "members", select: "userName profilePicture" }
  );
  return docs;
};



export const conversationService ={
    fetchList
}
