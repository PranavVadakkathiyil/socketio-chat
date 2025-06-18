import { Router } from "express";
import UserVerify from "../middleware/UserVerify";
import { GetAllMessages, SendMessage } from "../controllers/Message.controller";

const router = Router();

router.route("/").get(UserVerify, GetAllMessages);
router.route("/").post(UserVerify, SendMessage);

export default router