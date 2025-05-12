import { S3 } from "aws-sdk"
import { S3_BUCKET } from "../configs/s3Bucket"
import { AWS_BUCKET_NAME } from "../constants"
import { getS3ObjectKeyFromUrl, getSignedUrl } from "./storage.helpers"

const save = async(file:File,key:string) =>{
    const params:S3.PutObjectRequest = {
        Bucket:AWS_BUCKET_NAME,
        Key:key,
        Body:file,
        ContentType:file.type
    }
    const res = await S3_BUCKET.upload(params).promise()
    return getSignedUrl(res.Location)
}

const deleteObject = async(url:string) =>{
    const key = getS3ObjectKeyFromUrl(url)
    const params = {Bucket:AWS_BUCKET_NAME,Key:key}

    await S3_BUCKET.deleteObject(params).promise()
}

export const storageService = {
    save,
    deleteObject
}