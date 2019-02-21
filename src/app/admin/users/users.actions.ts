import { ReducingAction } from '../../../../shared/models/reducingaction';
import { FEATURE, State } from './users.state';
import { User } from '../../../../shared/models/user';
import { keyBy } from 'lodash';
import { SortByName } from '../../../../shared/utilities/utilityFunctions';

export const ActionTypes = {
	CREATE: `${ FEATURE } Create`,
	LOAD: `${ FEATURE } Load`,
	UPDATE: `${ FEATURE } Update`,
	DELETE: `${ FEATURE } Delete`,
};

export class Create implements ReducingAction<State> {
	readonly feature = FEATURE;
	readonly type = ActionTypes.CREATE;

	constructor( public payload: User ) { }

	public reducer = ( state: State ): State => state;
}

export class Load implements ReducingAction<State> {
	readonly feature = FEATURE;
	readonly type = ActionTypes.LOAD;

	constructor( public payload?: User[] ) { }

	public reducer = ( state: State ): State => {
		if ( this.payload ) {
			return {
				...state,
				items: keyBy( this.payload, 'id' ),
				loaded: true,
				ids: this.payload.sort( SortByName ).map( u => u.id )
			};
		} else {
			return state;
		}

	};
}

export class Update implements ReducingAction<State> {
	readonly feature = FEATURE;
	readonly type = ActionTypes.UPDATE;

	public reducer = ( state: State ): State => state;
}

export class Delete implements ReducingAction<State> {
	readonly feature = FEATURE;
	readonly type = ActionTypes.DELETE;

	public reducer = ( state: State ): State => state;
}

export type ActionUnion = Create | Load | Update | Delete;
