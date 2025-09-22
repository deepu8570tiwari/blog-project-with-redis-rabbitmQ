const mongoose =require("mongoose");
const UserSchema=mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true
    },
    image:{
        type:String
    },
    bio:{
        type:String
    },
    instagram:{
        type:String
    },
    facebook:{
        type:String
    },
    linkedin:{
        type:String
    },
},{timestamp:true})
const User= mongoose.model("User",UserSchema)
module.exports=User;