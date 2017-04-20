"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function onError(res, message, err) {
    console.error('Promise chain error', err);
    res.status(500).send();
}
exports.onError = onError;
//# sourceMappingURL=onError.js.map