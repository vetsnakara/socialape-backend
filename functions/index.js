const app = require("express")();
const morgan = require("morgan");

const { functions } = require("./services/firebase");
const setupRoutes = require("./routes");

const { db } = require("./services/firebase");

app.use(morgan("tiny"));

setupRoutes(app);

exports.api = functions.https.onRequest(app);

exports.createNotificationOnLike = functions.firestore
  .document("/likes/{id}")
  .onCreate(async likeSnapshot => {
    console.log("--- createNotificationOnLike");

    try {
      const { postId, userHandle: likeSender } = likeSnapshot.data();

      const postDoc = await db
        .collection("posts")
        .doc(postId)
        .get();

      if (postDoc.exists) {
        const { userHandle: postOwner } = postDoc.data();

        await db
          .collection("notifications")
          .doc(likeSnapshot.id)
          .set({
            createdAt: new Date().toISOString(),
            recepient: postOwner,
            sender: likeSender,
            type: "like",
            read: false,
            postId: postDoc.id
          });
      }
    } catch (error) {
      console.log(error);
    }
  });

exports.deleteNotificationOnUnlike = functions.firestore
  .document("/likes/{id}")
  .onDelete(async likeSnapshot => {
    console.log("--- deleteNotificationOnUnlike");

    try {
      await db.doc(`/notifications/${likeSnapshot.id}`).delete();
    } catch (error) {
      console.log(error);
    }
  });

exports.createNotificationOnComment = functions.firestore
  .document("/comments/{id}")
  .onCreate(async commentSnapshot => {
    try {
      console.log("--- createNotificationOnComment");

      const { postId, userHandle: commentSender } = commentSnapshot.data();

      const postDoc = await db
        .collection("posts")
        .doc(postId)
        .get();

      if (postDoc.exists) {
        const { userHandle: postOwner } = postDoc.data();

        await db
          .collection("notifications")
          .doc(commentSnapshot.id)
          .set({
            createdAt: new Date().toISOString(),
            recepient: postOwner,
            sender: commentSender,
            type: "comment",
            read: false,
            postId: postDoc.id
          });
      }
    } catch (error) {
      console.log(error);
    }
  });
