import { Request, Response } from 'express';
import * as _ from 'lodash';
import { onSuccess } from './onSuccess';
import { onError } from './onError';
import { deleteLesson } from '../queries/deleteLesson';


export function apiDeleteLesson(req: Request, res: Response) {
	const lessonId = req.params.id;

	deleteLesson(lessonId).
		then(_.partial(onSuccess, res)).
		catch( _.partial(onError, res, "Couldn't delete lesson " + lessonId));
}
