const { db } = require("../services/firebase");
const { validate, schemas } = require("../utils/validation");

// create comment
exports.createComment = async (req, res) => {
  try {
    const { postId } = req.params;
    const { body } = req.body;

    // validate form data
    const validationError = validate({ body }, schemas.addComment);

    if (validationError) {
      return res.status(400).json(validationError);
    }

    const postDoc = await db.doc(`/posts/${postId}`).get();

    if (!postDoc.exists) {
      return res.status(404).json({ error: "Post not found" });
    }

    const newComment = {
      body,
      createdAt: new Date().toISOString(),
      postId,
      userHandle: req.locals.user.handle,
      userImage: req.locals.user.imgUrl
    };

    await db.collection("comments").add(newComment);

    return res.status(201).json({ message: "Comment added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};
