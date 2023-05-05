import { env } from "process";
import { v2 } from "cloudinary";

const cloudinary = v2;


// Configuration 
cloudinary.config({
  cloud_name: env.cloud_name,
  api_key: env.api_key,
  api_secret: env.api_secret
});

export default cloudinary;