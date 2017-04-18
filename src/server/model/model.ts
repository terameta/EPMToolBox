import * as ORM from "Sequelize";
import { Sequelize, LoggingOptions } from "Sequelize";
import { initCourseModel } from "./initCourseModel";
import { initLessonModel } from "./initLessonModel";

const dbUrl = "mysql://typedeveloper:***REMOVED***@mysql.alirizadikici.com:3306/typedev";
const options: LoggingOptions = {benchmark: true, logging: console.log};

const sequelize: Sequelize = new ORM(dbUrl, options);

export const CourseModel = initCourseModel(sequelize);
export const LessonModel = initLessonModel(sequelize);

CourseModel.hasMany(LessonModel, { foreignKey: "courseId" });
LessonModel.belongsTo(CourseModel, { foreignKey: "courseId" });
