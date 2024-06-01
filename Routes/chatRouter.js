const express=require("express");

const jwtMiddleware=require("../middleware/jwtMiddleware");
const { accessChat, fetchChat, createGroupChat, renameGroup, addToGroup, removeFromGroup } = require("../Controller/chatController");

const router=express.Router();

router.route("/").post(jwtMiddleware,accessChat);

router.route("/").get(jwtMiddleware,fetchChat);

router.route("/group").post(jwtMiddleware,createGroupChat);

router.route("/renamegroup").put(jwtMiddleware,renameGroup);

router.route("/groupremove").put(jwtMiddleware,removeFromGroup);

router.route("/groupaddto").put(jwtMiddleware,addToGroup);

module.exports=router