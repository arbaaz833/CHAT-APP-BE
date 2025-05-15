import { s3 } from "../configs/s3Bucket"
import { AWS_BUCKET_NAME } from "../constants"
import { getS3ObjectKeyFromUrl } from "./storage.helpers"
import { DeleteObjectCommand, PutObjectCommand } from "@aws-sdk/client-s3"

const save = async(file:Express.Multer.File,key:string) =>{
    console.log('key: ', key);

    const command = new PutObjectCommand({
        Bucket: AWS_BUCKET_NAME,
        Key: key,
        Body: file.buffer,
        ContentType: file.mimetype,
      });
    
         await s3.send(command);
        const objectUrl = `https://${AWS_BUCKET_NAME}.s3.${process.env.AWS_REGION}.amazonaws.com/${key}`;
        console.log('Object URL:', objectUrl);
        return objectUrl; 
}

const deleteObject = async(url:string) =>{
    const key = getS3ObjectKeyFromUrl(url)
    const command = {Bucket:AWS_BUCKET_NAME,Key:key}
    await s3.send(new DeleteObjectCommand(command))
}

export const storageService = {
    save,
    deleteObject
}