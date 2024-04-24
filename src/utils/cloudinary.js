import { v2 as cloudinary } from "cloudinary";
import fs, { fsyncSync } from "fs";
import { config } from "dotenv";
config()
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});
async function cloudinaryImageUploader(localFile) {
    //get file path in localfile to upload and return its url
  try {
    if (!localFile) return null;
    const response = await cloudinary.uploader.upload(localFile, {
      resource_type: "auto",
    });
    fs.unlinkSync(localFile);
    return response;
  } catch (error) {
    console.log("cloudinary file upload not success", error);
    fs.unlinkSync(localFile);
    return null;
  }
}
export default cloudinaryImageUploader;
