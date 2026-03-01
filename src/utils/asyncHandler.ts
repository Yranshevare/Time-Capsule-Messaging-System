const asyncHandler = (requestHandler:(req:any,res:any,next?:any)=>Promise<any>) => {
    return (req:any,res:any,next:any) => {
        Promise.resolve(requestHandler(req,res,next)).catch((error:any) => next(error))
    }
}

export {asyncHandler}