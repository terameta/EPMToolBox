"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function apiEnvironment(app, refDB, refTools) {
    app.route("/api/environment").get((req, res) => {
        res.send("OKOKA");
    });
}
exports.apiEnvironment = apiEnvironment;
//# sourceMappingURL=api.environment.js.map