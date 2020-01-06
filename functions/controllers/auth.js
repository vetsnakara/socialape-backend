const { firebase, db } = require("../services/firebase");
const { validate, schemas } = require("../utils/validation");
const getFbStorageUrl = require("../utils/getFbStorageUrl");

const NO_USER_IMAGE = "no-user-image.jpg";

// sign up
exports.signUp = async (req, res) => {
  try {
    const { email, handle, password, passwordConfirm } = req.body;

    // validate form data
    const validationError = validate(
      {
        handle,
        email,
        password,
        passwordConfirm
      },
      schemas.signUp
    );

    if (validationError) {
      return res.status(400).json(validationError);
    }

    // check for existing user with the same handle
    const doc = await db.doc(`/users/${handle}`).get();

    if (doc.exists) {
      return res
        .status(400)
        .json({ handle: `Handle '${handle}' is already taken` });
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
      imgUrl: getFbStorageUrl(NO_USER_IMAGE),
      createdAt: new Date().toISOString()
    });

    return res.status(201).json({ token });
  } catch (error) {
    switch (error.code) {
      case "auth/email-already-in-use":
        return res.status(400).json({ email: "Email is already in use" });
      case "auth/weak-password":
        return res.status(400).json({ password: "Weak password" });
      default:
        return res.status(500).json({ error: error.code });
    }
  }
};

// log in
exports.logIn = async (req, res) => {
  try {
    const { email, password } = req.body;

    // validate form data
    const validationError = validate({ email, password }, schemas.logIn);

    if (validationError) {
      return res.status(400).json(validationError);
    }

    // login
    const { user: authUser } = await firebase
      .auth()
      .signInWithEmailAndPassword(email, password);

    const token = await authUser.getIdToken();

    return res.status(200).json({ token });
  } catch (error) {
    switch (error.code) {
      case "auth/user-not-found":
      case "auth/wrong-password":
        return res
          .status(403)
          .json({ error: "Wrong credentials. Please, try again." });
      default:
        return res.status(403).json({ error: error.code });
    }
  }
};
