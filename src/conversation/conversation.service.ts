import { filter } from "lodash";
import { GenericObject, WithPagination } from "../../utilities/types";
import { findOrPaginate } from "../../utilities/utils";
import { conversationModel } from "./conversation.model";

export const fetchList = async ({
  page,
  limit,
  ...filters
}: WithPagination<GenericObject>) => {
  const docs = await findOrPaginate(
    conversationModel,
    filters,
    { page, limit },
    { lastUpdatedAt: -1 },
    { path: "admins", select: "userName profilePicture" }
  );
  return docs;
};
