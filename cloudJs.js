const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');


cloudinary.config({
  cloud_name:process.env.cloud_name,
  api_key:process.env.cloud_Key,
  api_secret:process.env.cloud_Secret,
});
const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
      folder: 'Wonderlust',
      formats: ['png','jpg','jpeg'],
    },
  });
  module.exports={storage,cloudinary}
   