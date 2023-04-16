const userDB = {
  users: require("../model/users.json"),
  setUsers: function (data) {
    this.users = data;
  },
};
const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const fsPromises = require("fs").promises;
const path = require("path");
const bcrypt = require("bcrypt");

app.use(bodyParser.json());

const handleNewUser = async (req, res) => {
  console.log(req.body);
  const { user, pwd } = req.body;
  if (!user || !pwd) {
    console.log(user, pwd);
    res.status(409).json({ message: "Username or password is required" });
  }
  //   Check for duplicate usernames in database
  const duplicate = userDB.users.find((person) => person.username === user);
  if (duplicate) {
    return res.sendStatus(409); // 409 --> Conflict
  }
  try {
    // Encrypt the password
    const hashedPassword = await bcrypt.hash(pwd, 10);
    // store the new user
    const newUser = { username: user, password: hashedPassword };
    userDB.setUsers([...userDB.users, newUser]);
    await fsPromises.writeFile(
      path.join(__dirname, "..", "model/users.json"),
      JSON.stringify(userDB.users)
    );
    console.log(userDB.users);
    res.status(201).json({ message: `User ${user} added succesfully ` });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = { handleNewUser };
