"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const path = require("path");
const bodyParser = require("body-parser");
const helmet = require("helmet");
const logger = require("morgan");
const api_1 = require("../api/api");
function initiateApplicationWorker(refDB) {
    const app = express();
    app.enable("trust proxy");
    app.use(bodyParser.json({ limit: "100mb" }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, "../../client/dist")));
    app.use(helmet());
    app.use(helmet.noCache());
    app.use(logger("short"));
    api_1.initializeRestApi(app, refDB);
    app.set("port", 8000);
    app.get("*", (req, res) => {
        res.sendFile(path.join(__dirname, "../../dist/index.html"));
    });
    const server = app.listen(app.get("port"), () => {
        console.log("Server is now running on port " + server.address().port);
    });
}
exports.initiateApplicationWorker = initiateApplicationWorker;
//# sourceMappingURL=config.app.js.map