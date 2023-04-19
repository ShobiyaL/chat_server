const jwt = require('jsonwebtoken')

const createTokenFunc = (payload)=>{
   return jwt.sign(payload,process.env.JWT_SECRET_KEY)
}

const validateTokenFunc = (token)=>{
    return jwt.verify(token, process.env.SECRET_STRING)
} 

module.exports={createTokenFunc,validateTokenFunc}