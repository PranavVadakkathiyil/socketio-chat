import { Router } from "express";
import upload from '../middleware/Multer'
import { getCurrentUserInfo, loginUser, LogOut, registerUser, SearchUsers } from "../controllers/User.controller";
import UserVerify from "../middleware/UserVerify";
const router = Router()

router.route('/login').post( loginUser)

router.route('/register').post(upload.fields([{ name: 'avatar', maxCount: 1 }]),registerUser)

router.route('/logout').post(UserVerify,LogOut)

router.route('/getuser').get(UserVerify,getCurrentUserInfo)

router.route('/search').get(UserVerify,SearchUsers)



export default router