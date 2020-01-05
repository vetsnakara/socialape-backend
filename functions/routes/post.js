const router = require("express").Router();
const { getAll, create } = require("../controllers/post");
const { isAuthenticated } = require("../middlerare/auth");

// get all posts
router.get("/", getAll);

// create new post
router.post("/", [isAuthenticated], create);

module.exports = router;
