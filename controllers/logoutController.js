const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const express = require("express");

const app = express();

const fsPromises = require("fs").promises;
const path = require("path");

require("dotenv").config();

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const handleLogout =async (req, res) => {
  // On client also delete the access token
  const cookies = req.cookies;
  if (!cookies?.jwt) {
    return res.sendStatus(204); //No Content
  }

  const refreshToken = cookies.jwt;
  // Is refresh token in db?
  const foundUser = userDB.users.find(
    (person) => person.refreshToken === refreshToken
  );
  if (!foundUser) {
    res.clearCookie("jwt", { httpOnly: true, sameSite:"None",secure:true});
   return  res.sendStatus(204)
  }
//   Delete refresh token in database
const otherUsers = userDB.users.filter(
    (person) => person.refreshToken !== foundUser.refreshToken
  );
  const currentUser={...foundUser,refreshToken:""}
  userDB.setUsers([...otherUsers,currentUser])
  await fsPromises.writeFile(
    path.join(__dirname,"..","model","users.json"),
    JSON.stringify(userDB.users)
  )
  res.clearCookie("jwt", { httpOnly: true, sameSite:"None",secure:true});
  res.sendStatus(204)
};

module.exports = { handleLogout };
