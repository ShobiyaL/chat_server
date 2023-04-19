require('dotenv').config();

const app = require('./app');
const { dbConnect } = require('./config/database');
const port = process.env.PORT || 8002

dbConnect();
app.listen(port,()=>{
    console.log(`Server is running on port:${port}`)
})
