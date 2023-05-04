require('dotenv').config();
const app = require('./app');
const socket = require('socket.io')

const { dbConnect } = require('./config/database');
const port = process.env.PORT || 8002

dbConnect();

const server = app.listen(port,()=>{
    console.log(`Server is running on port:${port}`)
})

const io = socket(server,{
    cors:{
        origin:'*',
        credentials:true,
    }
})

let users=[];

const addUsers = (userId,socketId,userInfo)=>{
   
    const checkUser = users.some(u=>u.userId ===userId)
    
    if(!checkUser){
        users.push({
            userId,
            socketId,
            userInfo
        })
    }
}

const removeUser = (socketId)=>{
  users = users.filter(u => u.socketId !== socketId)
}

const findFriend = (id)=>{
    return users.find(u=> u.userId === id)
}

io.on('connection',(socket)=>{
    console.log('socket connected...',socket.id)

    socket.on('add-user',(userId,userInfo)=>{
        addUsers(userId,socket.id,userInfo)

        io.emit('get-user',users)
    })

    socket.on('send-message',(data)=>{
        // console.log(data,'message information..')
       const userFd = findFriend(data.members[0])
    //    console.log(userFd)
       if(userFd!==undefined){
        socket.to(userFd.socketId).emit('get-message',{
           members:[data.members[0],data.members[1]],
           message:{
            from:data.message.from,
            message:data.message.message
           }
        })
       }
    })

    socket.on('disconnect',()=>{
        removeUser(socket.id)
        io.emit('get-user',users)
    })

})


