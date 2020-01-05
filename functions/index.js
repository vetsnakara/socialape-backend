const app = require("express")();
const { functions } = require("./services/firebase");
const setupRoutes = require("./routes");

setupRoutes(app);

exports.api = functions.https.onRequest(app);
