const router = require("express").Router();
const { getAll, getOne, createPost } = require("../controllers/post");
const { isAuthenticated } = require("../middlerare/auth");

router.get("/:postId", getOne);
router.get("/", getAll);
router.post("/", [isAuthenticated], createPost);

module.exports = router;
