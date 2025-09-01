const userModel = require('./../models/user.model')
const jwt = require('jsonwebtoken')
const bcrypt = require('bcryptjs')


const registerController = async (req , res) => {
    const {username , password} = req.body;

    const isUserExist = await userModel.findOne({username});

    if(isUserExist){
        return res.status(400).json({
            message : "User already exist."
        })
    }
 

    const user = await userModel.create({username ,
        password : await bcrypt.hash(password , 10)
    });

       const token = jwt.sign(
        {id: user._id}
        , process.env.JWT_SECRET);

        res.cookie("token",token);

    return res.status(201).json({
        message : "User registered successfully",
        user
    })
    
}

const loginController = async (req , res) => {
    const {username , password} = req.body;

    const user = await userModel.findOne({username});

    if(!user){
        return res.status(400).json({
            message : "User not found."
        })
    }

    const isPasswordValid = await bcrypt.compare(password , user.password);

    if(!isPasswordValid){
        return res.status(400).json({
            message : "Invalid password."
        });
    }

    const token = jwt.sign({id: user._id}, process.env.JWT_SECRET)

    res.cookie("token",token);
    
    res.status(200).json({
        message : "User logged in successfully",
        user : {
            username : user.username,
            _id : user._id // Use _id directly
        }
    })
}

const getMeController = async (req, res) => {
    try {
        const user = await userModel.findById(req.user._id).select('-password');
        if (!user) {
            return res.status(404).json({ message: "User not found." });
        }
        res.status(200).json({ user });
    } catch (error) {
        console.error("Error fetching user data:", error);
        res.status(500).json({ message: "Failed to fetch user data", error: error.message });
    }
};

module.exports = {
    registerController,
    loginController,
    getMeController
}