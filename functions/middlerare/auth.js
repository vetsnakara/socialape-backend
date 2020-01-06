const { admin, db } = require("../services/firebase");

exports.isAuthenticated = async (req, res, next) => {
  try {
    const tokenHeader = req.headers["x-auth-token"];

    if (tokenHeader && tokenHeader.startsWith("Bearer ")) {
      const token = tokenHeader.split("Bearer ")[1].trim();

      const decodedToken = await admin.auth().verifyIdToken(token);

      const userData = await db
        .collection("users")
        .where("userId", "==", decodedToken.uid)
        .limit(1)
        .get();

      const handle = userData.docs[0].data().handle;

      req.locals = {
        ...req.locals,
        user: {
          decodedToken,
          handle
        }
      };

      return next();
    }

    return res.status(403).json({ error: "Unauthorized" });
  } catch (error) {
    switch (error.code) {
      case "auth/id-token-expired":
        return res.status(403).json({ error: "Token is expired" });
      default:
        return res.status(403).json(error);
    }
  }
};
