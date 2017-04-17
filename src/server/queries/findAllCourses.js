"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var course_summary_1 = require("./../../shared/model/course-summary");
var model_1 = require("./../model/model");
function findAllCourses() {
    return model_1.CourseModel.findAll({
        order: ["seqNo"]
    }).
        then(course_summary_1.createCourseSummaries);
}
exports.findAllCourses = findAllCourses;
//# sourceMappingURL=findAllCourses.js.map