const express = require('express')
const PORT = process.env.PORT || 5000
const router = require('./routes/mainRoutes')
require('dotenv').config()
const cors = require('cors')
const errorMiddleware = require('./middlewares/errorMiddleware')

const app = express()
app.use(cors())
app.use(express.json())

//!  http://localhost:5000/map
app.use('/map', router)
app.use(errorMiddleware)

const start = async () => {
    try {
        app.listen(PORT, ()=>console.log(`App has been started on port: ${PORT}`))
    } catch (e) {
        console.log(`Server error: ${e.message}` )
        process.exit(1)
    }
}

start()