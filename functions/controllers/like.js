const { db } = require("../services/firebase");

// like post
exports.like = async (req, res) => {
  try {
    const { handle: userHandle } = req.locals.user;
    const { postId } = req.params;

    // like object
    const like = {
      userHandle,
      postId
    };

    // check for post existance
    const postRef = db.doc(`/posts/${postId}`);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    // check if user likes own post
    const post = postDoc.data();
    if (post.userHandle === req.locals.user.handle) {
      return res.status(400).json({ error: "Can't like own post" });
    }

    // check if post already liked
    const likeDoc = await db
      .collection("likes")
      .where("userHandle", "==", like.userHandle)
      .where("postId", "==", like.postId)
      .limit(1)
      .get();

    if (!likeDoc.empty) {
      return res.status(400).json({ error: "Post is already liked" });
    }

    // create like
    await db.collection("likes").add(like);

    // update likeCount in post
    post.likeCount++;
    await postRef.update({
      likeCount: post.likeCount
    });

    return res.status(200).json(like);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};

// unlike post
exports.unlike = async (req, res) => {
  try {
    const { handle: userHandle } = req.locals.user;
    const { postId } = req.params;

    console.log("unlike request started");

    // like object
    const like = {
      userHandle,
      postId
    };

    // check for post existance
    const postRef = db.doc(`/posts/${req.params.postId}`);
    const postDoc = await postRef.get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    // check if post already liked
    const likeDoc = await db
      .collection("likes")
      .where("userHandle", "==", like.userHandle)
      .where("postId", "==", like.postId)
      .limit(1)
      .get();

    if (likeDoc.empty) {
      return res.status(400).json({ error: "Post is not liked" });
    }

    // delete like
    await db.doc(`/likes/${likeDoc.docs[0].id}`).delete();

    // update likeCount in post
    const post = postDoc.data();
    post.likeCount--;
    await postRef.update({
      likeCount: post.likeCount
    });

    console.log("unlike request finished");
    return res.status(200).json(like);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
