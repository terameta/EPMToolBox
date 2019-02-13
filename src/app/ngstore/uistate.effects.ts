import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { DimeUIBackend } from './uistate.backend';
import { AppState } from '../app.state';

@Injectable( { providedIn: 'root' } )
export class DimeUIEffects {
	private serviceName = 'User Interface';

	constructor( private actions$: Actions, private store$: Store<AppState>, private backend: DimeUIBackend, private router: Router ) { }
}
