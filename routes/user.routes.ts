import express from "express";
import { userAuth } from "../middleware/user.middleware";
const router = express.Router();
const { userSignUp, userSignIn,userDetails,updateUser, refreshUserToken } = require('../controllers/user.controller');

//user
router.post("/signup", userSignUp);
router.post("/signin", userSignIn);
router.get("/userdetails",userAuth, userDetails);
router.patch("/updateuser",userAuth, updateUser);


//refresh token
router.post("/refreshtoken", refreshUserToken);

module.exports = router;