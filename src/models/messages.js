const mongoose = require('mongoose')

const messageSchema = new mongoose.Schema({
    from:{type:String,required:true},
    message:{type:String,required:true},
    status:{type:String,default:'unseen'}
},{timestamps:true})

const conversationSchema = new mongoose.Schema({
    members:{
type:[String],
required:true
    },
    message:[messageSchema]   
})

const Conversation= mongoose.model('Conversation',conversationSchema)

module.exports = Conversation