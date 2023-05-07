const authorModel = require("../models/authorModel");
const ObjectId = require("mongoose").Types.ObjectId;

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

const authorCreateValidator = async function (req, res, next) {
  try {
    let data = req.body;

    // Check all the mandatory fields are present in the request body.
    if (
      !(
        "fname" in data &&
        "lname" in data &&
        "title" in data &&
        "email" in data &&
        "password" in data
      )
    ) {
      return res.status(400).send({
        status: false,
        message: "Bad Request. All field is mandatory",
      });
    }

    // Checks the length of first name and last name.
    if (data.fname.trim().length < 3 || data.lname.trim().length < 2) {
      return res.status(400).send({
        status: false,
        message:
          "Bad Request. First name and last name should be of valid length",
      });
    }

    // Check if title is in correct enum
    if (data.title !== "Mr" && data.title !== "Mrs" && data.title !== "Miss") {
      return res.status(400).send({
        status: false,
        message: "Bad Request. Title must only have 'Mr','Mrs' or 'Miss'",
      });
    }

    // Check the validation of email
    if (!/^\w+([\.-]?\w+)@\w+([\.-]?\w+)(\.\w{2,3})+$/.test(data.email)) {
      return res.status(400).send({
        status: false,
        message: "Bad Request. Email should be a valid email address",
      });
    }

    // Check password validation
    if (
      !/^(?=.*\d)(?=.*[a-z])(?=.*[A-Z])(?=.*[^a-zA-Z0-9])(?!.*\s).{4,15}$/.test(
        data.password
      )
    ) {
      return res.status(400).send({
        status: false,
        message:
          "Bad Request. Password should be a combination of at least one lowercase letter, one uppercase letter, one numeric digit, and one special character",
      });
    }

    // Check if the entered email is already present in the Database
    let dbData = await authorModel.find({ email: data.email });
    if (dbData.length != 0) {
      //check if any document is returned from DB call
      return res.status(400).send({
        status: false,
        message:
          "Bad Request. This email already exist. Please enter another email",
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

const loginvalidation = async function (req, res, next) {
  try {
    let body = req.body;
    if (!("email" in body && "password" in body)) {
      return res
        .status(400)
        .send({ status: false, message: "All field is mandatory" });
    }
    if (body.email.length == 0 || body.password.length == 0) {
      return res.status(400).send({
        status: false,
        message: "This fields are required. Cannot be empty",
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

const blogCreateValidator = async function (req, res, next) {
  try {
    let body = req.body; //capturing the data in body variable

    // check if every madatory field is enterd in the request/postman body
    if (
      !(
        "title" in body &&
        "body" in body &&
        "category" in body &&
        "authorId" in body &&
        "blogImage" in body
      )
    ) {
      return res.status(400).send({
        status: false,
        message: "Bad Request. All field is mandatory",
      });
    }

    // check if enterd title length is less than 4 character
    if (body.title.trim().length < 4) {
      return res.status(400).send({
        status: false,
        message: "Bad Request. Title must be atleast 4 character",
      });
    }

    // check if enterd body length is atleast 5 character
    if (body.body.trim().length < 4) {
      return res.status(400).send({
        status: false,
        message: "Bad Request. Body must have some words",
      });
    }

    // check if entered body, category and authorId is blank or empty
    if (body.category.trim().length == 0 || body.authorId.trim().length == 0) {
      return res.status(400).send({
        status: false,
        message: "Bad Request. All fields must have a valid entry",
      });
    }

    // check if tags named key is in request/postman body, and if present it should not be blank
    if ("tags" in body && body.tags.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Bad Request. Tags cannot be empty" });
    }

    // check if sub category named key is in request/postman body, and if present it should not be blank
    if ("subcategory" in body && body.subcategory.length == 0) {
      return res.status(400).send({
        status: false,
        message: "Bad Request. Subgategory cannot be empty",
      });
    }

    // Objectid is a moongoose module/package that check if a enterd object id is valid or not.(Check the length)
    if (!ObjectId.isValid(body.authorId)) {
      // returns boolean. if not true than return invalid
      return res
        .status(400)
        .send({ status: false, message: "Bad Request. AuthorId invalid" });
    }

    // checks if the author id is resigterd in the DB
    searchAuthId = await authorModel.findById(body.authorId);
    if (!searchAuthId) {
      //if author id not found in DB, cannot create a blog
      return res
        .status(404)
        .send({ message: "User Not found. Please create an account" });
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

const updatevalidation = async function (req, res, next) {
  try {
    let body = req.body;

    // check if title named key is in request/postman body, and if present it should not be blank
    if ("title" in body && body.title.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Bad Request. Title cannot be empty" });
    }

    //check if enterd title length is less than 4 character. Else send an error
    if (body.title.trim().length < 4) {
      return res.status(400).send({
        status: false,
        message: "Bad Request. Title must be atleast 4 character",
      });
    }

    //check if body named key is in request/postman body, and if present it should not be blank
    if ("body" in body && body.body.trim().length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Bad Request. Body cannot be empty" });
    }

    // check if tags named key is in request/postman body, and if present it should not be blank
    if ("tags" in body && body.tags.length == 0) {
      return res
        .status(400)
        .send({ status: false, message: "Bad Request. Tags cannot be empty" });
    }

    // check if subcategory named key is in request/postman body, and if present it should not be blank
    if ("subcategory" in body && body.subcategory.length == 0) {
      return res.status(400).send({
        status: false,
        message: "Bad Request. Subgategory cannot be empty",
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

module.exports.authorCreateValidator = authorCreateValidator;
module.exports.loginvalidation = loginvalidation;
module.exports.blogCreateValidator = blogCreateValidator;
module.exports.updatevalidation = updatevalidation;
