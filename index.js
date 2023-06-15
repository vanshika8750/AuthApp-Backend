const express=require("express");
const app=express();

require('dotenv').config();
const PORT=process.env.PORT||4000;

app.use(express.json());
const dbConnect=require("./config/database");
dbConnect();

// router import and mount
const user=require("./routes/user");
app.use("/auth",user);

// activate the server
app.listen(PORT,()=>{
    console.log(`Server started at port ${PORT}`);
})