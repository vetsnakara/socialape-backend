const fbConfig = require("../config/firebase");

module.exports = filename =>
  `https://firebasestorage.googleapis.com/v0/b/${fbConfig.storageBucket}/o/${filename}?alt=media`;
