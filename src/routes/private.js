const express = require('express')

const router = express.Router()

const messageUploadDB = require('../controllers/messageController')

router.post('/send-message',messageUploadDB)

module.exports= router