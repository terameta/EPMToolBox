"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var createLesson_1 = require("../queries/createLesson");
var onSuccess_1 = require("./onSuccess");
var onError_1 = require("./onError");
var databaseErrorHandler_1 = require("./databaseErrorHandler");
function apiCreateLesson(req, res) {
    createLesson_1.createLesson(req.body).
        then(_.partial(onSuccess_1.onSuccess, res)).
        catch(_.partial(databaseErrorHandler_1.databaseErrorHandler, res)).
        catch(_.partial(onError_1.onError, res, "Could not create lesson"));
}
exports.apiCreateLesson = apiCreateLesson;
//# sourceMappingURL=apiCreateLesson.js.map