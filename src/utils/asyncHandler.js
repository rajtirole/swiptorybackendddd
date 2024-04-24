const asyncHandler= (func)=> async (req,res,next)=>{
    try {
        return await func(req,res,next)    
    } catch (error) {
        return res.status(error.statusCode||500).json({
            success:false,
            data:error.data,
            error:error.error,
            message:error.message,
            stack:error.stack
        })
        
    }
    }
    export {asyncHandler}