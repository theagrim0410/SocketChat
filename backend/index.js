import express from 'express';
import dotenv from 'dotenv';
import dbConnect from './DB/dbConnect.js';
import authRouter from './rout/authUser.js';
import cookieParser from 'cookie-parser';
import messageRouter from './rout/messageRout.js';
import userRouter from './rout/userRout.js';
import path from 'path';
import {app, server} from './Socket/socket.js';

dotenv.config();
const __dirname = path.resolve();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(cookieParser());

app.use('/api/auth',authRouter);
app.use('/api/message', messageRouter);
app.use('/api/user', userRouter);

app.get('/', (req, res) => {
  res.send('ok beta');
});

app.use(express.static(path.join(__dirname, 'frontend/dist')));

app.use((req, res) => {
  res.sendFile(path.join(__dirname, 'frontend', 'dist', 'index.html'));
});

server.listen(PORT, () => {
    dbConnect(); 
    console.log(`Server is running on port ${PORT}`);
});