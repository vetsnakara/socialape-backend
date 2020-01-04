require("dotenv").config();

const functions = require("firebase-functions");
const admin = require("firebase-admin");

admin.initializeApp();

exports.getPosts = functions.https.onRequest((req, res) => {
  admin
    .firestore()
    .collection("posts")
    .get()
    .then(snap => {
      const posts = snap.docs.map(doc => doc.data());
      return res.json(posts);
    })
    .catch(err => console.log(err));
});

exports.createPost = functions.https.onRequest((req, res) => {
  if (req.method !== "POST") {
    return res.status(400).json({ error: "Method is not allowed" });
  }

  const { userHandle, body } = req.body;

  const newPost = {
    userHandle,
    body,
    createdAt: admin.firestore.Timestamp.fromDate(new Date())
  };

  admin
    .firestore()
    .collection("posts")
    .add(newPost)
    .then(doc => {
      return res.json({ message: `document ${doc.id} created successfully` });
    })
    .catch(err => {
      console.log(err);
      return res.status(500).json({ error: "Something went worng" });
    });
});
