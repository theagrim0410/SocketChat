import Conversation from "../Models/conversationModels.js";
import Message from "../Models/messageSchema.js";
import { getRecieverSocketId ,io} from "../Socket/socket.js";
export const sendMessage = async (req,res) =>{
    try{
        const {message} = req.body;
        const {id : receiverId} = req.params;
        const senderId = req.user._id;

        let chats = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        });

        if(!chats){
            chats = await Conversation.create({
                participants:[senderId,receiverId]
            });
        }

        const newMessage = await Message.create({
            senderId,
            receiverId,
            message,
            conversationId:chats._id
        });
        if(newMessage){
            chats.messages.push(newMessage._id);
        }

        await Promise.all([chats.save(),newMessage.save()]);
        //Socket io 
        const receiverSocketId = getRecieverSocketId(receiverId);
        if(receiverSocketId){
            io.to(receiverSocketId).emit("newMessage", newMessage);
        }

        res.status(201).send(newMessage);

    }
    catch(err){
        res.status(500).send({success:false,message:"Internal Server Error"});
        console.log(err);
    }
}


export const getMessages = async (req,res) =>{
    try{
        const {id : receiverId} = req.params;
        const senderId = req.user._id;

        const chats = await Conversation.findOne({
            participants:{$all:[senderId,receiverId]}
        }).populate('messages');

        if(!chats){
            return res.status(404).send({success:false,message:"No messages found"});
        }
        const messages = chats.messages;
        res.status(200).send(messages);
    }
    catch(err){
        res.status(500).send({success:false,message:"Internal Server Error"});
        console.log(err);
    }
}


export const deleteConversation = async (req,res) =>{
    try{
        const {id : receiverId} = req.params;
        const senderId = req.user._id;
        const chats = await Conversation.findOneAndDelete({
            participants:{$all:[senderId,receiverId]}
        });
        if(!chats){
            return res.status(404).send({success:false,message:"No conversation found"});
        }
        const deletedMessages = await Message.deleteMany({conversationId:chats._id});
        if(!deletedMessages){
            return res.status(404).send({success:false,message:"No messages found"});
        }
        res.status(200).send({success:true,message:"Conversation deleted successfully"});
    }
    catch(err){
        res.status(500).send({success:false,message:"Internal Server Error"});
        console.log(err);
    }
}