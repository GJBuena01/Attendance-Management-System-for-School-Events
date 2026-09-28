import express from "express";
import attendancesRouter from "./routes/attendances.routes";

const app = express();
const port = 3000;

app.use(express.json());

app.get("/api/health", (_request, response) => {
  response.json({ status: "ok" });
});

app.use("/api", attendancesRouter);

app.listen(port, "0.0.0.0", () => {
  console.log(`API running at http://localhost:${port}`);
});