import { User } from '../../../../shared/models/user';
import { BaseState } from '../../../../shared/models/basestate';
import { JSONDeepCopy } from '../../../../shared/utilities/utilityFunctions';

export const FEATURE = '[USERS]';

export interface State extends BaseState<User> { }

const baseState: State = { items: {}, ids: [], loaded: false };

export const initialState = (): State => JSONDeepCopy( baseState );
