const userDB = {
    users: require("../model/users.json"),
    setUsers: function (data) {
      this.users = data;
    },
  };
  const express = require("express");
  
  const app = express();
  
  const jwt = require("jsonwebtoken");
  
  
  
  require("dotenv").config();
  
  const bodyParser = require("body-parser");
  
  app.use(bodyParser.json());
  
  const handleRefreshToken  = (req, res) => {
    const cookies=req.cookies
    if (!cookies?.jwt) {
      return res.sendStatus(401)
    }
    console.log(cookies.jwt )
    const refreshToken=cookies.jwt
  
    const foundUser = userDB.users.find((person) => person.refreshToken === refreshToken);
    if (!foundUser) {
      res.sendStatus(401).json({ message: "No such user exist" });
    }
    // Evaluate password
 
  
    // JWT auth
    jwt.verify(
        refreshToken,
        process.env.REFRESH_TOKEN_SECRET,
        (err,decode)=>{
            if(err || foundUser.username!==decode.username ) return res.sendStatus(403)
            const accessToken=jwt.sign(
                {"username":decode.username},
                process.env.ACCESS_TOKEN_SECRET,
                {expiresIn:"30s"}
            )
            res.json({accessToken})
        }
    )
    } 
  
  module.exports = { handleRefreshToken };
  