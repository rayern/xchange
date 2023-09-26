import {CustomAPIError} from '../errors/custom.js'
const errorHandler = (err,req,res,next) => {
    if(err instanceof CustomAPIError){
        return res.status(err.statusCode).json({success: false, message:err.message})
    }
    console.log(err)
    return res.status(500).json({success: false, message:'Something went wrong, please try again later'})
}
export default errorHandler