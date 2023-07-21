const express = require("express");
const router = express.Router();
const authorController = require("../controllers/authorController");
const blogController = require("../controllers/blogControllers");
const validator = require("../middleware/validations");
const authentication = require("../middleware/authentication");
const authorization = require("../middleware/authorization");
const login = require("../controllers/loginController");
const { uploadImage } = require("../firebase/uploadFile");

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

router.post(
  "/authors",
  validator.authorCreateValidator,
  authorController.createAuthor
);

router.post(
  "/blogs",
  authentication.authentication,
  validator.blogCreateValidator,
  authorization.authCreateBlog,
  blogController.createBlog
);

router.get("/getlatestblogs", authentication.authentication, blogController.getBlogs);

router.get("/blogs/:id", blogController.getBlogsById)

router.get("/allblogs", blogController.getBlogs);

router.get(
  "/blogsbyauthor",
  authentication.authentication,
  blogController.getBlogsByAuthor
);

router.get(
  "/blogsbyfilter",
  authentication.authentication,
  blogController.getBlogsByFilter
);

router.put(
  "/blogs/:blogId",
  authentication.authentication,
  authorization.authUpdateDelete,
  validator.updatevalidation,
  blogController.updateBlog
);

router.delete(
  "/blogs/:blogId",
  authentication.authentication,
  authorization.authUpdateDelete,
  blogController.deleteBlogId
);

router.delete(
  "/blogs",
  authentication.authentication,
  authorization.authDeleteByParams,
  blogController.deleteBlogIdAndQuery
);

router.get("/getfilteritems", blogController.getFilterItems);

//---------------Login---------

router.post("/loginUser", validator.loginvalidation, login.loginUser);

//--------------Upload Image-----------------
router.post("/uploadfile", uploadImage);

//>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>

module.exports = router;
