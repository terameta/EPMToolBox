"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tools_rester_1 = require("../tools/tools.rester");
const tools_dime_process_1 = require("../tools/tools.dime.process");
class ApiProcess {
    constructor(app, db, tools) {
        this.app = app;
        this.db = db;
        this.tools = tools;
        this.setRoutes = () => {
        };
        this.processTools = new tools_dime_process_1.ProcessTools(this.db, this.tools);
        this.apiRoutes = express_1.Router();
        this.rester = new tools_rester_1.Rester(this.tools);
        this.setRoutes();
        this.rester.restify(this.apiRoutes, this.processTools);
        this.app.use("/api/dime/process", this.apiRoutes);
    }
}
exports.ApiProcess = ApiProcess;
//# sourceMappingURL=api.dime.process.js.map