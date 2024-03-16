function sendResponse(req, res){
    return res.status(res.locals.status || 200)
    .json({
        status: 'Exitoso',
        message: res.locals.message || '',
        data: res.locals.data || {}
    })
}

function sendError(err, req, res, next){
    const statusCode = err.statusCode || 500
    res.status(statusCode).json({
        status: 'error',
        message: err.message,
        error: {
            code: statusCode,
            description: err.description || "Ocurrió un error inesperado"
        }
    })
}

function handleError (errorMessage, errorStatus, errorDescription, next){
    const error = new Error(errorMessage)
    error.description = errorDescription
    error.statusCode = errorStatus
    return next(error)
}

function handleSuccess (message, data, req, res){
    res.locals.message = message
    res.locals.data = data
    return sendResponse(req, res)
}

module.exports = {sendResponse, sendError, handleError, handleSuccess}