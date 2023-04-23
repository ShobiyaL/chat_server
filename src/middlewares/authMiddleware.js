
const {validateTokenFunc} = require('../utils/token')

const authMiddleware = async(req,res,next)=>{
    const tokenHeader = req.headers.authorization
    try{
        if(!tokenHeader){
            res.status(404).json({type:'error',message:'Not a valid request'})
        }
        const token = tokenHeader.split(' ')[1]
        // console.log(token,'token--')
        if(!token){
            res.status(404).json({type:'error',message:'token data missing'})
        }
        const payload = validateTokenFunc(token)
        // console.log(payload,"payload")
        if(!payload || typeof payload === String){
            return res.status(401).json({ message: "Signin again", type: "error" });
        }
        req.userObj = {
            username:payload.username,
            myId:payload.id
        }
        next()
    }catch (error) {
        console.log(error, " err-authCheckFunc");
        return res.status(500).json({ message: error.message, type: "error" });
      }

}

module.exports = authMiddleware