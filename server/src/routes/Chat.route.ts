import { Router } from "express";
import UserVerify from "../middleware/UserVerify";
import { AddToChatGroup, ChangeGroupName, createChat, CreateGroup, getChat, RemoveFromChatGroup } from "../controllers/Chat.controller";
const router = Router()
router.route("/").post(UserVerify,createChat);
router.route("/").get(UserVerify,getChat);
router.route("/group").post(UserVerify,CreateGroup);
router.route("/rename").put(UserVerify,ChangeGroupName);
router.route("/groupremove").put(UserVerify,RemoveFromChatGroup);
router.route("/groupadd").put(UserVerify,AddToChatGroup);


export default router