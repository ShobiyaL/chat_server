const User = require('../../models/users');
const { decryptFunc } = require('../../utils/hashFunction');
const { createTokenFunc } = require('../../utils/token');


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

module.exports = SignIn