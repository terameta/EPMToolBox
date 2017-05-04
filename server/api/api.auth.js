"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function apiAuth(app, refDB, refTools) {
    app.route("/api/auth/signin").post((req, res) => {
        console.log(req.body);
        console.log(refTools.generateLongString());
        res.json("OK");
    });
}
exports.apiAuth = apiAuth;
//# sourceMappingURL=api.auth.js.map