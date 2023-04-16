const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const express = require("express");

const app = express();

const jwt = require("jsonwebtoken");

const cookieParser = require("cookie-parser");

const bcrypt = require("bcrypt");

require("dotenv").config();

const fsPromises = require("fs").promises;

const path = require("path");

const bodyParser = require("body-parser");

app.use(bodyParser.json());

const handleLogin = async (req, res) => {
  const { user, pwd } = req.body;
  console.log(req.body);
  if (!user || !pwd) {
    console.log(user, pwd);
    res.status(409).json({ message: "Username or password is required" });
  }

  const foundUser = userDB.users.find((person) => person.username === user);
  if (!foundUser) {
    console.log(foundUser);
    res.status(401).json({ message: "No such user exist" });
  }
  // Evaluate password
  const match = await bcrypt.compare(pwd, foundUser.password);

  // JWT auth
  if (match) {
    const accessToken = jwt.sign(
      { username: foundUser.username },
      process.env.ACCESS_TOKEN_SECRET,
      { expiresIn: "30s" }
    );
    const refreshToken = jwt.sign(
      { "username": foundUser.username },
      process.env.REFRESH_TOKEN_SECRET,
      { expiresIn: "1d" }
    );
    const otherUsers = userDB.users.filter(
      (person) => person.username !== foundUser.username
    );
    // Saving refresh token with the logged in user
    const currentUser = {...foundUser, refreshToken};
    userDB.setUsers([...otherUsers, currentUser]);
    await fsPromises.writeFile(path.join(__dirname, "..", "model","users.json"),
    JSON.stringify(userDB.users));

    
    res.cookie("jwt", refreshToken, {
      sameSite:"None",
      secure:true,
      httpOnly: true,
      maxAge: 24 * 60 * 60 * 1000,
    });
    res.status(200).json({ accessToken });
  } else {
    res.sendStatus(401).json({ message: "Incorrect password" });
  }
};

module.exports = { handleLogin };
