import { HttpErrorResponse } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Actions, Effect, ofType } from "@ngrx/effects";
import { Store } from "@ngrx/store";
import { of } from "rxjs";
import { catchError, filter, map, switchMap } from "rxjs/operators";
import { AppState } from "../../app.state";
import { ActionTypes, Load } from "./users.actions";
import { BackEnd } from "./users.backend";

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

	constructor(
		private actions$: Actions,
		private backend: BackEnd,
		private store: Store<AppState>
	) { }
}
