const db = require("firebase-admin").firestore();

// get all posts
exports.getAll = async (req, res) => {
  try {
    const snap = await db
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
};

// create new post
exports.create = async (req, res) => {
  try {
    const { userHandle, body } = req.body;

    const newPost = {
      userHandle,
      body,
      createdAt: new Date().toISOString()
    };

    const doc = await db.collection("posts").add(newPost);

    return res.json({ message: `document ${doc.id} created successfully` });
  } catch (error) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};
