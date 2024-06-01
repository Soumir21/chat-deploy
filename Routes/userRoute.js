const express=require("express")
const router=express.Router();
const {registerUser, loginUser, getUser,changePicture}=require("../Controller/userController")
const jwtMiddleware=require("../middleware/jwtMiddleware");
router.route("/register").post(registerUser)
router.route("/login").post(loginUser)
router.route("/getuser").get(jwtMiddleware,getUser)
router.route("/profilepic").post(jwtMiddleware,changePicture)
// router.route("/").post(()=>)

module.exports=router