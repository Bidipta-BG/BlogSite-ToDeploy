const blogModel = require("../models/blogModel");
// const authorModel = require("../models/authorModel")
const ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");
require("dotenv").config();

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const authCreateBlog = async function (req, res, next) {
  try {
    // check if token key is present in the header/cookies
    let token = req.headers["x-Api-key"];
    if (!token) token = req.headers["x-api-key"]; //convert key to small case because it will only accept smallcase

    // Checking if the token is creted using the secret key provided and decode it.
    let decodedToken = jwt.verify(token, process.env.JWT_KEY);

    //---------------Authorisation
    let userToBeModified = req.body.authorId; //storing the authorid entered in the request/postman body in a variable
    let userLoggedIn = decodedToken.userId; // storing the authorid from decoded token in a variable

    //userId comparision to check if the logged-in user is requesting for their own data.
    if (userToBeModified != userLoggedIn)
      //compared if enterd authorid and decoded token authorid is same or not
      return res.status(403).send({
        status: false,
        message:
          "Not Authorized. User logged is not allowed to modify the requested users data",
      });

    next();
  } catch (err) {
    res.status(500).send({
      message: "Serverside Errors. Please try again later",
      error: err.message,
    });
  }
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const authUpdateDelete = async function (req, res, next) {
  try {
    //-------token check--------

    // check if token key is present in the header/cookies
    let token = req.headers["x-Api-key"];
    if (!token) token = req.headers["x-api-key"]; //convert key to small case because it will only accept smallcase

    // Checking if the token is creted using the secret key provided and decode it.
    let decodedToken = jwt.verify(token, process.env.JWT_KEY);

    //Checking if the entered blog id in params/url is valid nor not
    let enteredBlogId = req.params.blogId;
    if (!ObjectId.isValid(enteredBlogId)) {
      return res
        .status(400)
        .send({ status: false, message: "Bad Request. BlogId invalid" });
    }

    // checking if the author trying to modify the documents belongs to his or not
    const searchBlog = await blogModel.findById(enteredBlogId);
    if (!searchBlog) {
      //check if document is present in DB, iif not found anything return error
      return res.status(404).send({
        status: false,
        message: "Page/Resource not found. Enter valid blog id",
      });
    }

    let userToBeModified = searchBlog.authorId; //storing the authorid from the blog document found by making the db call
    let userLoggedIn = decodedToken.userId; // storing the authorid from decoded token in a variable

    if (userToBeModified != userLoggedIn) {
      //comparing if authorid found from searched ddb blog document and decoded token authorid is same or not
      return res.status(403).send({
        status: false,
        message:
          "Not Authorized. User logged is not allowed to modify the requested users data",
      });
    }
    if (searchBlog.isDeleted == true) {
      //check if the document is already deleted
      return res.status(404).send({
        status: false,
        message:
          "Page/Resource not found. Blog Document doesnot exist. Already deleted",
      });
    }

    next();
  } catch (err) {
    res.status(500).send({
      message: "Serverside Errors. Please try again later",
      error: err.message,
    });
  }
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const authDeleteByParams = async function (req, res, next) {
  try {
    let token = req.headers["x-Api-key"];
    if (!token) token = req.headers["x-api-key"];

    let decodedToken = jwt.verify(token, process.env.JWT_KEY);

    let data = req.query;
    let authorId = data.authorId;
    let userLoggedIn = decodedToken.userId;

    //checking if entered filter is empty. If empty instead of deleting all docs, send an error message
    if (Object.keys(data).length === 0) {
      return res.status(400).send({
        status: false,
        message: "Bad Request. Please enter valid condition",
      });
    }
    if ("authorId" in data && !ObjectId.isValid(authorId)) {
      return res
        .status(400)
        .send({ status: false, message: "Bad Request. AuthorId invalid" });
    }
    if ("authorId" in data && authorId != userLoggedIn) {
      return res.status(403).send({
        status: false,
        message: "Not Authorised. You cannot delete this",
      });
    }

    next();
  } catch (err) {
    res.status(500).send({
      message: "Serverside Errors. Please try again later",
      error: err.message,
    });
  }
};

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports.authCreateBlog = authCreateBlog;
module.exports.authUpdateDelete = authUpdateDelete;
module.exports.authDeleteByParams = authDeleteByParams;
