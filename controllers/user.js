const user = require('../models/User');
const asyncWrapper = require('../middleware/async')
const {createCustomError} = require('../errors/custom.js');
const login = asyncWrapper(async (req,res) => {
    const user = await User.findOne()
    if(!user){
        return next(createCustomError('Not found', 404))
        throw new Error('Not found')
    }
    return res.status(200).json({})
})
const logout = asyncWrapper(async (req,res) => {
    res.status(200).json({})
})
module.exports = {
    login, logout,
}