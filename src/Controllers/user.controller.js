const asyncHandler =  require("../Utilities/asyncHandler");

const registerUser = asyncHandler(async(req,res)=>{
 res.status(200).json({
    message:"yes i am done"
 })
})
module.exports = registerUser;