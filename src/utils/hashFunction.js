const bcrypt = require('bcrypt')

const encryptFunc = async(plainTextPswd)=>{
  const salt = await bcrypt.genSalt(10)
  const hashedPswd = await bcrypt.hash(plainTextPswd,salt)
//   console.log(hashedPswd)
  return hashedPswd;
}

const decryptFunc = async(plainTextPswd,hashedPswd)=>{
    const result = bcrypt.compare(plainTextPswd,hashedPswd)
    return result ? true : false
}

module.exports ={encryptFunc,decryptFunc}