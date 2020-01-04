const firebase = require("firebase");
const db = require("firebase-admin").firestore();

exports.signUp = async (req, res) => {
  try {
    const { email, handle, password, confirmPassword } = req.body;

    // todo: add form validation

    // check for existing user with the same handle
    const doc = db.doc(`/users/${handle}`).get();

    if (doc.exist) {
      return res.status(400).json({ handle: "this handle is already taken" });
    }

    // signing up user
    const {
      user: authUser
    } = await firebase.auth().createUserWithEmailAndPassword(email, password);

    const { uid } = authUser;
    const token = await authUser.getIdToken();

    // persist user in db
    await db.doc(`/users/${handle}`).set({
      userId: uid,
      handle,
      email,
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({ token });
  } catch (error) {
    if (error.code === "auth/email-already-in-use") {
      return res.status(404).json({ email: "Email is already in use" });
    }
    return res.status(500).json({ error: error.code });
  }
};
