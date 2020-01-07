const setupRoutes = app => {
  app.use("/", require("./auth"));
  app.use("/user", require("./user"));
  app.use("/posts", require("./post"));
  app.use("/comment", require("./comment"));
  app.use("/like", require("./like"));
  app.use((req, res) => res.status(404).json({ message: "Route not found" }));
};

module.exports = setupRoutes;
