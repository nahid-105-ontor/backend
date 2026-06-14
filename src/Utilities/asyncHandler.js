const asyncHandler = (requestHandler) =>{
   return (req,res,next) => {
    Promise.resolve(requestHandler(req,res,next)).catch((error)=>next(error))
   }
}

module.exports = asyncHandler;


// const asyncHandler = (fn) => async (req,res,next) =>{
//     try{
//         await fn(req,res,next)
//     }
//     catch(error){
//         res.status(error.code||400).json({
//             success:false,
//             message:error.message
//         })
//     }
// }


// Higher Order Function
// const asyncHandler = ()=>{}
// const asyncHandler=(fn)=>()=>{}
// const asyncHandler=(fn)=> async () =>{}