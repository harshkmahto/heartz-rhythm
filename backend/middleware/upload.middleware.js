import multer from 'multer';
import path from 'path';


const storage = multer.memoryStorage();


const fileFilter = (req, file, cb) => {

    const allowedMimeTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/gif', 'image/webp'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only image files (jpeg, jpg, png, gif, webp) are allowed'), false);
    }
};


const videoFilter = (req, file, cb) => {
    const allowedMimeTypes = ['video/mp4', 'video/mpeg', 'video/quicktime', 'video/webm'];
    
    if (allowedMimeTypes.includes(file.mimetype)) {
        cb(null, true);
    } else {
        cb(new Error('Only video files (mp4, mpeg, mov, webm) are allowed'), false);
    }
};


// Create upload middleware
export const upload = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 }, // 5MB limit
    fileFilter: fileFilter
});

export const uploadSellerImages = upload.fields([
    { name: 'coverImage', maxCount: 1 },
    { name: 'logo', maxCount: 1 },
    { name: 'previewImage', maxCount: 3 }
]);

export const uploadProductImages = upload.fields([
    { name: 'thumbnail', maxCount: 1 },
    { name: 'images', maxCount: 5 },
    { name: 'gallery', maxCount: 10 },
    { name: 'preview', maxCount: 1 },
    { name: 'videos', maxCount: 5 },
    {name: 'image', maxCount: 1},
]);