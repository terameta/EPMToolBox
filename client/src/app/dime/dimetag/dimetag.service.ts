import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngstore/models';
import * as _ from 'lodash';
import { SortByName, SortByPosition } from '../../../../../shared/utilities/utilityFunctions';
import { DimeTagOneCreateInitiateAction, DimeTagGroupOneCreateInitiateAction, DimeTagGroupOneUpdateInitiateAction, DimeTagGroupOneDeleteInitiateAction, DimeTagGroupOneReorder } from 'app/dime/dimetag/dimetag.ngrx';
import { Router } from '@angular/router';
import { DimeTag } from '../../../../../shared/model/dime/tag';
import { DimeTagGroup } from '../../../../../shared/model/dime/taggroup';

@Injectable()
export class DimeTagService {
	public serviceName = 'Tags';

	public itemList: DimeTag[];
	public currentItem: DimeTag;
	public groupList: DimeTagGroup[];
	public groupObject;
	public currentGroup: DimeTagGroup;

	constructor( private toastr: ToastrService, private store: Store<AppState>, private router: Router ) {
		this.store.select( 'dimeTag' ).subscribe( tagState => {
			this.itemList = _.values( tagState.items ).sort( SortByName );
			this.currentItem = tagState.curItem;
			this.groupList = _.values( tagState.groups ).sort( SortByPosition );
			this.groupObject = tagState.groups;
			this.currentGroup = tagState.curGroup;
		} );
	}

	public create = () => {
		this.store.dispatch( new DimeTagOneCreateInitiateAction() );
	}

	public navigateTo = ( refered ) => {
		this.router.navigateByUrl( 'dime/tags/tag-detail/' + refered );
	}

	public groupRename = ( id: number, name: string ) => {
		const newName = prompt( 'Please enter new name for the group', name );
		if ( newName ) {
			const tagGroupToUpdate: DimeTagGroup = Object.assign( <DimeTagGroup>{}, this.groupObject[id] );
			tagGroupToUpdate.name = newName;
			this.store.dispatch( new DimeTagGroupOneUpdateInitiateAction( tagGroupToUpdate ) );
			this.toastr.info( 'Rename is initiated' );
		} else {
			this.toastr.error( 'Rename is cancelled' );
		}
	}

	public groupCreate = () => {
		this.store.dispatch( new DimeTagGroupOneCreateInitiateAction() );
	}

	public groupDelete = ( id: number, name: string ) => {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( name !== undefined ? name : 'the item' ) + '?';
		if ( confirm( verificationQuestion ) ) {
			this.store.dispatch( new DimeTagGroupOneDeleteInitiateAction( id ) );
		} else {
			this.toastr.info( 'Deletion is cancelled' );
		}
	}

	public groupReorder = ( id: number, direction: 'UP' | 'DOWN' ) => {
		this.store.dispatch( new DimeTagGroupOneReorder( { id, direction } ) );
	}

}
