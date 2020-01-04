require("dotenv").config();

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

const postRouter = require("./routes/post");

admin.initializeApp();

const app = express();

app.use("/posts", postRouter);

app.use((req, res) => res.status(404).json({ message: "Not found" }));

exports.api = functions.https.onRequest(app);
