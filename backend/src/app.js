const express = require("express");
const cookieParser = require("cookie-parser");
const { env } = require("./config/env");
const { requestIdMiddleware, httpLogger } = require("./middleware/logging.middleware");
const { applySecurityMiddleware } = require("./middleware/security.middleware");
const apiRoutes = require("./routes");
const redirectRoutes = require("./routes/redirect.routes");
const { notFoundHandler, globalErrorHandler } = require("./middleware/error.middleware");

const app = express();

app.disable("x-powered-by");

app.use(requestIdMiddleware);
app.use(httpLogger);
applySecurityMiddleware(app);

app.use(cookieParser());
app.use(express.json({ limit: env.requestBodyLimit }));
app.use(express.urlencoded({ extended: true, limit: env.requestBodyLimit }));

app.use("/api/v1", apiRoutes);

app.get("/", (_req, res) => {
  res.status(200).json({
    success: true,
    data: {
      service: "shortify-api",
      message: "Shortify API is running"
    }
  });
});

app.use("/", redirectRoutes);

app.use(notFoundHandler);
app.use(globalErrorHandler);

module.exports = app;
