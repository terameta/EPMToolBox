"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const logger = require("morgan");
const jwt = require("express-jwt");
const api_1 = require("../api/api");
const config_tools_1 = require("./config.tools");
function initiateApplicationWorker(refDB, refConfig) {
    const app = express();
    const mainTools = new config_tools_1.MainTools(refConfig);
    app.use(bodyParser.json({ limit: "100mb" }));
    app.use(bodyParser.text({ limit: "100mb" }));
    app.use(bodyParser.urlencoded({ extended: true, limit: "100mb" }));
    app.use(express.static(path.join(__dirname, "../../client/dist")));
    app.enable("trust proxy");
    app.use(helmet());
    app.use(helmet.noCache());
    app.use(logger("short"));
    app.use("/api/dime", jwt({ secret: refConfig.hash }));
    api_1.initializeRestApi(app, refDB, mainTools);
    app.set("port", 8000);
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../client/dist/index.html"));
    });
    const server = app.listen(app.get("port"), () => {
        console.log("Server is now running on port " + server.address().port);
    });
}
exports.initiateApplicationWorker = initiateApplicationWorker;
//# sourceMappingURL=config.app.js.map