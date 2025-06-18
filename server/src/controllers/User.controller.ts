import { Request, Response } from "express";
import User from "../models/User.model";
import { uploadToCloudinary } from "../config/cloudinary";
import { UploadApiResponse } from "cloudinary";


interface AuhtRequest extends Request {
  userInfo?: any;
}
const AccessandRefreshToken = async (
  userId: string
): Promise<{ accesstoken: string; refreshtoken: string }> => {
  try {
    const user = await User.findById(userId);

    const accesstoken =  user.AccessToken();
    const refreshtoken =  user.RefreshToken();
    user.refreshToken = refreshtoken;
    await user.save();
    return { accesstoken, refreshtoken };
  } catch (error) {
    console.log(error);
    throw error;
  }
};
const registerUser = async (req: Request, res: Response): Promise<void> => {
  const { username, phone, password } = req.body;
  const avatarPath = (
    req.files as { [fieldname: string]: Express.Multer.File[] }
  )?.avatar?.[0].path;

  try {
    if (!username || !phone || !password) {
      res.status(400).json({ message: "All fileds required" });
      return;
    }
    const exisitUser = await User.findOne({ phone });
    if (exisitUser) {
      res.status(200).json({ message: "User Already Exist" });
      return;
    }
    let picurl: UploadApiResponse | null | undefined;
    if (avatarPath) {
      picurl = await uploadToCloudinary(avatarPath);
    }
    const user = await User.create({
      username,
      phone,
      password,
      avatar: picurl?.secure_url,
    });
    if (user) {
      const { accesstoken, refreshtoken } = await AccessandRefreshToken(
        user._id
      );

      const option = {
        httpOnly: true,
        secure: true,
      };
      res.status(201).cookie("accesstoken", accesstoken, option).json({
        message: "User Registerd Successfully",
        success: true,
        _id: user._id,
        username: user.username,
        phone: user.phone,
        avatar: user.avatar,
        token: accesstoken,
        
      });
    }
  } catch (error) {
    console.log("Register error", error);
  }
};
const loginUser = async (req: Request, res: Response): Promise<void> => {
  const { phone, password } = req.body;

  try {
    const user = await User.findOne({ phone });
    if (!user) {
      res.status(200).json({ message: "Please Signup" });
      return;
    }
    const checkPassword = await user.isPasswordCorrect(password);

    if (!checkPassword) {
      res.status(200).json({ message: "Password Incorrect" });
      return;
    }
    const option = {
      httpOnly: true,
      secure: true,
      
    };
    const { accesstoken, refreshtoken } = await AccessandRefreshToken(user._id);

    res.status(201).cookie("accesstoken", accesstoken, option).json({
      success: true,

      message: "Login Successfully",
      _id: user._id,
      username: user.username,
      phone: user.phone,
      avatar: user.avatar,
      token: accesstoken,
      
    });
  } catch (error) {
    console.log("Login error", error);
  }
};

const LogOut = async (req: AuhtRequest, res: Response) => {
  try {
    const user = req.userInfo?._id;
    if (!user) {
      res.status(200).json({ message: "Not Valid User" });
      return;
    }
    const option = {
      httpOnly: true,
      secure: true,
    };
    res.status(201).clearCookie("accesstoken", option).clearCookie("refresh", option).clearCookie("refreshtoken", option).json({
      success: true,
      message: "Logout success",
    });
  } catch (error) {
    console.log("Logout error", error);
  }
};





const getCurrentUserInfo = async (req: AuhtRequest, res: Response) => {
  try {
    const userId = req.userInfo?._id;

    if (!userId) {
       res.status(401).json({ success: false, message: "Unauthorized" });
       return
    }

  

    const userdata = await User.findById(userId).select("_id username phone avatar");

     res.status(200).json({
      success: true,
      userdata,
      
    });
    
  } catch (error) {
    console.log("Error in getCurrentUserInfo:", error);
     res.status(500).json({ success: false, message: "Internal Server Error" });
     return
  }
};
const SearchUsers = async(req: AuhtRequest, res: Response)=>{
  const searchData = req.query.search;
  const user_Id = req.userInfo
  
  
  if(!user_Id){
    res.status(400).json({success:false,message:"User Not Authenticated"})
    return
  }
  const searchresult = searchData ? {
     $or: [
          { username: { $regex: req.query.search, $options: "i" } },
          { phone: { $regex: req.query.search } },
        ]
  }
  :
  {}
  const user = await User.find({
    ...searchresult,_id:{$ne:user_Id}
  }).select("_id username phone avatar ");
  if(!user){
    res.status(400).json({success:false,message:"User Not Found"})
    return
  }
  res.status(200).json({
      success: true,
      user,
      
    });
}

export { registerUser, loginUser, LogOut ,getCurrentUserInfo,SearchUsers};