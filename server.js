const express = require('express')
const cors = require('cors')
require('express-async-errors')
require('dotenv').config()
const db = require('./models')
const apiRoutes = require('./routes/auth')
const staticRoutes = require('./routes/static')
const notFound = require('./middleware/notFound')
const errorHandler = require('./middleware/errorHandler')

const PORT = process.env.PORT || 3000
const app = express()


app.use(express.json())
app.use(express.urlencoded({extended: true}))
app.use('/api', apiRoutes)
app.use('/', staticRoutes)
app.use(notFound)
app.use(errorHandler)

db.sequelize.sync().then((req) => {
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`)
    })
})