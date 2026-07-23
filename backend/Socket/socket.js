import {Server} from "socket.io";
import http from "http";
import express from "express";

const app = express();
const server = http.createServer(app);
const io = new Server(server,{
    cors: {
        origin: "https://lallichatapp.onrender.com",   //5172
        methods: ["GET", "POST"],
    },
});

export const getRecieverSocketId = (recieverId) => {
    return useSocketmap[recieverId];
};

const useSocketmap = {}; //{userId, socketId}

io.on("connection", (socket) => {
    const userId = socket.handshake.query.userId;

    if(userId !== undefined){
        useSocketmap[userId] = socket.id;
    }
    io.emit("getOnlineUsers", Object.keys(useSocketmap));
    socket.on("disconnect", () => {
        delete useSocketmap[userId];
        io.emit("getOnlineUsers", Object.keys(useSocketmap));
    });
});

export  {app, io,server};