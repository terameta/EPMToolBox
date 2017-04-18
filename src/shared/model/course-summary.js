"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createCourseSummary({ id, url, description, iconUrl, courseListIcon, seqNo }) {
    return {
        id, url, description, iconUrl, courseListIcon, seqNo
    };
}
exports.createCourseSummary = createCourseSummary;
function createCourseSummaries(data) {
    return data.map(createCourseSummary);
}
exports.createCourseSummaries = createCourseSummaries;
//# sourceMappingURL=course-summary.js.map