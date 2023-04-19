const express = require('express')
const cors = require('cors')

const app = express()

const publicRoute = require('./routes/public')
const privateRoute = require('./routes/private')
const authMiddleware = require('./middlewares/authMiddleware')

app.use(cors())
app.use(express.json())

app.use('/api/public',publicRoute)
app.use('/api/private',authMiddleware, privateRoute)

module.exports=app;