import { Injectable } from '@angular/core';
import { DimeSecretObject, DimeSecret } from '../../../../shared/model/secret';
import { Store } from '@ngrx/store';
import { AppState } from '../../ngstore/models';
import { ToastrService } from 'ngx-toastr';
import { DimeSecretBackend } from './dimesecret.backend';
import { DimeSecretActions } from './dimesecret.actions';
import { Router } from '@angular/router';

@Injectable()
export class DimeSecretService {
	private serviceName = 'Secrets';
	private baseUrl = '/api/dime/secret';

	constructor(
		private store: Store<AppState>,
		private toastr: ToastrService,
		private backend: DimeSecretBackend,
		private router: Router
	) { }

	public create = () => this.store.dispatch( DimeSecretActions.ONE.CREATE.INITIATE.action( <DimeSecret>{} ) );
	public update = ( payload: DimeSecret ) => this.store.dispatch( DimeSecretActions.ONE.UPDATE.INITIATE.action( payload ) );
	public delete = ( id: number, name?: string ) => {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( name !== undefined ? name : 'the item' ) + '?';
		if ( confirm( verificationQuestion ) ) {
			this.store.dispatch( DimeSecretActions.ONE.DELETE.INITIATE.action( id ) );
		}
	}
	public navigateTo = ( id: number ) => this.router.navigateByUrl( 'dime/secrets/secret-detail/' + id );

}
