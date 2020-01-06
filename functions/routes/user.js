const router = require("express").Router();
const { fileUpload } = require("../controllers/user");
const { isAuthenticated } = require("../middlerare/auth");

router.post("/avatar-upload", [isAuthenticated], fileUpload);

module.exports = router;
