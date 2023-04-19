const express = require('express')

const router = express.Router()

const Register = require('../controllers/RegisterController')
const SignIn = require('../controllers/SigninController')

router.post('/user/register',Register)
router.post('/user/signin',SignIn)

module.exports= router