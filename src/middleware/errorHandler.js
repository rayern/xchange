import APIError from '../errors/apiError.js'
import db from '../models/index.js'

const errorHandler = async (err,req,res,next) => {
    if(err instanceof APIError){
        return res.status(err.statusCode).json({success: false, message:err.message})
    }
    console.log(err)
    await db.log.create({
        user_id: req.user?.id,
        ip_address: req.headers['x-forwarded-for']?.split(',').shift() || req.socket?.remoteAddress,        
        api_endpoint: req.originalUrl,
        message: err.message,
        details: err.stack
    })
    return res.status(200).json({success: false, message:'Something went wrong, please try again later'})
}
export default errorHandler