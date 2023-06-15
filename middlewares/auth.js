// we will make 3 middlweares i.e., auth,isStudent,isAdmin

const jwt=require("jsonwebtoken");
require("dotenv").config();

exports.auth=(req,res,next)=>{
    try{
        // extract jwt token
        const token=req.body.token;
        if(!token){
            return res.status(401).json({
                success:false,
                message:'Token missing',
            });
        }

        // verify the token
        try{
            const decode=jwt.verify(token,process.env.JWT_SECRET);
            req.user=decode;
        }
        catch(err){
            return res.status(401).json({
                success:false,
                message:'token is invalid',
            })
        }
        next();
    }
    catch(err){
        return res.status(401).json({
            success:false,
            message:'something went wrong while verifying the token',
        })
    }
}

exports.isStudent=(req,res,next)=>{
try{
    if(req.user.role!=="Student"){
        return res.status(401).json({
            success:false,
            message:'This is a protected route for students',
        })
    }
    next();
}
catch(err){
    return res.status(500).json({
        success:false,
        message:'User role is not matching',
    })
}
}

exports.isAdmin=(req,res,next)=>{
    try{
        if(req.user.role!=="Admin"){
            return res.status(401).json({
                success:false,
                message:'This is a protected route for admins',
            })
        }
        next();
    }
    catch(err){
        return res.status(500).json({
            success:false,
            message:'User role is not matching',
        })
    }
    }