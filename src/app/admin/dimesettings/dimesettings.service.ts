import { Injectable } from '@angular/core';
import { DimeSettingObject } from '../../../../shared/model/dime/settings';
import { Store } from '@ngrx/store';
import { ToastrService } from 'ngx-toastr';
import { DimeSettingsActions } from './dimesettings.actions';
import { AppState } from '../../app.state';

@Injectable( { providedIn: 'root' } )
export class DimeSettingsService {
	private serviceName = 'Settings';

	public items: DimeSettingObject = {};

	constructor(
		private store: Store<AppState>,
		private toastr: ToastrService,
	) {
		this.store.select( 'settings' ).subscribe( settingsState => {
			this.items = settingsState.items;
		}, error => {
			console.error( error );
		} );
	}

	public update = ( name: string ) => this.store.dispatch( DimeSettingsActions.ONE.UPDATE.INITIATE.action( this.items[name] ) );

}
