require('dotenv').config();
const app = require('./app');
const socket = require('socket.io')

const { dbConnect } = require('./config/database');
const port = process.env.PORT || 8002

dbConnect();

const server = app.listen(port,()=>{
    console.log(`Server is running on port:${port}`)
})

// const io = socket(server,{
//     cors:{
//         origin:'http://localhost:3000',
//         credentials:true,
//     }
// })

// global.onlineUsers = new Map()

// io.on('connection',(socket)=>{
//     console.log('connected socket')
//     global.chatSocket = socket;
//     socket.on('add-user',(userId)=>{
//         onlineUsers.set(userId,socket.id)
//     })
//     socket.on('send-msg',(data)=>{
//         const sendUserSocket = onlineUsers.get(data.to)
//         if(sendUserSocket){
// socket.to(sendUserSocket).emit('msg-recieved',data.message)
//         }
//     })
// })