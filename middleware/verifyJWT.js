
const jwt = require("jsonwebtoken");
require("dotenv").config();

const verifyJWT=(req,res,next)=>{
    const authHeaders=req.headers["authorization"]
    if(!authHeaders) return  res.sendStatus(401)
   console.log(authHeaders)  //Bearer Token
   const token=authHeaders.split(" ")[1] //split will return a list of string and [1] shows the position of token 
   jwt.verify(
    token,
    process.env.ACCESS_TOKEN_SECRET,
    (err,decode)=>{
            if(err){
                return res.sendStatus(403) //Invalid token
            }
            req.user=decode.username
            next()

    }
    )

}
module.exports=verifyJWT