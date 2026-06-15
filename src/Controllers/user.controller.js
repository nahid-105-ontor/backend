const User = require("../Models/user.model");
const apiError = require("../Utilities/apiError");
const apiResponse = require("../Utilities/apiResponse");
const asyncHandler = require("../Utilities/asyncHandler");
const uploadOnCloudinary = require("../Utilities/fileUpload");

const generateAccessAndRefreshTokens = async (userId) => {
  try {
    const user = await User.findById(userId);
    const accessToken = user.generateAccessToken();
    const refreshToken = user.generateRefreshToken();
    user.refreshToken= refreshToken;
    await user.save({validateBeforeSave:false});
    return {accessToken,refreshToken};
  } catch (error) {
    throw new apiError(500, "Internal Server Error");
  }
};

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
  const existedUser = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (existedUser) {
    throw new apiError(409, "User with email and username Existed In Server");
  }
  const avaterLocalPath = req.files?.avatar?.[0]?.path;
  const coverImageLocalPath = req.files?.coverImage?.[0]?.path;
  if (!avaterLocalPath) {
    throw new apiError(409, "Avatar File Required");
  }
  if (!coverImageLocalPath) {
    throw new apiError(409, "Cover Image File Required");
  }

  const avatar = await uploadOnCloudinary(avaterLocalPath);
  const coverImage = await uploadOnCloudinary(coverImageLocalPath);

  if (!avatar) {
    throw new apiError(409, "Avatar Not Found");
  }
  if (!coverImage) {
    throw new apiError(409, "Cover Image Not Found");
  }

  const user = await User.create({
    fullname,
    avatar: avatar.url,
    coverImage: coverImage.url,
    email,
    password,
    username: username.toLowerCase(),
  });
  const createUser = await User.findById(user._id).select(
    "-password -refreshToken "
  );
  if (!createUser) {
    throw new apiError(500, "Something Went wrong while Creating User");
  }
  return res
    .status(201)
    .json(new apiResponse(201, createUser, "User Created Successfully"));
});

const loginUser = asyncHandler(async (req, res) => {
  // get details from frontend
  // search that user exists
  // compare password
  // generate tokens
  // set the tokens
  // send cookies
  // send response
  const { email, password, username } = req.body;
  if (!username || !email) {
    throw new apiError(404, "Username or email required");
  }
  const user = await User.findOne({
    $or: [{ username }, { email }],
  });
  if (!user) {
    throw new apiError(404, "No User Found on this Username and Email");
  }
  const isPasswordValid = await user.isPasswordCorrect(password);
  if (!isPasswordValid) {
    throw new apiError(404, "Incorrect Password.");
  }
const {accessToken,refreshToken}=await generateAccessAndRefreshTokens(user._id)
const loggedUser = await User.findById(user._id).select("-password -refreshToken");
const options = {
  httpOnly:true,
  secrue:true,
}
return res
.status(200)
.cookie("accessToken",accessToken,options)
.cookie("refreshToken",refreshToken,options)
.json(
  200,{
    user: loggedUser,
    accessToken,
    refreshToken,
  },
  "User Logged In Successfully "
);

});

const logoutUser = asyncHandler (async(req,res)=>{
  await User.findByIdAndUpdate(req.user._id,
    {
      $set:{
        refreshToken:undefined
      },
    },
    {
      new:true
    }
  ) 
  const options = {
  httpOnly:true,
  secrue:true,
}
return res
.status(200)
.clearCookie("accessToken",options)
.clearCookie("refreshToken",options)
.json(200,{},"User Logged Out Successfully")
})


module.exports = { registerUser, loginUser ,logoutUser };
