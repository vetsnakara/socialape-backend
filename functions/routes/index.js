const setupRoutes = app => {
  // auth
  app.use("/", require("./auth"));

  // post
  app.use("/posts", require("./post"));

  // 404
  app.use((req, res) => res.status(404).json({ message: "Not found" }));
};

module.exports = setupRoutes;
