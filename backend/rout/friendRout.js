import express from "express";
import isLogin from "../middleware/isLogin.js";
import {
  addFriend,
  removeFriend,
  getFriends,
  getpendingFriends,
  acceptFriendRequest
} from "../routControlers/friendControler.js";
import { searchFriends } from "../routControlers/friendControler.js";

const router = express.Router();

router.post("/add/:friendId", isLogin, addFriend);
router.delete("/remove/:friendId", isLogin, removeFriend);
router.get("/getfs", isLogin, getFriends);
router.get("/search", isLogin, searchFriends);
router.get("/getpfs", isLogin, getpendingFriends);
router.put("/accept/:friendId", isLogin, acceptFriendRequest);

export default router;