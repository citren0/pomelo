const express = require("express");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const cors = require("cors");

import { connectToDatabase } from "./database";

// Import routers.
import { router as authRouter } from "./routes/auth-routes";
import { router as userRouter } from "./routes/user-routes";
import { router as reportRouter } from "./routes/report-routes";
import { router as emailRouter } from "./routes/email-routes";
import { router as passwordRouter } from "./routes/password-routes";
import { router as rulesRouter } from "./routes/rules-routes";
import { router as paypalRouter } from "./routes/paypal-routes";

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
app.use("/", emailRouter);
app.use("/", passwordRouter);
app.use("/", rulesRouter);
app.use("/", paypalRouter);

app.listen(3000, () =>
{
    console.log("Server started.");
});

export default app;