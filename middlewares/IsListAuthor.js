const wrapasync=require('../utils/wrapasync');
const List=require('../modules/lists');
module.exports.islistAuthor=wrapasync(async(req,res,next)=>{
  let {id}=req.params;
  const list=await List.findById(id);
  if(`${req.user._id}`!=`${list.owner}`){
    return res.send("unauthorise");
  }
  next();
})