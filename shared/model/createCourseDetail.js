"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function createCourseDetail({ id, url, description, iconUrl, courseListIcon, seqNo, longDescription, comingSoon, isNew, isOngoing, Lessons }) {
    return {
        id, url, description, iconUrl, courseListIcon, seqNo, longDescription, comingSoon, isNew, isOngoing,
        lessons: Lessons.map(createLessonFromDbModel)
    };
}
exports.createCourseDetail = createCourseDetail;
function createLessonFromDbModel({ id, url, description, duration, seqNo, courseId, pro, tags }) {
    return { id, url, description, duration, seqNo, courseId, pro, tags };
}
//# sourceMappingURL=createCourseDetail.js.map