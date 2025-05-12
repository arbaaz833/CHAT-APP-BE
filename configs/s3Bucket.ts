import AWS from 'aws-sdk'
import dotenv from 'dotenv';
dotenv.config()

// Configure AWS credentials (only needed if running outside AWS with IAM User keys)
AWS.config.update({
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  region: 'us-east-2' // e.g., 'us-east-1'
});

export const S3_BUCKET = new AWS.S3();