import { BaseState } from "../../../../shared/models/basestate";
import { Directory } from "../../../../shared/models/directory";
import { JSONDeepCopy } from "../../../../shared/utilities/utilityFunctions";

export const FEATURE = '[DIRECTORIES]';

export interface State extends BaseState<Directory> { }

const baseState: State = { items: {}, ids: [], loaded: false };

export const initialState = (): State => JSONDeepCopy( baseState );
