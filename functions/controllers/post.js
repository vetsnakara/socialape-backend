const { db } = require("../services/firebase");

// get one post by id
exports.getOne = async (req, res) => {
  try {
    const { postId } = req.params;

    const postDoc = await db.doc(`/posts/${postId}`).get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const postData = {
      id: postDoc.id,
      ...postDoc.data()
    };

    const commentDocs = await db
      .collection("comments")
      .where("postId", "==", postId)
      .orderBy("createdAt", "desc")
      .get();

    postData.comments = [];
    commentDocs.forEach(doc => postData.comments.push(doc.data()));

    return res.status(200).json(postData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};

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
exports.createPost = async (req, res) => {
  try {
    const { body } = req.body;

    const newPost = {
      userHandle: req.locals.user.handle,
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
