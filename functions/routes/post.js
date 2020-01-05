const express = require("express");
const { getAll, create } = require("../controllers/post");
const { isAuthenticated } = require("../middlerare/auth");

const router = express.Router();

// get all posts
router.get("/", getAll);

// create new post
router.post("/", [isAuthenticated], create);

module.exports = router;
