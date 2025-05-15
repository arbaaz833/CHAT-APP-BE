

export function getS3ObjectKeyFromUrl(url:string) {
      const parsedUrl = new URL(url);
      const hostname = parsedUrl.hostname;
      const pathname = parsedUrl.pathname;
  
      // Check if it's an S3 URL (can have different formats)
      if (hostname.endsWith('.amazonaws.com') || hostname.includes('s3')) {
        // Remove the leading slash from the pathname to get the key
        const objectKey = pathname.startsWith('/') ? pathname.substring(1) : pathname;
        return decodeURIComponent(objectKey); // Decode URL-encoded characters
      } else {
        console.warn('URL does not appear to be an Amazon S3 URL.');
        return '';
      }
}

// export async function getSignedUrl(url:string) {
//     const key = getS3ObjectKeyFromUrl(url)
//     return S3_BUCKET.getSignedUrl('getObject',{Bucket:AWS_BUCKET_NAME,Key:key,Expires:SIGNED_URL_LIFE})
// }
