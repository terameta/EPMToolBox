"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const tools_rester_1 = require("../tools/tools.rester");
const tools_dime_map_1 = require("../tools/tools.dime.map");
class ApiMap {
    constructor(app, db, tools) {
        this.app = app;
        this.db = db;
        this.tools = tools;
        this.setRoutes = () => {
            this.apiRoutes.post("/fields", (req, res) => { this.rester.respond(this.mapTools.setFields, req.body, req, res); });
            this.apiRoutes.get("/fields/:id", (req, res) => { this.rester.respond(this.mapTools.getFields, req.params.id, req, res); });
            this.apiRoutes.get("/prepare/:id", (req, res) => { this.rester.respond(this.mapTools.prepare, req.params.id, req, res); });
        };
        this.mapTools = new tools_dime_map_1.MapTools(this.db, this.tools);
        this.apiRoutes = express_1.Router();
        this.rester = new tools_rester_1.Rester(this.tools);
        this.setRoutes();
        this.rester.restify(this.apiRoutes, this.mapTools);
        this.app.use("/api/dime/map", this.apiRoutes);
    }
}
exports.ApiMap = ApiMap;
//# sourceMappingURL=api.dime.map.js.map