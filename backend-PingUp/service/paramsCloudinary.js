import multer from "multer";
import generateCloudinaryStorage
 from "./cloudinaryUpload.js";


 const uploadAvatar = multer({
    storage: generateCloudinaryStorage((req,file)=>({
        folder: "PingUp/avatars",
        public_id: `avatar-${req.user.id}`,
        use_filename: true,
        unique_filename: false,
        overwrite: true,
        allowed_formats : ["jpg", "png"]
    }))
 }) 


 export default uploadAvatar