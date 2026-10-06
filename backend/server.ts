import express from "express";
import attendancesRouter from "./routes/attendances.routes";
import eventsRouter from "./routes/events.routes";
import healthRouter from "./routes/health.routes";

const app = express();
const port = 3000;

app.use(express.json());

app.use("/api", healthRouter);
app.use("/api", attendancesRouter);
app.use("/api", eventsRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`API running at http://localhost:${port}`);
});