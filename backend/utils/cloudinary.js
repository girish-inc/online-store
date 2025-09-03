const cloudinary = require('cloudinary').v2;
const multer = require('multer');

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.cloudinaryCloudName,
  api_key: process.env.cloudinaryApiKey,
  api_secret: process.env.cloudinaryApiSecret,
});

// Configure multer for memory storage (we'll upload to Cloudinary manually)
const storage = multer.memoryStorage();

// Create multer upload middleware
const upload = multer({ 
  storage: storage,
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB limit
  },
  fileFilter: (req, file, cb) => {
    // Check file type
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  },
});

// Function to upload image from buffer (for multer uploads)
const uploadImageFromBuffer = async (buffer, options = {}) => {
  try {
    return new Promise((resolve, reject) => {
      cloudinary.uploader.upload_stream(
        {
          folder: 'online-store/products',
          transformation: [{ width: 800, height: 600, crop: 'limit' }],
          ...options,
        },
        (error, result) => {
          if (error) {
            reject({
              success: false,
              error: error.message,
            });
          } else {
            resolve({
              success: true,
              url: result.secure_url,
              public_id: result.public_id,
            });
          }
        }
      ).end(buffer);
    });
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Function to upload image directly (for programmatic uploads)
const uploadImage = async (imagePath, options = {}) => {
  try {
    const result = await cloudinary.uploader.upload(imagePath, {
      folder: 'online-store/products',
      transformation: [{ width: 800, height: 600, crop: 'limit' }],
      ...options,
    });
    return {
      success: true,
      url: result.secure_url,
      public_id: result.public_id,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

// Function to delete image from Cloudinary
const deleteImage = async (publicId) => {
  try {
    const result = await cloudinary.uploader.destroy(publicId);
    return {
      success: true,
      result,
    };
  } catch (error) {
    return {
      success: false,
      error: error.message,
    };
  }
};

module.exports = {
  cloudinary,
  upload,
  uploadImage,
  uploadImageFromBuffer,
  deleteImage,
};