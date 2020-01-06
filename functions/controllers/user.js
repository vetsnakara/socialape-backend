const path = require("path");
const os = require("os");
const fs = require("fs");
const BusBoy = require("busboy");
const uniqueFilename = require("unique-filename");

const { db, storage } = require("../services/firebase");
const getFbStorageUrl = require("../utils/getFbStorageUrl");

exports.fileUpload = (req, res) => {
  let image;
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
