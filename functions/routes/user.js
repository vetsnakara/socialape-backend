const router = require("express").Router();
const { uploadProfileImage, addUserDetails } = require("../controllers/user");
const { isAuthenticated } = require("../middlerare/auth");

router.post("/", [isAuthenticated], addUserDetails);
router.post("/image", [isAuthenticated], uploadProfileImage);

module.exports = router;
