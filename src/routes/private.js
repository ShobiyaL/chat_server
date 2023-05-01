const express = require('express')

const router = express.Router()

const {messageUploadDB,getFriends,getMessages} = require('../controllers/messageController')


router.post('/send-message',messageUploadDB)
router.get('/friends',getFriends)
router.get('/get-messages/:id',getMessages)

module.exports= router