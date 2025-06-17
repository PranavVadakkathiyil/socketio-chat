
import { v2 as cloudinary } from 'cloudinary';
import dotenv from "dotenv";
import fs from 'fs'
dotenv.config(); 

cloudinary.config({
    api_key:process.env.CLOUDINARY_API_KEY,
    api_secret:process.env.CLOUDINARY_API_SECRTE,
    cloud_name:process.env.CLOUDINARY_NAME
})
const uploadToCloudinary = async(localfilepath:any)=>{
    
    try {
        if(!localfilepath) return null
        const uploadResult = await cloudinary.uploader
       .upload(
           localfilepath,{resource_type:"auto"}
       )
       
    fs.unlinkSync(localfilepath)
    return uploadResult
    } catch (error) {
        console.log("Cloudinary upload error ",error);
        fs.unlinkSync(localfilepath)
        
    }
      
    
}

const deleteFromCloudinary = async(imgUrl:string)=>{

    try {
        if(!imgUrl) return null
        const deleteResult = await cloudinary.uploader.destroy(imgUrl,{resource_type:"auto"})
    console.log(deleteResult);
    return true
    } catch (error) {
        console.log("Cloudinary delete error ",error);
        
    }
      
    
}

export {uploadToCloudinary,deleteFromCloudinary}