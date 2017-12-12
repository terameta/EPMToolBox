import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngstore/models';
import * as _ from 'lodash';
import { SortByName, SortByPosition } from '../../../../../shared/utilities/utilityFunctions';
import { Router } from '@angular/router';
import { DimeTag } from '../../../../../shared/model/dime/tag';
import { DimeTagGroup } from '../../../../../shared/model/dime/taggroup';
import { DimeTagActions } from 'app/dime/dimetag/dimetag.actions';
import { DimeTagGroupActions } from 'app/dime/dimetag/dimetaggroup.actions';

@Injectable()
export class DimeTagService {
	public serviceName = 'Tags';

	public itemList: DimeTag[];
	public currentItem: DimeTag;
	public groupList: DimeTagGroup[];
	public groupObject;
	public currentGroup: DimeTagGroup = <DimeTagGroup>{};
	public currentGroupID = 0;
	public doWeHaveGroupless: boolean;

	constructor( private toastr: ToastrService, private store: Store<AppState>, private router: Router ) {
		this.store.select( 'dimeTag' ).subscribe( tagState => {
			this.itemList = _.values( tagState.items ).sort( SortByName );
			this.currentItem = tagState.curItem;
			this.groupList = _.values( tagState.groups ).sort( SortByPosition );
			this.groupObject = tagState.groups;
			this.currentGroup = tagState.curGroup;
			this.currentGroupID = tagState.curGroupID;
			this.groupList.forEach( ( curGroup ) => {
				if ( curGroup.isReordered ) {
					this.store.dispatch( DimeTagGroupActions.ONE.UPDATE.initiate( curGroup ) );
				}
			} );
			this.doWeHaveGroupless = false;
			let curItemHasValidGroup: boolean;
			this.itemList.forEach( ( curItem ) => {
				curItemHasValidGroup = false;
				if ( curItem.taggroup ) {
					if ( this.groupObject[curItem.taggroup] ) {
						curItemHasValidGroup = true;
					}
				}
				if ( !curItemHasValidGroup ) {
					if ( Object.keys( this.groupObject ).length > 0 ) {
						curItem.taggroup = -1;
					}
					this.doWeHaveGroupless = true;
				}
			} );
		} );
	}

	public create = () => {
		this.store.dispatch( DimeTagActions.ONE.CREATE.initiate( <DimeTag>{} ) );
	}

	public update = () => {
		this.store.dispatch( DimeTagActions.ONE.UPDATE.initiate( this.currentItem ) );
	}

	public delete = ( id: number, name: string ) => {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( name !== undefined ? name : 'the item' ) + '?';
		if ( confirm( verificationQuestion ) ) {
			this.store.dispatch( DimeTagActions.ONE.DELETE.initiate( id ) );
		}
	}

	public navigateTo = ( refered ) => {
		this.router.navigateByUrl( 'dime/tags/tag-detail/' + refered );
	}

	public groupRename = ( id: number, name: string ) => {
		const newName = prompt( 'Please enter new name for the group', name );
		if ( newName ) {
			const tagGroupToUpdate: DimeTagGroup = Object.assign( <DimeTagGroup>{}, this.groupObject[id] );
			tagGroupToUpdate.name = newName;
			this.store.dispatch( DimeTagGroupActions.ONE.UPDATE.initiate( tagGroupToUpdate ) );
			this.toastr.info( 'Rename is initiated' );
		} else {
			this.toastr.error( 'Rename is cancelled' );
		}
	}

	public groupCreate = () => {
		this.store.dispatch( DimeTagGroupActions.ONE.CREATE.initiate( <DimeTagGroup>{} ) );
	}

	public groupDelete = ( id: number, name: string ) => {
		const verificationQuestion = this.serviceName + ': Are you sure you want to delete ' + ( name !== undefined ? name : 'the item' ) + '?';
		if ( confirm( verificationQuestion ) ) {
			this.store.dispatch( DimeTagGroupActions.ONE.DELETE.initiate( id ) );
		} else {
			this.toastr.info( 'Deletion is cancelled' );
		}
	}

	public groupReorder = ( id: number, direction: 'UP' | 'DOWN' ) => {
		this.store.dispatch( DimeTagGroupActions.ONE.reorder( { id, direction } ) );
	}

}
