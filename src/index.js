require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("./DB/index");
const app = require("../src/app")
const port = process.env.PORT || 8080;
connectDB()
.then(()=>{
    app.listen(port,()=>{
        console.log(`Server Running At Port ${process.env.PORT}`)
    })
})
.catch((err)=>{
    console.log("MongoDB Connection Failed",err);
})

