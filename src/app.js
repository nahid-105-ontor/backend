const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const app = express();
const userRouter = require("./Routes/user.route")
app.use(cors({
    origin:process.env.CORS_ORIGIN,
    credentials:true
}))
app.use(express.json());
app.use(express.urlencoded());
app.use(express.static("public"));
app.use(cookieParser());

app.use("/api/v1/users",userRouter,)


module.exports = app;