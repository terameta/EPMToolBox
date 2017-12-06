import { AppState } from '../../ngstore/models';
import { ToastrService } from 'ngx-toastr';
import { Injectable } from '@angular/core';
import { Store } from '@ngrx/store';

import * as _ from 'lodash';

import { DimeCredential } from '../../../../../shared/model/dime/credential';
import { DimeCredentialDetail } from '../../../../../shared/model/dime/credentialDetail';

import { DimeCredentialOneCreateInitiateAction } from './dimecredential.ngrx';

import { SortByName } from '../../../../../shared/utilities/utilityFunctions';

@Injectable()
export class DimeCredentialService {
	private serviceName = 'Credentials';

	public itemList: DimeCredential[];
	public currentItem: DimeCredentialDetail;

	constructor(
		private toastr: ToastrService,
		private store: Store<AppState>
	) {
		this.store.select( 'dimeCredential' ).subscribe( credentialState => {
			this.itemList = _.values( credentialState.items ).sort( SortByName );
			this.currentItem = credentialState.curItem;
		} );
	}

	public create = () => {
		this.store.dispatch( new DimeCredentialOneCreateInitiateAction() );
	}

}
