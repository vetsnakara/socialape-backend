const app = require("express")();
const morgan = require("morgan");

const { functions } = require("./services/firebase");
const setupRoutes = require("./routes");

const { db } = require("./services/firebase");

app.use(morgan("tiny"));

setupRoutes(app);

exports.api = functions.https.onRequest(app);

/************/
/* Triggers */
/* ******** */

// create notification on like
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

// delete notification on unlike
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

// create notification on comment
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

// change user image link in posts when user changes profile image
exports.onUserImageChange = functions.firestore
  .document("/users/{id}")
  .onUpdate(async userChange => {
    try {
      const isImageUrlChanged =
        userChange.before.data().imgUrl !== userChange.after.data().imgUrl;

      if (isImageUrlChanged) {
        const postDocs = await db
          .collection("posts")
          .where("userHandle", "==", userChange.before.data().handle)
          .get();

        const batch = db.batch();
        postDocs.forEach(doc => {
          const post = db.doc(`/posts/${doc.id}`);
          batch.update(post, { userImage: userChange.after.data().imgUrl });
        });

        await batch.commit();
      }
    } catch (error) {
      console.log("error", error);
    }
  });

// todo: delete user profile image if exists on new image upload

// delete comments/likes when post is delted
exports.onPostDelete = functions.firestore
  .document("/posts/{postId}")
  .onDelete(async (postSnapshot, context) => {
    const { postId } = context.params;
    const batch = db.batch();

    await deleteDocsByPostId("likes", postId);
    await deleteDocsByPostId("comments", postId);
    await deleteDocsByPostId("notifications", postId);

    await batch.commit();

    async function deleteDocsByPostId(collectionName, postId) {
      const querySnapshot = await db
        .collection(collectionName)
        .where("postId", "==", postId)
        .get();

      querySnapshot.forEach(snapshot => {
        const doc = db.doc(`/${collectionName}/${snapshot.id}`);
        batch.delete(doc);
      });
    }
    try {
    } catch (error) {}
  });
