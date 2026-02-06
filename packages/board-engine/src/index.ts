import express from "express";
import { evaluateRouter } from "./routes/evaluate.js";
import { rankingsRouter } from "./routes/rankings.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();
const port = process.env.BOARD_ENGINE_PORT ?? 3002;

app.use(express.json());

app.use("/api/board", evaluateRouter);
app.use("/api/board", rankingsRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`Board Engine running on port ${port}`);
});

export default app;
