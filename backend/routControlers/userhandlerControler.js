import User from "../Models/userModels.js";
import Conversation from "../Models/conversationModels.js";

export const getUserBySearch = async (req, res) => {
  try {
    const search = req.query.search || '';
    const currentUserId = req.user.id;
    const user = await User.find({
        $and: [
            {
                $or: [
                    {
                        username: { $regex:'.*' + search + '.*', $options: 'i' }
                    },
                    {
                        fullname: { $regex:'.*' + search + '.*', $options: 'i' }
                    }
                ]
            },{
                _id: { $ne: currentUserId }
            }
        ]
    }).select("-password").select("email");

    res.status(200).json(user);
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}


export const getCurrentChatters = async (req, res) => {
  try {
    const currentUserId = req.user.id;
    const currentChatters = await Conversation.find({
        participants : currentUserId
    }).sort({
        updatedAt: -1
    });

    if(!currentChatters || currentChatters.length === 0) {
        return res.status(200).json([]);
    }

    const participantsids = currentChatters.reduce((ids, conversation) => {
        const otherParticipant = conversation.participants.filter(id => id.toString() !== currentUserId.toString());
        return [...ids, ...otherParticipant];
    }, []);

    const otherparticipantsids = participantsids.filter(id  => id.toString() !== currentUserId.toString());
    const user = await User.find({_id: { $in: otherparticipantsids }}).select("-password").select("-email");
    const users = otherparticipantsids.map(id => user.find(user => user._id.toString() === id.toString()));
    res.status(200).json(users);
  }

  catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}