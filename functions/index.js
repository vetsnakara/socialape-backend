require("dotenv").config();

const functions = require("firebase-functions");
const firebase = require("firebase");
const admin = require("firebase-admin");
const app = require("express")();

// init app
admin.initializeApp();
firebase.initializeApp({
  apiKey: "AIzaSyB5p93VfBjO1cDeCPErBo3nXEax7v1hPGY",
  authDomain: "socialape-4ad65.firebaseapp.com",
  databaseURL: "https://socialape-4ad65.firebaseio.com",
  projectId: "socialape-4ad65",
  storageBucket: "socialape-4ad65.appspot.com",
  messagingSenderId: "642216794875",
  appId: "1:642216794875:web:95a6770f9f5ea33abf6e5e"
});

// setup routes
const postRouter = require("./routes/post");
const authRouter = require("./routes/auth");

app.use("/posts", postRouter);
app.use("/", authRouter);

// 404 route
app.use((req, res) => res.status(404).json({ message: "Not found" }));

exports.api = functions.https.onRequest(app);
