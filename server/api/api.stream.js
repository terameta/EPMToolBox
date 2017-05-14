"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tools_rester_1 = require("../tools/tools.rester");
const tools_stream_1 = require("../tools/tools.stream");
class ApiStream {
    constructor(app, db, tools) {
        this.app = app;
        this.db = db;
        this.tools = tools;
        this.setRoutes = () => {
            this.apiRoutes.get("/listTypes", (req, res) => { this.rester.respond(this.stream.listTypes, null, req, res); });
            this.apiRoutes.get("/listFields/:id", (req, res) => { this.rester.respond(this.stream.listFields, req.params.id, req, res); });
        };
        this.stream = new tools_stream_1.StreamTools(this.db, this.tools);
        this.apiRoutes = express_1.Router();
        this.rester = new tools_rester_1.Rester(tools);
        this.setRoutes();
        this.rester.restify(this.apiRoutes, this.stream);
        this.app.use("/api/stream", this.apiRoutes);
    }
}
exports.ApiStream = ApiStream;
//# sourceMappingURL=api.stream.js.map