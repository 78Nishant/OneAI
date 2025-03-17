const Model=require('../model/auth.model');
const jwt=require('jsonwebtoken');
const User=Model.User;

const login=async(req,res)=>{   
    const {username,password}=req.body;
    try{
        const user=await User.findOne({
            username
        });
        if(!user){
            return res.status(400).json({
                message:"User not found"
            });
        }
        if(user.password!==password){
            return res.status(400).json({
                message:"Invalid credentials"
            });
        }
        return res.status(200).json({
            message:"Login successful"
        });
    }
    catch(err){
        console.log(err);
    }
    finally{
        res.end();
    }
}