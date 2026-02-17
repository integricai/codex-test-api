import compression from "compression";
import cors from "cors";
import express from "express";
import helmet from "helmet";
import morgan from "morgan";
import swaggerUi from "swagger-ui-express";

import env from "./config/env.js";
import openApiSpec from "./docs/openapi.js";
import errorHandler from "./middlewares/errorHandler.js";
import notFound from "./middlewares/notFound.js";
import routes from "./routes/index.js";

const app = express();

app.use(helmet());
app.use(compression());
app.use(cors({ origin: env.clientOrigin === "*" ? true : env.clientOrigin }));
app.use(express.json({ limit: "1mb" }));
app.use(morgan(env.nodeEnv === "production" ? "combined" : "dev"));

app.get("/health", (_req, res) => {
  res.status(200).json({ status: "ok" });
});

app.get("/api-docs.json", (_req, res) => {
  res.status(200).json(openApiSpec);
});
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(openApiSpec));

app.use("/api/v1", routes);
app.use(notFound);
app.use(errorHandler);

export default app;
