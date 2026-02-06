import express from "express";
import { postsRouter } from "./routes/posts.js";
import { applicationsRouter } from "./routes/applications.js";
import { screeningRouter } from "./routes/screening.js";
import { candidatesRouter } from "./routes/candidates.js";
import { decisionsRouter } from "./routes/decisions.js";
import { errorHandler } from "./middleware/error-handler.js";

const app = express();
const port = process.env.HR_AGENT_PORT ?? 3001;

app.use(express.json());

app.use("/api/posts", postsRouter);
app.use("/api/posts", applicationsRouter);
app.use("/api/posts", candidatesRouter);
app.use("/api/posts", decisionsRouter);
app.use("/api/candidates", screeningRouter);

app.use(errorHandler);

app.listen(port, () => {
  console.log(`HR Agent running on port ${port}`);
});

export default app;
