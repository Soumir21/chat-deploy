const asyncHandler=require("express-async-handler");
const Message = require("../models/messge");
const User = require("../models/user");
const Chat = require("../models/chat");
const { response } = require("express");
   const sendMessageController=asyncHandler(async(req,res)=>{
          const {content,chatId}=req.body;

             if(!content || !chatId){
                 console.log("Invalid data passed into the request")
                 return res.status(404)
             }

             var newMessage={
                 sender: req.user._id,
                 content:content,
                 chat:chatId
             }

             try{
                 var message=await Message.create(newMessage);
                 message=await message.populate("sender","name pic")
                 message=await message.populate("chat")
                 message=await User.populate(message,{
                     path:"chat.users",
                     select:"name pic email"
                 })

                 await Chat.findByIdAndUpdate(chatId,{
                    latestMessage: message
                 })

                 res.json(message)
             }catch(err){
                 res.status(400)
                    throw new Error(err.message)
             }
   })

const allMessagesController=asyncHandler(async(req,res)=>{
    try{
        const messages=await Message.find({chat:req.params.chatId})
        .populate("sender","name pic email")
        .populate("chat")
        res.json(messages)
    }catch(error){
        res.status(400)
        throw new Error(err);
    }
})

const deleteMessageController=asyncHandler(async(req,res)=>{
    try{
        await Message.findByIdAndDelete(req.body.id);
        res.status(200).json({msg:"deleted successfully"})
    }catch(err){
        res.status(400)
        throw new Error(err);
    }
})
module.exports={sendMessageController,allMessagesController,deleteMessageController}