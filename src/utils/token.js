const jwt = require('jsonwebtoken')

const createTokenFunc = (payload)=>{
   return jwt.sign(payload,process.env.JWT_SECRET_KEY)
}

const validateTokenFunc = (token)=>{
    return jwt.verify(token, process.env.JWT_SECRET_KEY)
} 

module.exports={createTokenFunc,validateTokenFunc}