const Conversation = require('../models/messages')

const messageUploadDB = async(req,res)=>{
    const {message,receiverId} = req.body;
    // console.log(receiverId)
    const senderId = req.myId
    // console.log(senderId,"if user loggedin we get usr value")
    try{
        let messageInfo={
            from:senderId,
            message:message
        }
        // console.log(messageInfo,'check for from value')
const response = await Conversation.create({
    members:[senderId,receiverId],
    message:messageInfo, 
})
if(!response){
    return res.status(401).json({ message: "Unable to upload message", type: "error" });
}
res.json(response)
    }catch(error){
console.log(error)
res.status(500).json({message:'Something went wrong',type:'error'})
    }
}

module.exports = messageUploadDB