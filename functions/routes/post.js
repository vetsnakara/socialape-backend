const express = require("express");
const { getAll, create } = require("../controllers/post");

const router = express.Router();

// get all posts
router.get("/", getAll);

// create new post
router.post("/", create);

module.exports = router;
