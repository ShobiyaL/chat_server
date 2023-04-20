const User = require('../models/users')
const {encryptFunc} =require('../utils/hashFunction')
const { decryptFunc } = require('../utils/hashFunction');
const { createTokenFunc } = require('../utils/token');

const Register =async (req,res)=>{
    const {username,email,password} = req.body;
    // console.log(password,'check initially')
    try{
        if(!username || !email || !password){
            return res.status(403).json({
                type:'error',
                message:'Fields should mnot be empty'
            })
        }
        const userExists = await User.findOne({email})
        if(userExists){
            res.status(400)
        .json({message:'we already have an account with that email address'})
        }
        const newPassword = await encryptFunc(password)
        // console.log(newPassword,'after hashing the passsword')
        const user = await User.create({
            username,
            email,
            password:newPassword
        })
        if(!user){
            return res.status(403).json({
                type:'error',
                message:'Provide valid details'
            })
        }
        res.json({
            type:'success',
                message:'User created successfully',
                user
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            type:'error',
            message:`${error.message}--Problem in SignUp`,
            error
        })
    }
}


const SignIn = async(req,res)=>{
    const {email,password} = req.body;
    try{
        if(!email|| !password){
            return res.status(403).json(
                {
                    type:'error',
                    message:'Fields shuld not be empty'
                }
            )
        }
        const user = await User.findOne({email})
if(!user){
    return res
    .status(401)
    .json({ message: "wrong credentials",type:"error" });
}
const validUser = await decryptFunc(password,user.password)
if(!validUser){
    return res
    .status(401)
    .json({ message: "wrong credentials",type:"error" });
}

const payload = {
    email:user.email,
        username:user.username,
        id:user._id,      
}

const token = createTokenFunc(payload)
// console.log(token)
        res.json({
            token,
            type:'success',
             message:'User loggedin successfully',
            user, 
        })
    }catch(error){
        console.log(error)
        res.status(500).json({
            type:'error',
            message:`${error.message}--Problem in logging in`,
            error
        }) 
    }
}



module.exports = {Register,SignIn}