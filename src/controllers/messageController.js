const Conversation = require("../models/messages");
const User = require("../models/users");

const messageUploadDB = async (req, res) => {
  const { message, receiverId } = req.body;

  const {myId,username} = req.userObj;
// console.log(username)
  try {
    let messageInfo = {
      from: username,
      message: message,
    };

    let members = [receiverId, myId];

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

const getLastMessage = async (myId) => {
  const response = await Conversation.aggregate([
    {
      $match: {
        members: { $in: [myId] },
      },
    },
    {
      $unwind: "$message",
    },
    {
      $sort: {
        "message.createdAt": -1,
      },
    },
    {
      $group: {
        _id: "$_id",
        members: {
          $first: "$members",
        },
        message: {
          $first: "$message",
        },
        
      },
    },
  ]);

  const newResponse = await Promise.all(response.map(async (item) => {
    const {members,message}=item;
   
    const {updatedAt,...rest}= message;
    
    const index = members.indexOf(myId);
    //  console.log(index);
    members.splice(index,1);
    const membersName = await  User.find({_id:members[0]})
    //  console.log(membersName[0].username)
    console.log(membersName)
     const val = { 
      'members':membersName[0].username,
      'receiverId':membersName[0]._id,
       ...rest 
      };
   return val  
}));
  return newResponse;
};

const getFriends = async (req, res) => {
  const myId = req.userObj.myId;

  try {
    const friends = await User.find({ _id: { $ne: myId } });
    // console.log(friends, "all users");
    
    const response = await getLastMessage(myId);
    //  console.log(response);
    
    res.json({
      response,
    });

  } catch (error) {
    console.log(error);
    
    res.status(500).json({ message: "Something went wrong", type: "error" });
  }
};

const getMessages = async (req,res)=>{
  const myId = req.userObj.myId
  const receiverId = req.params.id
  try {
    const response = await Conversation.aggregate(
      [
        {
          $match:{
            members:{$all:[myId,receiverId]}
          }
        },
        {
          $project:{
            _id:0,
          }
        },
      
      ]
    )
    console.log(response)
    const receiverDetails = await User.findById(receiverId)

    res.json({ type:'success',convs:response });
  } catch (error) {
    res.status(500).json({ message: "Something went wrong", type: "error" });
  }
}


module.exports = { messageUploadDB, getFriends,getMessages };
