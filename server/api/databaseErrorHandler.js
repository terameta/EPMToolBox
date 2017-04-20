"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const hri = require('human-readable-ids').hri;
function databaseErrorHandler(res, err) {
    const id = hri.random();
    console.error('Database error occurred ', id, err);
    res.status(500).json({ code: 'ERR-002', message: 'Creation of lesson failed, error code ' + id });
}
exports.databaseErrorHandler = databaseErrorHandler;
//# sourceMappingURL=databaseErrorHandler.js.map