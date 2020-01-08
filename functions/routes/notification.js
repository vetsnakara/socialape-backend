const router = require("express").Router();
const { markNotificationsRead } = require("../controllers/notification");
const { isAuthenticated } = require("../middlerare/auth");

router.patch("/mark", [isAuthenticated], markNotificationsRead);

module.exports = router;
