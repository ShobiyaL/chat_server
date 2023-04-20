const express = require('express')

const router = express.Router()

const {messageUploadDB,getFriends} = require('../controllers/messageController')


router.post('/send-message',messageUploadDB)
router.get('/friends',getFriends)

module.exports= router