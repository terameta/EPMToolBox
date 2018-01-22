import { Action as NgRXAction, Store } from '@ngrx/store';
import { DimeTag } from '../../../../../shared/model/dime/tag';
import { DimeTagActions } from 'app/dime/dimetag/dimetag.actions';
import { DimeTagState } from 'app/dime/dimetag/dimetag.state';
import * as _ from 'lodash';
import { DimeTagGroupActions } from 'app/dime/dimetag/dimetaggroup.actions';
import { AppState } from 'app/ngstore/models';

export interface Action extends NgRXAction {
	payload?: any;
}


export function dimeTagReducer( state: DimeTagState, action: Action ): DimeTagState {
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

const handleAllLoadComplete = ( state: DimeTagState, action: Action ): DimeTagState => {
	const newState: DimeTagState = Object.assign( {}, state );
	newState.items = _.keyBy( action.payload, 'id' );
	return newState;
}

const handleOneLoadComplete = ( state: DimeTagState, action: Action ): DimeTagState => {
	const newState: DimeTagState = Object.assign( {}, state );
	newState.curItem = action.payload;
	return newState;
}

const handleGroupAllLoadComplete = ( state: DimeTagState, action: Action ): DimeTagState => {
	const newState: DimeTagState = Object.assign( {}, state );
	newState.groups = _.keyBy( action.payload, 'id' );
	return newState;
}

const handleGroupOneReorder = ( state: DimeTagState, action: Action ): DimeTagState => {
	const newState: DimeTagState = Object.assign( {}, state );
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
}

const handleGroupOneSelected = ( state: DimeTagState, action: Action ): DimeTagState => {
	const newState: DimeTagState = Object.assign( {}, state );
	newState.curGroup = newState.groups[action.payload];
	newState.curGroupID = action.payload;
	return newState;
}
