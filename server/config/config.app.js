"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var path = require("path");
var bodyParser = require("body-parser");
var helmet = require("helmet");
var logger = require("morgan");
var api_1 = require("../api/api");
function initiateApplicationWorker(refDB) {
    var app = express();
    app.enable("trust proxy");
    app.use(bodyParser.json({ limit: "100mb" }));
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(express.static(path.join(__dirname, "dist")));
    app.use(helmet());
    app.use(helmet.noCache());
    app.use(logger("short"));
    api_1.initializeRestApi(app);
    app.set("port", 8000);
    app.get("*", function (req, res) {
        res.sendFile(path.join(__dirname, "dist/index.html"));
    });
    var server = app.listen(app.get("port"), function () {
        console.log("Server is now running on port " + server.address().port);
    });
}
exports.initiateApplicationWorker = initiateApplicationWorker;
//# sourceMappingURL=config.app.js.map