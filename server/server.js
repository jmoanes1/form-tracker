const express = require("express");
const cors = require("cors");
const websitesRouter = require("./routes/websites");
const dashboardRouter = require("./routes/dashboard");

const app = express();

const PORT = 5000;

app.use(cors());
app.use(express.json());

app.use("/api/websites", websitesRouter);
app.use("/api/dashboard", dashboardRouter);

app.listen(PORT, () => {
  console.log(`Backend running on http://localhost:${PORT}`);
});
