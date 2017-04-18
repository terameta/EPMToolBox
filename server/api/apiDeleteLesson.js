"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var _ = require("lodash");
var onSuccess_1 = require("./onSuccess");
var onError_1 = require("./onError");
var deleteLesson_1 = require("../queries/deleteLesson");
function apiDeleteLesson(req, res) {
    var lessonId = req.params.id;
    deleteLesson_1.deleteLesson(lessonId).
        then(_.partial(onSuccess_1.onSuccess, res)).
        catch(_.partial(onError_1.onError, res, "Couldn't delete lesson " + lessonId));
}
exports.apiDeleteLesson = apiDeleteLesson;
//# sourceMappingURL=apiDeleteLesson.js.map