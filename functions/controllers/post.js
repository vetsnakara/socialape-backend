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
      const {
        body,
        userHandle,
        createdAt,
        commentCount,
        likeCount,
        userImage
      } = doc.data();

      return {
        id: doc.id,
        body,
        userHandle,
        createdAt,
        commentCount,
        likeCount,
        userImage
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
      userImage: req.locals.user.imgUrl,
      body,
      createdAt: new Date().toISOString(),
      likeCount: 0,
      commentCount: 0
    };

    const doc = await db.collection("posts").add(newPost);

    return res.json({ message: `document ${doc.id} created successfully` });
  } catch (error) {
    console.log(err);
    return res.status(500).json({ error: "Internal server error" });
  }
};

// delete post
exports.deletePost = async (req, res) => {
  try {
    const { postId } = req.params;

    const postRef = await db.doc(`/posts/${postId}`);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const post = postDoc.data();

    if (post.userHandle !== req.locals.user.handle) {
      return res.status(403).json({
        error: "Unauthorized",
        info: "This post wasn't created by you"
      });
    }

    await postRef.delete();

    return res.status(200).json({ message: "Post was successfully deleted" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
