import { Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { Actions } from '@ngrx/effects';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngstore/models';

import { DimeUIBackend } from 'app/ngstore/uistate.backend';

@Injectable()
export class DimeUIEffects {
	private serviceName = 'User Interface';

	constructor( private actions$: Actions, private store$: Store<AppState>, private backend: DimeUIBackend, private router: Router ) { }
}
