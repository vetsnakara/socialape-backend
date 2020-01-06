const router = require("express").Router();
const { isAuthenticated } = require("../middlerare/auth");

const {
  uploadProfileImage,
  addUserDetails,
  getAuthenticatedUser
} = require("../controllers/user");

router.post("/", [isAuthenticated], addUserDetails);
router.get("/", [isAuthenticated], getAuthenticatedUser);
router.post("/image", [isAuthenticated], uploadProfileImage);

module.exports = router;
