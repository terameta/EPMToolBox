import { Request, Response } from 'express';
import * as _ from 'lodash';
import { onSuccess } from './onSuccess';
import { onError } from './onError';
import { updateLesson } from '../queries/updateLesson';
import { databaseErrorHandler } from './databaseErrorHandler';

export function apiPatchLesson(req: Request, res: Response) {
	const lessonId = req.params.id;
	updateLesson(lessonId, req.body).
		then(_.partial(onSuccess, res)).
		catch(_.partial(databaseErrorHandler, res)).
		catch( _.partial(onError, res, "Couldn't update lesson"));
}
