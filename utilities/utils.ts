import { NextFunction, Request, Response } from "express";
import Joi from "joi";
import { omit } from "lodash";
import type { FilterQuery, Model } from "mongoose";
import { PaginationParams } from "./types";

export const validateSchema = (schema: Joi.Schema) => {
  return (req: Request, res: Response, next: NextFunction) => {
    const { error } = schema.validate(req.body);
    console.log("error: ", error);
    if (error) res.status(400).json({ error: error.message, data: null });
    else next();
  };
};

export const toJsonTransformer = (obj: any, ret: Record<string, any>) => {
  const privateKeys = Object.keys(obj.schema.obj).filter((key) => {
    return !!(obj.schema.obj[key] as any)?.private;
  });

  const res = {
    id: ret._id.toString(),
    ...omit(ret, [...privateKeys, "__v", "_id"]),
  };
  return res;
};

export const toResponse = ({ data, error }: { data?: any; error?: any }) => {
  return { data: data ?? null, error: error ? error : null };
};

export const findOrPaginate = <T>(
  model: Model<T>,
  query: FilterQuery<T> = {},
  { page = 0, limit = 0 }: PaginationParams,
  sort?: Record<any, any>,
  populate?: any
) => {
  if (page && page > 0 && limit && limit > 0) {
    return (model as any).paginate(query, {
      page,
      limit,
      sort,
      populate,
    });
  }

  let promise: any = model.find(query);
  if (sort) promise = promise.sort(sort);
  if (populate) promise = promise.populate(populate);
  return promise;
};

export const jsonList = (data: any): any[] => {
    if (Array.isArray(data.docs)) {
      data.docs = data.docs.map((doc: any) => doc.toJSON());
      return data;
    } else return data.map((doc: any) => doc.toJSON());
  };
