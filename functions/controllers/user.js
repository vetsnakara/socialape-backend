const path = require("path");
const os = require("os");
const fs = require("fs");
const BusBoy = require("busboy");
const uniqueFilename = require("unique-filename");

const { db, storage } = require("../services/firebase");
const getFbStorageUrl = require("../utils/getFbStorageUrl");

// get user details
exports.getAuthenticatedUser = async (req, res) => {
  try {
    const userDoc = await db.doc(`/users/${req.locals.user.handle}`).get();

    if (!userDoc.exists) {
      return res.status(404).json({ message: "Authenticated user not found" });
    }

    const userData = {
      credentials: userDoc.data()
    };

    const likeDocs = await db
      .collection("likes")
      .where("userHandle", "==", req.locals.user.handle)
      .get();

    userData.likes = [];
    likeDocs.forEach(doc => userData.likes.push(doc.data()));

    return res.status(200).json(userData);
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};

// add user details
exports.addUserDetails = async (req, res) => {
  const { bio, website, location } = req.body;

  // todo: add user details validation (no include empty fields + correct http(s)!)
  const userDetails = {
    bio: bio || "",
    website: website || "",
    location: location || ""
  };

  try {
    await db.doc(`/users/${req.locals.user.handle}`).update(userDetails);
    return res.status(200).json({ message: "Details added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ error: error.code });
  }
};

// upload avatar image
exports.uploadProfileImage = (req, res) => {
  let image = null;
  const busboy = new BusBoy({ headers: req.headers });

  // upload file to tmp dir on the server
  busboy.on("file", (fieldname, file, filename, encoding, mimetype) => {
    if (!["image/jpg", "image/jpeg", "image/png"].includes(mimetype)) {
      return res.status(400).json({ error: "Invalid file type submitted" });
    }

    const imageExtension = path.extname(filename);
    const imageFileName = uniqueFilename("", "avatar") + imageExtension;

    image = {
      filename: imageFileName,
      filepath: path.join(os.tmpdir(), imageFileName),
      mimetype
    };

    file.pipe(fs.createWriteStream(image.filepath));
  });

  // upload image to firebase storage
  busboy.on("finish", async () => {
    try {
      if (!image) {
        return res.status(400).json({ error: "No file provided" });
      }

      await storage.upload(image.filepath, {
        resumable: false,
        metadata: {
          metadata: {
            contentType: image.mimetype
          }
        }
      });

      const imgUrl = getFbStorageUrl(image.filename);

      await db.doc(`/users/${req.locals.user.handle}`).update({ imgUrl });

      return res.status(201).json({ message: "Image uploaded successfully" });
    } catch (error) {
      console.log(error);
      return res.status(500).json({ error });
    }
  });

  busboy.end(req.rawBody);
};
