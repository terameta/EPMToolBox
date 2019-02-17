import { Injectable } from '@angular/core';
import { Effect, ofType, Actions } from '@ngrx/effects';
import {
	DIME_ASYNC_PROCESS_ACTIONS, DimeAsyncProcessAllLoadInitiateAction, DimeAsyncProcessAllLoadCompleteAction, DimeAsyncProcessOneCreateInitiateAction, DimeAsyncProcessOneCreateCompleteAction
} from './asyncprocess.actions';
import { switchMap, mergeMap, map } from 'rxjs/operators';
import { DimeEnvironmentActions } from '../dimeenvironment/dimeenvironment.actions';
import { DimeStreamActions } from '../dimestream/dimestream.actions';
import { DimeAsyncProcessBackend } from './dimeasyncprocess.backend';

@Injectable()
export class Effects {
	@Effect() DIME_ASYNC_PROCESS_ACTIONS_ALL_LOAD_INITIATE$ = this.actions.pipe(
		ofType( DIME_ASYNC_PROCESS_ACTIONS.ALL.LOAD.INITIATE ),
		switchMap( ( a: DimeAsyncProcessAllLoadInitiateAction ) => {
			return this.backend.allLoad().pipe(
				mergeMap( resp => {
					return [
						new DimeAsyncProcessAllLoadCompleteAction( resp ),
						DimeEnvironmentActions.ALL.LOAD.initiateifempty(),
						DimeStreamActions.ALL.LOAD.initiateifempty()
					];
				} )
			);
		} ) );
	@Effect() DIME_ASYNC_PROCESS_ACTIONS_ONE_CREATE_INITIATE$ = this.actions.pipe(
		ofType( DIME_ASYNC_PROCESS_ACTIONS.ONE.CREATE.INITIATE ),
		switchMap( ( a: DimeAsyncProcessOneCreateInitiateAction ) => {
			return this.backend.oneCreate( a.payload ).pipe(
				map( resp => ( new DimeAsyncProcessOneCreateCompleteAction( resp ) ) ) );
		} ) );
	constructor( private actions: Actions, private backend: DimeAsyncProcessBackend ) { }
}

