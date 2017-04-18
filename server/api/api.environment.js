"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function apiEnvironment(app) {
    app.route("/api/environment").get(function (req, res) {
        res.send("OK");
    });
}
exports.apiEnvironment = apiEnvironment;
//# sourceMappingURL=api.environment.js.map