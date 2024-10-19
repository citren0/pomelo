const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

import { connectToDatabase } from "./database";

// Import routers.
import { router as authRouter } from "./routes/auth-routes";
import { router as userRouter } from "./routes/user-routes";
import { router as reportRouter } from "./routes/report-routes";

// Server setup.
connectToDatabase();
const app = express();
app.use(bodyParser.json({ type: "application/json" }));
app.use(helmet());
app.use(cors({ origin: true, credentials: true, }));

// Routers.
app.use("/", authRouter);
app.use("/", userRouter);
app.use("/", reportRouter);

app.listen(3000, () => {
    console.log("Server started.")
});

export default app;