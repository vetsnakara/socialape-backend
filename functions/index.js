require("dotenv").config();

const functions = require("firebase-functions");
const admin = require("firebase-admin");
const express = require("express");

admin.initializeApp();

const app = express();

app.get("/posts", async (req, res) => {
  try {
    const snap = await admin
      .firestore()
      .collection("posts")
      .orderBy("createdAt", "desc")
      .get();

    const posts = snap.docs.map(doc => {
      const { body, userHandle, createdAt } = doc.data();

      return {
        id: doc.id,
        body,
        userHandle,
        createdAt
      };
    });

    return res.json(posts);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.post("/posts", async (req, res) => {
  try {
    const { userHandle, body } = req.body;

    const newPost = {
      userHandle,
      body,
      createdAt: new Date().toISOString()
    };

    const doc = await admin
      .firestore()
      .collection("posts")
      .add(newPost);

    return res.json({ message: `document ${doc.id} created successfully` });
  } catch (error) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
});

app.use((req, res) => res.status(404).json({ message: "Not found" }));

exports.api = functions.https.onRequest(app);
