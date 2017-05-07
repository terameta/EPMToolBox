"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function apiEnvironment(app, refDB, refTools) {
    app.route("/api/environment").get((req, res) => {
        refDB.query("SELECT * FROM environments", function (err, result, fields) {
            if (err) {
                res.status(500).json({
                    error: err,
                    message: "Listing environments failed"
                });
            }
            else {
                res.json(result);
            }
        });
    });
}
exports.apiEnvironment = apiEnvironment;
//# sourceMappingURL=api.environment.js.map