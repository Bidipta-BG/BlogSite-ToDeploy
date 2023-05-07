const authorModel = require("../models/authorModel");
const jwt = require("jsonwebtoken");
require("dotenv").config();

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const loginUser = async function (req, res) {
  let user = await authorModel.findOne(req.body);
  if (!user)
    return res.status(400).send({
      status: false,
      message: "Bad Request. username or the password is not correct",
    });
  let token = jwt.sign(
    {
      userId: user._id.toString(),
      room: "23",
      Project: "BlogProject",
    },
    process.env.JWT_KEY,
    { expiresIn: "24h" }
  );
  res.setHeader("x-api-key", token);
  res.send({
    status: true,
    message: "Login Successfull",
    accessToken: token,
    id: user._id,
  });
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports.loginUser = loginUser;
