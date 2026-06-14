const express = require("express");
const registerUser = require("../Controllers/user.controller");
const router = express.Router();

router.route("/register").post(registerUser)




module.exports=router;
