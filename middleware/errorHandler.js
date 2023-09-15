const {customAPIError} = require('../errors/custom')
const errorHandler = (err, req,res,next) => {
    if(err instanceof customAPIError){
        return res.status(err.statusCode).json({success: false, message:err.message})
    }
    return res.status(500).json({success: false, message:'Something went wrong, please try again later'})
}
module.exports = errorHandler