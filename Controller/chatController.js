const expressAsyncHandler = require("express-async-handler");
const Chat = require("../models/chat");
const User = require("../models/user");

const accessChat=expressAsyncHandler(async(req,res)=>{
     const {userId}=req.body

     if(!userId){
        console.log("useID not provided")
        return res.status((400));
     }

     var isChat=await Chat.find({
        isGroupChat:false,
        $and:[
            {users:{$elemMatch:{$eq:req.user._id}}},
            {users:{$elemMatch:{$eq:userId}}},

        ],
     }).populate("users","-password").populate("latestMessage");

     isChat=await User.populate(isChat,{
        path:"latestMessage.sender",
        select:"name pic email"
     });

     if(isChat.length>0){
        res.send(isChat[0])
     }else{
        var chatData={
            chatName:"sender",
            isGroupChat:false,
            users:[req.user._id,userId]
        }
     }
     try{
        const createdChat=await Chat.create(chatData);
        const FullChat=await Chat.findOne({_id:createdChat._id}).populate("users","-password")
        res.status(200).send(FullChat)
    }
     catch(err){
        res.status(404);
        // throw new Error(err.message)
     }
})


const fetchChat=expressAsyncHandler(async(req,res)=>{
    try{
       
        const result=await Chat.find({users:{$elemMatch:{$eq:req.user._id}}})
        .populate("users","-password")
        .populate("groupAdmin","-password")
        .populate(
            {path:"latestMessage",
             populate:{
                path:"sender",
               select:"name pic email"
             } })
        .sort({updatedAt:-1});

        // const final=await User.populate(result,{
        //     path:"latestMessage.sender",
        //     select:"name pic email"
        // })
        
        // const final=await result.populate(result,{
        //     path:"latestMessage.sender",
        //     select:"name pic email"
        // })
        res.status(200).json(result);
        
    }catch(err){
        console.log(err);
    }
})

const createGroupChat=expressAsyncHandler(async(req,res)=>{
    if(!req.body.users || !req.body.name){
        return res.status(400).send({message:"please fill all the details"})
    }

    var users=JSON.parse(req.body.users);

    if(users.length<2){
        return res.status(400).json({message:"more than 2 users are required"})
    }

    users.push(req.user);

    try{
        const groupChat=await Chat.create({
            chatName:req.body.name,
            users:users,
            isGroupChat:true,
            groupAdmin:req.user,
        })

        const fullGroupChat=await Chat.findOne({_id:groupChat._id})
        .populate("users","-password")
        .populate("groupAdmin","-password");

        res.status(200).json(fullGroupChat)
    }catch(err){
        console.log(err)
    }
})


const renameGroup=expressAsyncHandler(async(req,res)=>{
    const {chatId, chatName}=req.body

    const updatedGroup= await Chat.findByIdAndUpdate(
        chatId,
        {
            $set:{chatName:chatName},
        },
        {
            new:true
        }
        
       
    )  
    .populate("users","-password")
    .populate("groupAdmin","-password");

    if(!updatedGroup){
        res.status(200).json("fauiled to update")
    }
    else{
        res.status(200).send(updatedGroup)
    }
})

const addToGroup=expressAsyncHandler(async(req,res)=>{
    const {chatId, userId}=req.body
    const updatedGroup= await Chat.findByIdAndUpdate(
        chatId,
        {
            $push:{users:userId}
        },
        {
            new:true
        }
    ).populate("users","-password")
    .populate("groupAdmin","-password");
    
    
    if(!updatedGroup){
        res.status(200).json("fauiled to update")
    }
    else{
        res.status(200).send(updatedGroup)
    }

})
const removeFromGroup=expressAsyncHandler(async(req,res)=>{
    const {chatId, userId}=req.body
    const updatedGroup= await Chat.findByIdAndUpdate(
        chatId,
        {
            $pull:{users:userId}
        },
        {
            new:true
        }
    ).populate("users","-password")
    .populate("groupAdmin","-password");
    
    
    if(!updatedGroup){
        res.status(200).json("fauiled to update")
    }
    else{
        res.status(200).send(updatedGroup)
    }

})
module.exports={accessChat,fetchChat,createGroupChat,renameGroup,addToGroup,removeFromGroup}