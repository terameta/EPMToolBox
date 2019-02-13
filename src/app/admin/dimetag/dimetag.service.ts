import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Store, select } from '@ngrx/store';
import * as _ from 'lodash';
import { SortByName, SortByPosition } from '../../../../shared/utilities/utilityFunctions';
import { Router } from '@angular/router';
import { DimeTagActions } from './dimetag.actions';
import { DimeTagGroupActions } from './dimetaggroup.actions';
import { DimeUIService } from '../../ngstore/uistate.service';
import { AppState } from '../../app.state';
import { Tag } from '../../../../shared/model/dime/tag';
import { TagGroup } from '../../../../shared/model/dime/taggroup';

@Injectable( { providedIn: 'root' } )
export class DimeTagService {
	public serviceName = 'Tags';

	public itemList: Tag[];
	public currentItem: Tag;
	public groupList: TagGroup[];
	public groupObject;
	public currentGroup: TagGroup = <TagGroup>{};
	public currentGroupID = 0;
	public doWeHaveGroupless = false;

	constructor( private toastr: ToastrService, private store: Store<AppState>, private router: Router, private uiService: DimeUIService ) {
		this.store.dispatch( DimeTagActions.ALL.LOAD.initiate() );
		this.store.dispatch( DimeTagGroupActions.ALL.LOAD.initiate() );
		this.store.pipe( select( 'tag' ) ).subscribe( tagState => {
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
			this.groupList.forEach( ( curGroup ) => {
				if ( !this.uiService.uiState.selectedTags[curGroup.id] ) { this.uiService.uiState.selectedTags[curGroup.id] = '0'; }
			} );
		} );
	}

	public create = () => {
		this.store.dispatch( DimeTagActions.ONE.CREATE.initiate( <Tag>{} ) );
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
		this.router.navigateByUrl( 'admin/tags/tag-detail/' + refered );
	}

	public groupRename = ( id: number, name: string ) => {
		const newName = prompt( 'Please enter new name for the group', name );
		if ( newName ) {
			const tagGroupToUpdate: TagGroup = Object.assign( <TagGroup>{}, this.groupObject[id] );
			tagGroupToUpdate.name = newName;
			this.store.dispatch( DimeTagGroupActions.ONE.UPDATE.initiate( tagGroupToUpdate ) );
			this.toastr.info( 'Rename is initiated' );
		} else {
			this.toastr.error( 'Rename is cancelled' );
		}
	}

	public groupCreate = () => {
		this.store.dispatch( DimeTagGroupActions.ONE.CREATE.initiate( <TagGroup>{} ) );
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

	public decideColWidth = ( numCols: number ) => {
		let colWidth = 12;
		if ( numCols > 0 ) {
			colWidth = Math.floor( colWidth / numCols );
		}
		if ( colWidth < 1 ) { colWidth = 1; }
		return colWidth;
	}

}
