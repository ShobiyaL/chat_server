const getLastMessage = async(myId,fnId)=>{
    
    const messages = await Conversation.aggregate(
        [
            {
                $match:{
                    members:{$all:[myId,fnId]}
                }
            },
            // {
            //     $sort:{
            //         created_at:-1
            //     }
            // },
            {
                
                $project: {
                    "_id": 0,
                    // "members": 1,
                    // "result": {
                    //     $sortArray: {input: "$message", sortBy: {createdAt: -1}}
                    // }
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
  let response;
  for (let i=0;i<friends.length;i++){
    console.log(myId,'present user id', friends[i].id,friends[i].username,'id..,name')
    response = await getLastMessage(myId,friends[i].id) 
     
    fnd_msg = [...fnd_msg,{
        fnd_info:friends[i],
        message:response,
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