const { db } = require("../services/firebase");

// mark notification as readed
exports.markNotificationsRead = async (req, res) => {
  try {
    const notificationIds = req.body;

    if (!Array.isArray(notificationIds)) {
      return res
        .status(400)
        .json({ error: "Expect an array of notification ids" });
    }

    if (notificationIds.length === 0) {
      return res
        .status(400)
        .json({ error: "Empty array of notificaion ids provided" });
    }

    const batch = db.batch();

    notificationIds.forEach(id => {
      const ref = db.doc(`/notifications/${id}`);
      batch.update(ref, { read: true });
    });

    await batch.commit();

    return res
      .status(200)
      .json({ message: "Notifications marked as read successfully" });
  } catch (error) {
    console.log(error);

    // if error "No document to update"
    if (error.code === 5) {
      return res.status(400).json({
        error: "Nonexistent notifications provided"
      });
    }

    return res.status(500).json({ error: error.code });
  }
};
