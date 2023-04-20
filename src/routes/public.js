const express = require('express')

const router = express.Router()

const {Register,SignIn} = require('../controllers/userController')

router.post('/user/register',Register)
router.post('/user/signin',SignIn)

module.exports= router