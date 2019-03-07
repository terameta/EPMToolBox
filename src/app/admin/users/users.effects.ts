import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, filter, map, switchMap, mergeMap, tap } from "rxjs/operators";
import { AppState } from "../../app.state";
import { ActionTypes, Load, Create } from "./users.actions";
import { BackEnd } from "./users.backend";
import { RouterGo } from "../../router";

@Injectable()
export class Effects {
	@Effect() LOAD = this.actions$.pipe(
		ofType( ActionTypes.LOAD ),
		filter( ( a: Load ) => !a.payload ),
		switchMap( () => this.backend.load().pipe(
			map( resp => new Load( resp ) ),
			catchError( ( e: HttpErrorResponse ) => { console.log( e ); return of(); } )
		) )
	);

	@Effect() CREATE = this.actions$.pipe(
		ofType( ActionTypes.CREATE ),
		switchMap( ( a: Create ) => this.backend.create( a.payload ).pipe(
			tap( resp => console.log( resp ) ),
			mergeMap( resp => [
				new Load(),
				new RouterGo( { path: ['admin', 'users', resp.id] } )
			] ),
			catchError( ( e: HttpErrorResponse ) => { console.log( e ); return of(); } )
		) )
	);

	constructor(
		private actions$: Actions,
		private backend: BackEnd,
		// private store: Store<AppState>
	) { }
}
