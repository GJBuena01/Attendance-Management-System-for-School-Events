import express from "express";
import cors from "cors";
import type { ErrorRequestHandler } from "express";
import attendancesRouter from "./routes/attendances.routes";
import authRouter from "./routes/auth.routes";
import eventsRouter from "./routes/events.routes";

const app = express();
const port = 3000;

app.use(cors());
app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api", attendancesRouter);
app.use("/api", authRouter);
app.use("/api", eventsRouter);

app.use((_request, response) => {
  response.status(404).json({ error: "Route not found" });
});

const errorHandler: ErrorRequestHandler = (error, _request, response, _next) => {
  const status = (error as { status?: number }).status;
  response
    .status(status === 400 ? 400 : 500)
    .json({ error: status === 400 ? "Invalid JSON request body" : "Internal server error" });
};

app.use(errorHandler);

app.listen(port, "0.0.0.0", () => {
  console.log(`API running at http://localhost:${port}`);
});