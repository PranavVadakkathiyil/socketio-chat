import { Request, Response, NextFunction } from "express";
import jwt, { JwtPayload } from "jsonwebtoken";
import dotenv from "dotenv";
import User from "../models/User.model";

// Load env first
dotenv.config();
const JWT_SECRET = process.env.JWT_SECRTE;

interface UserRequest extends Request {
  userInfo?: any;
}

const UserVerify = async (req: UserRequest, res: Response, next: NextFunction) => {
  try {
    
    const token =
      req.cookies.accesstoken || req.header("Authorization")?.replace("Bearer ", "");

    

    if (!token) {
       res.status(401).json({ success: false, message: "Unauthorized: No token" });
       return
    }

    const decodedToken = jwt.verify(token, JWT_SECRET!) as JwtPayload;
    const user = await User.findById(decodedToken?._id).select("-password");

    if (!user) {
       res.status(401).json({ success: false, message: "No user found" });
       return
    }

    req.userInfo = user;
    next(); 
  } catch (err) {
    console.error("JWT verification error:", err);
     res.status(403).json({ success: false, message: "Invalid or expired token" });
     return
  }
};

export default UserVerify;
