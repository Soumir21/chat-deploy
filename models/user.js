const mongoose=require("mongoose");
const bcrypt=require("bcryptjs")
const userSchema=new mongoose.Schema({
    name:{
        type: String,
        required:true
    },
    email:{
        type: String,
        required:true,
        unique:true
    },
    password:{
        type: String,
        required:true
    },
    pic:{
        type: String,
        default: "https://icon-library.com/images/anonymous-avatar-icon/anonymous-avatar-icon-25.jpg"
    }
},
{
    timestamps: true
})

userSchema.methods.matchPassword = async function(enteredPassword) {
    const isVerify = await bcrypt.compare(enteredPassword, this.password);
    return(isVerify)
};

userSchema.pre('save',async function(next){
    if(!this.isModified('password')){
        next()
    }
    else{
        const salt=await bcrypt.genSalt(10)
        this.password=await bcrypt.hash(this.password,salt)
        next()
    }
})
const User=new mongoose.model("User",userSchema);

module.exports=User