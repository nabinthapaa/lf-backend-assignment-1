import express from "express";
import config from "./config";
import router from "./routes";

const app = express();
app.use(express.json());
app.use(router);
app.get("/", (req, res) => {
  res.send("hello world");
});

app.listen(config.port, () => {
  console.log(`Server listening on: http://localhost:${config.port}`);
});
