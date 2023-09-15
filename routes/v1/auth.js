const express = require('express')
const router = express.Router()
const {logout} = require('../../controllers/user')

router.route('/logut').get(logout)
module.exports = router