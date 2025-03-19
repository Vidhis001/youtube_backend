import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: CLOUDINARY_CLOUD_API, 
    api_secret: CLOUDINARY_CLOUD_SECRET // Click 'View API Keys' above to copy your API secret
});

const uploadResult = async (localFilePath)=>{
    try {
        if(!localFilePath) return null
        const response =await cloudinary.uploader
       .upload(
           localFilePath,{
            resource_type: "auto",
           }
       )
       console.log("file is uploaded successfully",response.url);
       return response
    } catch (error) {
        fs.unlinkSync(localFilePath)
        return null;
    }
}

export {uploadResult}