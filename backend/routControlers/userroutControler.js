import User from "../Models/userModels.js";
import bcrypt from "bcryptjs";
import jwtToken from "../utils/jwtwebToken.js";

export const userRegister =async (req, res) =>{
    try{
        // console.log("user register");
        const {fullname ,username,email,gender,password,profilepic}= req.body;
        const user = await User.findOne({username , email});
        if(user) return res.status(500).send({success:false,message:"user already exist"});
        const hashedPassword = bcrypt.hashSync(password,10);
        const profileBoy = profilepic || "https://api.dicebear.com/9.x/adventurer/svg?seed=${username}";
        const profileGirl = profilepic || "https://api.dicebear.com/9.x/adventurer/svg?seed=${username}";
        const newUser = new User({
            fullname,
            username,
            email,
            gender,
            password:hashedPassword,
            profilepic: gender === "male" ? profileBoy : profileGirl
        });
        if(newUser){
            await newUser.save();
            jwtToken(newUser._id,res);
        }
        else{
            res.status(500).send({success:false,message:"user register failed"});
        }
        res.status(201).send({
            _id:newUser._id,
            fullname:newUser.fullname,
            username:newUser.username,
            email:newUser.email,
            gender:newUser.gender,
            profilepic:newUser.profilepic,
            success:true,
        })
    }

    catch(err){
        res.status(500).send({success:false,message:"Internal Server Error"});
        console.log(err);
    }
}

export const userLogin = async (req,res) =>{
    try{
        const {email ,password} = req.body;
        const user = await User.findOne({email});
        if(!user) return res.status(500).send({success:false,message:"user not found"});
        const comparePassword = bcrypt.compareSync(password,user.password || " ");
        if(!comparePassword) return res.status(500).send({success:false,message:"invalid password"});
        jwtToken(user._id,res);
        res.status(200).send({
            _id:user._id,
            fullname:user.fullname,
            username:user.username,
            email:user.email,
            gender:user.gender,
            profilepic:user.profilepic,
            message : "login successful",
            success:true,
        })
    }
     catch(err){
        res.status(500).send({success:false,message:"Internal Server Error"});
        console.log(err);
    }
}


export const userLogout = async (req,res) =>{
    try{
        res.cookie("jwt", "", { maxAge: 0 });
        res.status(200).send({
            message : "logout successful",
            success:true,
        })
    }
    catch(err){
        res.status(500).send({success:false,message:"Internal Server Error"});
        console.log(err);
    }
}