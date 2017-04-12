import { CourseModel } from './model/model';
import { findAllCourses } from './queries/findAllCourses';

import * as express from 'express';

const app = express();

app.listen(8090, () => {
	console.log('Server is running ...');
});


findAllCourses().
	then((results: any) => console.log(JSON.stringify(results)));
