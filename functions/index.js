const app = require("express")();
const morgan = require("morgan");

const { functions } = require("./services/firebase");
const setupRoutes = require("./routes");

app.use(morgan("tiny"));

setupRoutes(app);

exports.api = functions.https.onRequest(app);
