"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var model_1 = require("./../model/model");
var createCourseDetail_1 = require("../../shared/model/createCourseDetail");
function findCourseDetail(courseId) {
    return model_1.CourseModel.findById(courseId, {
        include: [
            {
                model: model_1.LessonModel
            }
        ]
    }).
        then(createCourseDetail_1.createCourseDetail);
}
exports.findCourseDetail = findCourseDetail;
//# sourceMappingURL=findCourseDetail.js.map