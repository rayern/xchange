export class CustomAPIError extends Error{
    constructor(message, statusCode){
        super(message)
        this.statusCode = statusCode
    }
}

export const createCustomError = (message,statusCode) => {
    throw new CustomAPIError(message,statusCode)
}
