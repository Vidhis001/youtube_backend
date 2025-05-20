import { v2 as cloudinary } from 'cloudinary';
import fs from 'fs';

cloudinary.config({ 
    cloud_name: process.env.CLOUDINARY_CLOUD_NAME, 
    api_key: process.env.CLOUDINARY_API_KEY, 
    api_secret: process.env.CLOUDINARY_API_SECRET// Click 'View API Keys' above to copy your API secret
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
       //console.log("file is uploaded successfully",response.url);
       if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }
       return response
    } catch (error) {
        if (fs.existsSync(localFilePath)) {
            fs.unlinkSync(localFilePath);
        }

        console.error("Cloudinary upload failed:", error);
        return null;
    }
}

// ✅ NEW: Delete file from Cloudinary using public_id
const deleteFromCloudinary = async (publicId) => {
    try {
        const result = await cloudinary.uploader.destroy(publicId, {
            resource_type: "auto" // Cloudinary will detect the correct type
        });

        return result;
    } catch (error) {
        console.error("Cloudinary delete failed:", error);
        return null;
    }
};

const extractPublicId = (url) => {
    if (!url) return null;

    const fileName = url.split('/').pop();        // e.g., "abc123.mp4"
    const publicId = fileName.split('.')[0];      // e.g., "abc123"
    return publicId;
};



export {uploadResult,deleteFromCloudinary,extractPublicId}