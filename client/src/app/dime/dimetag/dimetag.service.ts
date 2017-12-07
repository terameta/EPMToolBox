import { Injectable } from '@angular/core';
import { DimeTag } from '../../../../../shared/model/dime/tag';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngstore/models';
import * as _ from 'lodash';
import { SortByName } from '../../../../../shared/utilities/utilityFunctions';
import { DimeTagOneCreateInitiateAction } from 'app/dime/dimetag/dimetag.ngrx';
import { Router } from '@angular/router';

@Injectable()
export class DimeTagService {
	public serviceName = 'Tags';

	public itemList: DimeTag[];
	public currentItem: DimeTag;

	constructor( private toastr: ToastrService, private store: Store<AppState>, private router: Router ) {
		this.store.select( 'dimeTag' ).subscribe( tagState => {
			this.itemList = _.values( tagState.items ).sort( SortByName );
			this.currentItem = tagState.curItem;

			console.log( this.itemList );
			console.log( this.currentItem );
		} )
	}

	public create = () => {
		this.store.dispatch( new DimeTagOneCreateInitiateAction() );
	}

	public navigateTo = ( refered ) => {
		this.router.navigateByUrl( 'dime/tags/tag-detail/' + refered );
	}

}
