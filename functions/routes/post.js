const router = require("express").Router();
const { isAuthenticated } = require("../middlerare/auth");
const {
  getAll,
  getOne,
  createPost,
  deletePost
} = require("../controllers/post");

router.get("/:postId", getOne);
router.delete("/:postId", [isAuthenticated], deletePost);
router.get("/", getAll);
router.post("/", [isAuthenticated], createPost);

module.exports = router;
