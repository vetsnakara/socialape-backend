const router = require("express").Router();
const { like, unlike } = require("../controllers/like");
const { isAuthenticated } = require("../middlerare/auth");

router.post("/create/:postId", [isAuthenticated], like);
router.delete("/delete/:postId", [isAuthenticated], unlike);

module.exports = router;
