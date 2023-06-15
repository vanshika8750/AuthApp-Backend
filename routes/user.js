const express=require("express");
const router=express.Router();

const {signup}=require("../controller/Auth");
const {login}=require("../controller/Auth");
const {auth,isStudent,isAdmin}=require("../middlewares/auth");

router.post("/login",login);
router.post("/signup",signup);

// testing protected routes for single middlewares
router.get("/test",auth,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to protected route of testong'
    });
});

// protected routes
router.get("/student",auth,isStudent,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to protected route of student'
    });
});

router.get("/admin",auth,isAdmin,(req,res)=>{
    res.json({
        success:true,
        message:'Welcome to protected route of admin'
    });
});

module.exports=router;