const User = require("../Models/user.model");
const apiError = require("../Utilities/apiError");
const apiResponse = require("../Utilities/apiResponse");
const asyncHandler = require("../Utilities/asyncHandler");
const uploadOnCloudinary = require("../Utilities/fileUpload");

const registerUser = asyncHandler(async (req, res) => {
  // get user details from frontend
  // validation - not empty
  // check if user already exists username,email
  // check for images ,check for avataar
  // upload them to cloudinari
  // create user object - create entry in db
  // remove password and refresh token field from response
  // check for user creation
  // return response

  const { fullname, email, username, password } = req.body;
  if (
    [fullname, email, username, password].some((field) => field?.trim() === "")
  ) {
    throw new apiError(400, "All Fields are Required");
  }
  const existedUser = User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apiError(409, "User with email and username Existed In Server");
  }
  const avaterLocalPath = req.files?.avatar[0]?.path;
  const coverImageLocalPath = req.files?.coverImage[0]?.path;
  if (!avaterLocalPath) {
    throw new apiError(409, "Avatar File Required");
  }
  if (!coverImageLocalPath) {
    throw new apiError(409, "Cover Image File Required");
  }

const avatar = await uploadOnCloudinary(avaterLocalPath);
const coverImage = await uploadOnCloudinary(coverImageLocalPath);

if(!avatar){
    throw new apiError(409,"Avatar Not Found");
}
if (!coverImage) {
  throw new apiError(409, "Cover Image Not Found");
}

const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage : coverImage.url,
    email, 
    password, 
    username :  username.toLowerCase()

})
const createUser = await User.findById(user._id).select(
  "-password -refreshToken "
);
if(!createdUser){
    throw new apiError(500,"Something Went wrong while Creating User");
}
return res.status(201).json(
    new apiResponse(201,createdUser,"User Created Successfully")
)

});
module.exports = registerUser;
