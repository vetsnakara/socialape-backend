const router = require("express").Router();
const { isAuthenticated } = require("../middlerare/auth");

const {
  getUserDetails,
  getAuthenticatedUser,
  uploadProfileImage,
  addUserDetails
} = require("../controllers/user");

router.get("/:handle", getUserDetails);
router.get("/", [isAuthenticated], getAuthenticatedUser);
router.post("/", [isAuthenticated], addUserDetails);
router.post("/image", [isAuthenticated], uploadProfileImage);

module.exports = router;
