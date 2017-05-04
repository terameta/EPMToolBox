"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function apiProcess(app, refDB, refTools) {
    app.route("/api/process").get((req, res) => {
        refDB.query("SELECT * FROM processes", function (err, result, fields) {
            if (err) {
                res.status(500).json({
                    error: err,
                    message: "Listing processes failed"
                });
            }
            else {
                res.json(result);
            }
        });
    });
}
exports.apiProcess = apiProcess;
//# sourceMappingURL=api.process.js.map