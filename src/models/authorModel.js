const mongoose = require("mongoose");

const authorSchema = new mongoose.Schema(
  {
    fname: {
      type: String,
      required: true,
    },
    lname: {
      type: String,
      required: true,
    },
    title: {
      type: String,
      required: true,
      enum: ["Mr", "Mrs", "Miss"],
    },
    email: {
      type: String,
      required: true,
      unique: true,
      trim: true,
    },
    password: {
      required: true,
      type: String,
    },
    authorImage: { type: String, require: false }, // s3 link
  },
  { timestamps: true }
);

module.exports = mongoose.model("author", authorSchema);
