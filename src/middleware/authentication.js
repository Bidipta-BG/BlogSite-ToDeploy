const jwt = require("jsonwebtoken");
require("dotenv").config();

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const authentication = async function (req, res, next) {
  try {
    // check if token key is present in the header/cookies
    let token = req.headers["x-Api-key"];
    if (!token) token = req.headers["x-api-key"]; //convert key to small case because it will only accept smallcase

    //If no token is present in the request header return error
    if (!token)
      return res
        .status(400)
        .send({
          status: false,
          message: "Bad Request. Please login again to generate the token",
        });

    //>>>>>>>>>>>>>>>>Authentication

    // Checking if the token is creted using the secret key provided and decode it.
    let decodedToken = jwt.verify(token, process.env.JWT_KEY);

    // if cannot verify, will return error
    if (!decodedToken)
      return res
        .status(401)
        .send({
          status: false,
          message:
            "Authentication Missing. Login is required. Token is invalid",
        });

    next();
  } catch (err) {
    res
      .status(500)
      .send({
        message: "Serverside Errors. Please try again later",
        error: err.message,
      });
  }
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports.authentication = authentication;
