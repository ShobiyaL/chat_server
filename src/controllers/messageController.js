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

const getLastMessage = async (myId, fnId) => {
    const messages = await Conversation.aggregate([
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
          messageInfo: {
            $first: "$message",
          },
        },
      },
    ]);
    return messages;
  };
  
  const getFriends = async (req, res) => {
    const myId = req.myId;
  
    try {
      const friends = await User.find({ _id: { $ne: myId } });
      console.log(friends, "all users");
      
      let response = await getLastMessage(myId, 22);
      console.log(response);
     let friendsArr = response.map((fsArr)=>{
          return fsArr.members
      })
      let [a,b] = friendsArr
      console.log(a.concat(b))
      let c = a.concat(b)
      let friendsArray = c.filter((friend)=>{
        return friend !==myId
      })
      res.json({
response,
friendsArray
      });
    } catch (error) {
      console.log(error);
      res.status(500).json({ message: "Something went wrong", type: "error" });
    }
  };
  
 

module.exports = {messageUploadDB,getFriends};
