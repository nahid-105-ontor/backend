const User = require("../Models/user.model");
const apiError = require("../Utilities/apiError");
const asyncHandler = require("../Utilities/asyncHandler");
const jwt = require("jsonwebtoken");

const verifyJWT= asyncHandler(async(req,_,next)=>{
  try {
    const token = req.cookies?.accessToken || req.header("Authorization")?.replace("Brearer ","")
    if(!token){
      throw new apiError(401,"Unauthorized Request")
    }
    const decoded = await jwt.verify(token, proccess.env.ACCESS_TOKEN_SECRET)
    const user = await User.findById(decoded?._id).select("-password -refreshToken")
    if(!user){
  
      throw new apiError(401,"Invalid Access Token");
    }
    req.user = user;
    next()
  } catch (error) {
    throw new apiError(401,error?.message||"invalid access token");
  }
})

module.exports = verifyJWT;