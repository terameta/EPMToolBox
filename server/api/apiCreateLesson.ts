import { Request, Response } from "express";
import * as _ from "lodash";
import { createLesson } from "../queries/createLesson";
import { onSuccess } from "./onSuccess";
import { onError } from "./onError";
import { databaseErrorHandler } from "./databaseErrorHandler";

export function apiCreateLesson(req: Request, res: Response) {
	createLesson(req.body).
	then( _.partial(onSuccess, res) ).
	catch( _.partial(databaseErrorHandler, res)).
	catch( _.partial(onError, res, "Could not create lesson") );
}
