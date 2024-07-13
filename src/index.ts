import express from "express";
import config from "./config";
import router from "./routes";
import { requestLogger } from "./middleware/logger";
import { genericErrorHandler } from "./middleware/errorHandler";
import { routeNotFound } from "./middleware/notFound";

const app = express();
app.use(express.json());
app.use(requestLogger);
app.use(router);
app.use(genericErrorHandler);
app.use(routeNotFound);

app.listen(config.port, () => {
  console.log(`Server listening on: http://localhost:${config.port}`);
});
