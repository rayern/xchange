const express = require('express')
const middleware = require('./middleware')
const cors = require('cors')
const v1auth = require('./v1/auth.js')
const v1static = require('./v1/static.js')
const router = express.Router()

const whitelist = ['http://127.0.0.1:8080']
const corsOptions = {
    origin: function (origin, callback){
        if(whitelist.indexof(origin) !== -1){
            callback(null, true)
        }
        else{
            callback(new Error('Not allowed by CORS'))
        }
    }
}

router.use(cors(corsOptions))
router.use(middleware.authenticate)

router.get('/home')

module.exports = router