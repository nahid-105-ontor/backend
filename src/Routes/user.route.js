const express = require("express");
const {registerUser,loginUser , logoutUser} = require("../Controllers/user.controller");
const upload = require("../Middlewares/multer.middleware");
const verifyJWT = require("../Middlewares/auth.middleware");
const router = express.Router();

router.route("/register").post(
  upload.fields([
    {
      name: "avatar",
      maxCount: 1,
    },
    {
        name:"coverImage",
        maxCount:1
    },
  ]),
  registerUser
);

router.route("/login").post(loginUser)


//secured Routes
router.route("/logout").post(verifyJWT,logoutUser)


module.exports = router;
