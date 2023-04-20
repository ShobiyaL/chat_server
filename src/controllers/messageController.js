const Conversation = require("../models/messages");
const User = require('../models/users')


const messageUploadDB = async (req, res) => {
  const { message, receiverId } = req.body;

  const senderId = req.myId;

  try {
    let messageInfo = {
      from: senderId,
      message: message,
    };

    let members = [receiverId, senderId];

    const filter = { members: { $all: members } };
    const update2 = {
      $addToSet: {
        members: members,
        message: messageInfo,
      },
    };

    let val = await Conversation.countDocuments(filter); // 0
    // console.log('val is =' ,val);
    let response;
    if (val === 0) {
      response = await Conversation.create({
        members: members,
        message: messageInfo,
      });
    } else {
      response = await Conversation.findOneAndUpdate(filter, update2, {
        new: true,
        upsert: true, // Make this update into an upsert
      });
    }

    if (!response) {
      return res
        .status(401)
        .json({ message: "Unable to upload message", type: "error" });
    }
    res.json(response);
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Something went wrong", type: "error" });
  }
};

const getLastMessage = async(myId,fnId)=>{
    
    const messages = await Conversation.aggregate(
        [
            {
                $match:{
                    members:{$all:[myId,fnId]}
                }
            },
            {
                $sort:{
                    created_at:-1
                }
            },{
                /**
                 * specifications: The fields to
                 *   include or exclude.
                 */
                $project: {
                    "_id": 0,
                    // "members": 1,
                    "result": {
                        $sortArray: {input: "$message", sortBy: {created_at: -1}}
                    }
                }
            },
        ]    
    )
    return messages
}

const getFriends = async(req,res)=>{
   const myId = req.myId;
   let fnd_msg =[]
   try{
const friends = await User.find({_id:{$ne:myId}})
 console.log(friends,'all users') 
let msg;
for (let i=0;i<friends.length;i++){
    console.log(myId,'present user id', friends[i].id,friends[i].username,'id..,name')
    msg = await getLastMessage(myId,friends[i].id) 
     
    fnd_msg = [...fnd_msg,{
        fnd_info:friends[i],
        msgInfo:msg
}]
}
//  console.log(msg,'all msgs')
 console.log(fnd_msg)
res.json(fnd_msg)
   }catch(error){
    console.log(error)
    res.status(500).json({ message: "Something went wrong", type: "error" });
   }
}

module.exports = {messageUploadDB,getFriends};
