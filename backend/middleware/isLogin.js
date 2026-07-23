import express from "express";

import jwt from "jsonwebtoken";
import User from "../Models/userModels.js";

const isLogin = async (req,res,next) =>{
    try{
        // console.log(req.cookies.jwt);
        const token = req.cookies.jwt;
        // console.log(token);
        if(!token) return res.status(401).send({success:false,message:"unauthorized user"});
        const decode = jwt.verify(token,process.env.JWT_SECRET);
        if(!decode) return res.status(401).send({success:false,message:"unauthorized user"});
        const user = await User.findById(decode.userId).select("-password");
        if(!user) return res.status(401).send({success:false,message:"unauthorized user"});
        req.user = user;
        next();
    }
    catch(err){
        res.status(500).send({success:false,message:"Internal Server Error"});
        console.log(err, "middleware error");
    }
}

export default isLogin;