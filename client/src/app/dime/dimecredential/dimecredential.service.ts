import { Router } from '@angular/router';
import { Injectable } from '@angular/core';

import { AppState } from '../../ngstore/models';

import { ToastrService } from 'ngx-toastr';

import { Store } from '@ngrx/store';

import * as _ from 'lodash';

import { DimeCredential } from '../../../../../shared/model/dime/credential';
import { DimeCredentialDetail } from '../../../../../shared/model/dime/credentialDetail';
import { DimeCredentialActions } from 'app/dime/dimecredential/dimecredential.actions';

import { SortByName } from '../../../../../shared/utilities/utilityFunctions';

@Injectable()
export class DimeCredentialService {
	public serviceName = 'Credentials';

	public itemList: DimeCredential[];
	public itemObject: { [key: number]: DimeCredential };
	public currentItem: DimeCredentialDetail;
	public currentItemClearPassword: string;

	constructor( private toastr: ToastrService, private store: Store<AppState>, private router: Router ) {
		this.store.select( 'dimeCredential' ).subscribe( credentialState => {
			this.itemList = _.values( credentialState.items ).sort( SortByName );
			this.itemObject = credentialState.items;
			this.currentItem = credentialState.curItem;
		} );
	}

	public create = () => {
		this.store.dispatch( DimeCredentialActions.ONE.CREATE.initiate( <DimeCredentialDetail>{} ) );
	}

	public update = () => {
		delete this.currentItem.clearPassword;
		this.store.dispatch( DimeCredentialActions.ONE.UPDATE.initiate( this.currentItem ) );
	}

	public delete = ( id: number, name: string ) => {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( name !== undefined ? name : 'the item' ) + '?';
		if ( confirm( verificationQuestion ) ) {
			this.store.dispatch( DimeCredentialActions.ONE.DELETE.initiate( id ) );
		}
	}

	public navigateTo = ( refered ) => {
		this.router.navigateByUrl( 'dime/credentials/credential-detail/' + refered );
	}

	public reveal = () => {
		this.store.dispatch( DimeCredentialActions.ONE.REVEAL.initiate( this.currentItem.id ) );
	}

}
