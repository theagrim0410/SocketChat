import Friend from "../Models/friendModels.js";
import User from "../Models/userModels.js";

export const addFriend = async (req, res) => {
  try {
    // const userId = req.user._id;
    const userId = req.user?.id;
    if (!userId) {
      console.log("User ID is not available in the request object.");
      return res.status(401).json({
        message: "Unauthorized user",
      });
    }
    const { friendId } = req.params;
    console.log("userId:", userId, "friendId:", friendId);
    if (userId === friendId) {
      return res.status(400).json({
        message: "You cannot add yourself.",
      });
    }

    const user = await User.findById(friendId);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const alreadyFriend = await Friend.findOne({
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    });

    if (alreadyFriend) {
      return res.status(400).json({
        message: "Already sent a request.",
      });
    }

    await Friend.create({
      userId,
      friendId,
      status: "pending",
    });

    res.status(201).json({
      message: "Friend request sent.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const removeFriend = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;
    console.log("userId:", userId, "friendId:", friendId);
    await Friend.findOneAndDelete({
      $or: [
        { userId, friendId },
        { userId: friendId, friendId: userId },
      ],
    });

    res.json({
      message: "Friend removed successfully.",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const getFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await Friend.find({
      $or: [{ userId }, { friendId: userId }],
      status: "accepted",
    })
      .populate("userId", "-password")
      .populate("friendId", "-password");
    console.log("Friends:", friends);
    const friendList = friends.map((friend) => {
      if (friend.userId._id.toString() === userId.toString()) {
        return friend.friendId;
      }

      return friend.userId;
    });

    res.status(200).json(friendList);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


export const getpendingFriends = async (req, res) => {
  try {
    const userId = req.user.id;

    const friends = await Friend.find({
      $or: [{ userId }, { friendId: userId }],
      status: "pending",
    })
      .populate("userId", "-password")
      .populate("friendId", "-password");
    console.log("Friends:", friends);
    const friendList = friends.map((friend) => {
      if (friend.userId._id.toString() === userId.toString()) {
        return friend.friendId;
      }

      return friend.userId;
    });

    res.status(200).json(friendList);
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};


export const acceptFriendRequest = async (req, res) => {
  try {
    const userId = req.user.id;
    const { friendId } = req.params;

    const request = await Friend.findOneAndUpdate(
      {
        userId: friendId,
        friendId: userId,
        status: "pending",
      },
      {
        status: "accepted",
      },
      {
        new: true,
      }
    );

    if (!request) {
      return res.status(404).json({
        message: "Friend request not found.",
      });
    }

    res.status(200).json({
      message: "Friend request accepted.",
      request,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error",
    });
  }
};

export const searchFriends = async (req, res) => {
  try {
    const search = req.query.search || "";
    const currentUserId = req.user.id;
    // console.log("Searching for:", search, "Current User ID:", currentUserId);
    // Get all accepted friends
    const friendships = await Friend.find({
      status: "accepted",
      $or: [
        { userId: currentUserId },
        { friendId: currentUserId }
      ]
    });

    // console.log("Friendships:", friendships);

    // Extract friend ids
    const friendIds = friendships.map(friend =>
      friend.userId.toString() === currentUserId.toString()
        ? friend.friendId
        : friend.userId
    );

    // console.log("Friend IDs:", friendIds);
    // Search only inside friends
    const friends = await User.find({
      _id: { $in: friendIds },
      $or: [
        { fullname: { $regex: search, $options: "i" } },
        { username: { $regex: search, $options: "i" } }
      ]
    }).select("-password");


    console.log("Search Results:", friends);
    return res.status(200).json(friends);

  }catch (err) {
    console.log(err);
    res.status(500).json({
      message: "Internal Server Error"
    });
  }
};