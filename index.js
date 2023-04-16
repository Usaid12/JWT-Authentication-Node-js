const express = require("express");
const cors = require("cors");
const body_parser = require("body-parser");

const app = express();
const verifyJWT=require("./middleware/verifyJWT")
const cookieParser=require("cookie-parser")

const port = process.env.port || 3000;

app.use(cors());
app.use(body_parser.json());
app.use(cookieParser())
app.use("/register", require("./apis/register"));
app.use("/login", require("./apis/login"));
app.use("/refresh",require("./apis/refresh"))
app.use("/logout",require("./apis/logout"))
app.use(express.urlencoded({ extended: false }));
app.get("/", (req, res) => {
  res.send("Hello World");
});

app.listen(port, () => {
  console.log(` App running on http://localhost:${port}`);
});
