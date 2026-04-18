import ImageKit from "imagekit";
import config from "../config/config.js";


const imagekit = new ImageKit({
    publicKey: config.IMAGEKIT_PUBLIC_KEY,
    privateKey: config.IMAGEKIT_PRIVATE_KEY,
    urlEndpoint: config.IMAGEKIT_URL_ENDPOINT
});


// Upload image to ImageKit
export const uploadImage = async (file, folder = "profiles") => {
    try {
        // Convert buffer to base64 if file is buffer
        let fileData = file;
        if (file.buffer) {
            fileData = file.buffer.toString('base64');
        }

        const result = await imagekit.upload({
            file: fileData,
            fileName: `${Date.now()}_${Math.random().toString(36).substring(7)}.jpg`,
            folder: folder,
            useUniqueFileName: true
        });

        return {
            success: true,
            url: result.url,
            fileId: result.fileId,
            thumbnailUrl: result.thumbnailUrl
        };
    } catch (error) {
        console.error('ImageKit upload error:', error);
        throw new Error('Failed to upload image');
    }
};


// Delete image from ImageKit
export const deleteImage = async (fileId) => {
    try {
        if (!fileId) return { success: true };
        
        const result = await imagekit.deleteFile(fileId);
        return {
            success: true,
            result
        };
    } catch (error) {
        console.error('ImageKit delete error:', error);
        // Don't throw error for delete failures
        return { success: false, error: error.message };
    }
};


// Update image 
export const updateImage = async (oldFileId, newFile, folder = "profiles") => {
    try {
        // Delete old image if exists
        if (oldFileId) {
            await deleteImage(oldFileId);
        }
        
        // Upload new image
        const uploadResult = await uploadImage(newFile, folder);
        
        return uploadResult;
    } catch (error) {
        console.error('Image update error:', error);
        throw new Error('Failed to update image');
    }
};

// Get image URL with transformations
export const getOptimizedImageUrl = (url, width = 200, height = 200) => {
    if (!url) return null;
    

    const transformation = `tr:w-${width},h-${height},c-maintain_ratio`;
    
   
    if (url.includes('tr:')) {
        return url;
    }
    

    const urlParts = url.split('/upload/');
    if (urlParts.length === 2) {
        return `${urlParts[0]}/upload/${transformation}/${urlParts[1]}`;
    }
    
    return url;
};

export default {
    uploadImage,
    deleteImage,
    updateImage,
    getOptimizedImageUrl
}; 