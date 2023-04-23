const express = require('express')
const app = express()
const cors = require("cors");



const publicRoute = require('./routes/public')
const privateRoute = require('./routes/private')
const authMiddleware = require('./middlewares/authMiddleware')

let corsOptions = {
    origin: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
    exposedHeaders: ['x-auth-token'],
    'Access-Control-Allow-Methods': 'OPTIONS,POST',
        'Access-Control-Allow-Credentials': true,
        'Access-Control-Allow-Origin': '*',
  };

app.use(cors(corsOptions))
app.use(express.json())

app.use('/api/public',publicRoute)
app.use('/api/private',authMiddleware, privateRoute)

module.exports = app;