import express from "express";
import {sendMessage} from "../routControlers/messageroutController.js";
import isLogin from "../middleware/isLogin.js";
import {getMessages} from "../routControlers/messageroutController.js";

const router = express.Router();

router.post('/send/:id',isLogin,sendMessage);
router.get('/:id',isLogin,getMessages);

export default router;