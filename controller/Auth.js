const bcrypt=require("bcrypt");
const User=require("../model/User");
const jwt=require("jsonwebtoken");
require('dotenv').config();
// signup route handler
signup=async(req,res)=>{
    try{
        // get data
        const {name,email,password,role}=req.body;
        // check if user already exist
        const existingUser=await User.findOne({email});
        if(existingUser){
            return res.status(400).json({
                success:false,
                message:'User already Exists',
            });
        }

        // secured password
        let hashedPassword;
        try{ 
            hashedPassword=await bcrypt.hash(password,10);
        }
        catch(err){
            return res.status(500).json({
                success:false,
                message:'Error in hashing password',
            })
        }

        // create entry fr user
        const user=await User.create({
            name,email,password:hashedPassword,role,
        })


        return res.status(200).json({
            success:true,
            messgae:'User created successfully',
        })
    }
    catch(err){
        console.error(err);
        return res.status(500).json({
            success:false,
            message:'User cannot be registered, please try again later',
        })
    }
}

// login route handler
login=async(req,res)=>{
    try{
    // get data
    const {email,password}=req.body;

    if(!email || !password)
    {
        return res.status(400).json({
            success:false,
            message:"Please fill all details",
        })
    }
        
    // check for registred user
        let user=await User.findOne({email});
        // if not a registered user
        if(!user)
        {
            return res.status(401).json({
                success:false,
                message:'User is not registered',
            })
        }

        // verify password and generate a jwt token
        const payload={
            email:user.email,
            id:user._id,
            role:user.role,
        }

        if(await bcrypt.compare(password,user.password))
        {
            // password matched
            let token=jwt.sign(payload,process.env.JWT_SECRET,
                {
                    expiresIn:"2h",
                });

            user=user.toObject();
            user.token=token;
            user.password=undefined;
            const options={
                expires:new Date(Date.now()+3*24*60*60*1000),
                httpOnly:true,
            }
            res.cookie("token",token,options).status(200).json({
                success:true,
                token,
                user,
                message:'User logged in successfully',
            });

            // res.status(200).json({
            //     success:true,
            //     token,
            //     user,
            //     message:'User logged in successfully'
            // })
        }
        else
        {
            // password do not match
            return res.status(403).json({
                success:false,
                message:'Password Incorrect',
            })
        }
    }

catch(err){
    console.log(err);
    return res.status(500).json({
        success:false,
        message:"Login Failure",
    })
}
}

module.exports={
    signup:signup,
    login:login
}