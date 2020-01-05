const firebase = require("firebase");
const admin = require("firebase-admin");
const functions = require("firebase-functions");

// set google app credentials
require("dotenv").config();

// itit firebase app
firebase.initializeApp(require("../config/firebase"));
admin.initializeApp();

module.exports = {
  firebase,
  admin,
  functions,
  db: admin.firestore()
};
