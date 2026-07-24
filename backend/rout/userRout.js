import express from "express";
import isLogin from "../middleware/isLogin.js";
import { getUserBySearch } from "../routControlers/userhandlerControler.js";
import { getCurrentChatters } from "../routControlers/userhandlerControler.js";
import { deleteUser } from "../routControlers/userhandlerControler.js";

const router = express.Router();
// console.log("user route is running");
router.get('/search',isLogin , getUserBySearch);
router.get('/currentchatters', isLogin, getCurrentChatters);
router.delete('/delete/:id', deleteUser);

export default router;