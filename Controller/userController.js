const asyncHandler=require("express-async-handler")
const User=require("../models/user")
const generateToken=require("../config/generateToken")
const registerUser=asyncHandler(async(req,res)=>{

    const {name,email,password,pic}=req.body;

    if(!name || !email || !password){
          res.status(400)
        throw new Error("please enter all the detais")
    }

    const userExist=await User.findOne({email:email});
    if(userExist){
        res.status(400)
        throw new Error("Email already exists")
    }

    const user=await User.create(req.body);
    if(user){
         res.status(201).json({
            _id:user._id,
            name:user.name,
            email:user.email,
            password:user.password,
            pic:user.pic,
            token: await generateToken(user._id)
        })
    }
    else{
        res.status(400)
        throw new Error("user could not be created")
    }
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    if (!email || !password) {
        res.status(400);
        throw new Error("Please enter all the details");
    }

    const userExist = await User.findOne({ email: email });
    if (!userExist) {
        res.status(400);
        throw new Error("Email does not exist");
    }

    if(await userExist.matchPassword(password)){
        res.status(200).json({
            _id:userExist._id,
            name:userExist.name,
            email:userExist.email,
            pic:userExist.pic,
            token: await generateToken(userExist._id)
        })  
    }
    else{
        res.status(404).json({message:'wrong credentials'})
    }
});

const getUser=async(req,res)=>{
   const keyword=req.query.search?{
    $or:[
        {email:{$regex:req.query.search,$options:"i"}},
        {name:{$regex:req.query.search,$options:"i"}}
    ]
   }:{};
   const users=await User.find(keyword).find({_id:{$ne:req.user._id}})
   res.status(200).json(users);
}

const changePicture=async(req,res)=>{
    const {profilePic}=req.body;
    console.log(req.body)
   
   
    try{
        const userExist= await User.findByIdAndUpdate(req.user._id,{$set:{pic:profilePic}},{new:true});
        res.status(200).json({
            _id:userExist._id,
            name:userExist.name,
            email:userExist.email,
            pic:userExist.pic,
            token: await generateToken(userExist._id)
        })
    }catch(err){
        console.log(err)
    } 
}
module.exports={registerUser,loginUser,getUser,changePicture}
 // try{
    //     const result=await User.findById(req.user._id);
    //     res.status(200).json(result)
    // }catch(err){
    //     console.log(err)
    // }