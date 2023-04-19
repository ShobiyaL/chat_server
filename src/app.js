const express = require('express')
const cors = require('cors')

const app = express()

const publicRoute = require('./routes/public')

app.use(cors())
app.use(express.json())

app.use('/api/public',publicRoute)

module.exports=app;