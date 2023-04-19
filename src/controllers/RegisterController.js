const User = require('../models/users')
const {encryptFunc} =require('../utils/hashFunction')

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

module.exports = Register