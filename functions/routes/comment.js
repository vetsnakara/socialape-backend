const router = require("express").Router();
const { createComment } = require("../controllers/comment");
const { isAuthenticated } = require("../middlerare/auth");

router.post("/:postId", [isAuthenticated], createComment);

module.exports = router;
