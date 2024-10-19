"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var cors = require("cors");
var database_1 = require("./database");
// Import routers.
var auth_routes_1 = require("./routes/auth-routes");
var user_routes_1 = require("./routes/user-routes");
var report_routes_1 = require("./routes/report-routes");
// Server setup.
(0, database_1.connectToDatabase)();
var app = express();
app.use(bodyParser.json({ type: "application/json" }));
app.use(helmet());
app.use(cors({ origin: true, credentials: true, }));
// Routers.
app.use("/", auth_routes_1.router);
app.use("/", user_routes_1.router);
app.use("/", report_routes_1.router);
app.listen(3000, function () {
    console.log("Server started.");
});
exports.default = app;
