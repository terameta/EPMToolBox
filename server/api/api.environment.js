"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express = require("express");
const tools_environment_1 = require("../tools/tools.environment");
const tools_rester_1 = require("../tools/tools.rester");
class ApiEnvironment {
    constructor(app, db, tools) {
        this.app = app;
        this.db = db;
        this.tools = tools;
        this.environment = new tools_environment_1.EnvironmentTools(this.db);
        this.apiRoutes = express.Router();
        this.rester = new tools_rester_1.Rester(tools);
        this.setRoutes();
        this.rester.restify(this.apiRoutes, this.environment);
        this.app.use("/api/environment", this.apiRoutes);
    }
    setRoutes() {
        this.apiRoutes.get("/listTypes", (req, res) => { this.rester.respond(this.environment.listTypes, null, req, res); });
    }
}
exports.ApiEnvironment = ApiEnvironment;
//# sourceMappingURL=api.environment.js.map