import { Action as NgRXAction, Store } from '@ngrx/store';
import { DimeTagActions } from './dimetag.actions';
import * as _ from 'lodash';
import { DimeTagGroupActions } from './dimetaggroup.actions';
import { State, initialState } from './dimetag.state';

interface Action extends NgRXAction {
	payload?: any;
}


export function reducer( state: State = initialState(), action: Action ): State {
	switch ( action.type ) {
		case DimeTagActions.ALL.LOAD.COMPLETE: {
			return handleAllLoadComplete( state, action );
		}
		case DimeTagActions.ONE.LOAD.COMPLETE: {
			return handleOneLoadComplete( state, action );
		}
		case DimeTagGroupActions.ALL.LOAD.COMPLETE: {
			return handleGroupAllLoadComplete( state, action );
		}
		case DimeTagGroupActions.ONE.REORDER: {
			return handleGroupOneReorder( state, action );
		}
		case DimeTagGroupActions.ONE.SELECTED: {
			return handleGroupOneSelected( state, action );
		}
		default: {
			return state;
		}
	}
}

const handleAllLoadComplete = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	newState.loaded = true;
	return newState;
};

const handleOneLoadComplete = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curItem = action.payload;
	return newState;
};

const handleGroupAllLoadComplete = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	newState.groups = _.keyBy( action.payload, 'id' );
	return newState;
};

const handleGroupOneReorder = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	const srcId = action.payload.id;
	let tarId = 0;
	const srcPos = newState.groups[srcId].position;
	let tarPos = 0;
	if ( action.payload.direction === 'UP' ) { tarPos = srcPos - 1; }
	if ( action.payload.direction === 'DOWN' ) { tarPos = srcPos + 1; }
	Object.keys( newState.groups ).forEach( ( curKey ) => {
		if ( newState.groups[curKey].position === tarPos ) { tarId = parseInt( curKey, 10 ); }
	} );
	if ( tarId > 0 ) {
		newState.groups[srcId].position = tarPos;
		newState.groups[srcId].isReordered = true;
		newState.groups[tarId].position = srcPos;
		newState.groups[tarId].isReordered = true;
	}
	return newState;
};

const handleGroupOneSelected = ( state: State, action: Action ): State => {
	const newState: State = Object.assign( {}, state );
	newState.curGroup = newState.groups[action.payload];
	newState.curGroupID = action.payload;
	return newState;
};
