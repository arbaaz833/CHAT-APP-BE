import { s3 } from "../configs/s3Bucket"
import { AWS_BUCKET_NAME } from "../constants"
import { getS3ObjectKeyFromUrl } from "./storage.helpers"
import { DeleteObjectCommand, DeleteObjectsCommand, ListObjectsV2Command, PutObjectCommand } from "@aws-sdk/client-s3"

const save = async(file:Express.Multer.File,key:string) =>{
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

const deleteS3Folder = async (folderPrefix: string) => {
    try {
      // 1. List objects under the prefix
      const listCommand = new ListObjectsV2Command({
        Bucket: AWS_BUCKET_NAME,
        Prefix: folderPrefix, 
      });
  
      const listedObjects = await s3.send(listCommand);
  
      if (!listedObjects.Contents || listedObjects.Contents.length === 0) {
        console.log("No objects found under prefix.");
        return;
      }
  
      // 2. Prepare delete objects array
      const objectsToDelete = listedObjects.Contents.map(obj => ({ Key: obj.Key }));
  
      const deleteCommand = new DeleteObjectsCommand({
        Bucket: AWS_BUCKET_NAME,
        Delete: { Objects: objectsToDelete },
      });
  
      const deleteResult = await s3.send(deleteCommand);
      console.log("Deleted:", deleteResult.Deleted?.length, "objects");
    } catch (error) {
      console.error("Error deleting folder:", error);
    }
  };

export const storageService = {
    save,
    deleteObject,
    deleteS3Folder,
}