const express = require('express')

const router = express.Router()

const Register = require('../controllers/public/RegisterController')
const SignIn = require('../controllers/public/SigninController')

router.post('/user/register',Register)
router.post('/user/signin',SignIn)

module.exports= router