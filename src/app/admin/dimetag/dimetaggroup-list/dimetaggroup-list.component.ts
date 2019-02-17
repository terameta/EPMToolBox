import { Component } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../../app.state';
import { map } from 'rxjs/operators';
import { SortByPosition } from '../../../../../shared/utilities/utilityFunctions';
import { TagGroup } from '../../../../../shared/model/dime/taggroup';
import { Service } from '../../../central/central.service';
import { DimeTagGroupActions } from '../dimetaggroup.actions';

@Component( {
	selector: 'app-dimetaggroup-list',
	templateUrl: './dimetaggroup-list.component.html',
	styleUrls: ['./dimetaggroup-list.component.css']
} )
export class DimeTagGroupListComponent {
	public state$ = this.store.pipe( select( 'tag' ) );
	public groups$ = this.state$.pipe(
		map( s => Object.values( s.groups ).sort( SortByPosition ) )
	);

	constructor(
		private store: Store<AppState>,
		private cs: Service
	) { }

	public create = async () => {
		const name = await this.cs.prompt( 'New Tag Group Name?', 'New Group' );
		if ( name ) this.store.dispatch( DimeTagGroupActions.ONE.CREATE.initiate( <TagGroup>{ name } ) );
	}
	public rename = async ( group: TagGroup ) => {
		const response = await this.cs.prompt( 'New Name?', group.name );
		if ( response ) this.store.dispatch( DimeTagGroupActions.ONE.UPDATE.initiate( { ...group, name: response } ) );
	}

	public delete = async ( group: TagGroup ) => {
		const response = await this.cs.confirm( 'Are you sure you want to delete ' + group.name + '?' );
		if ( response ) this.store.dispatch( DimeTagGroupActions.ONE.DELETE.initiate( group.id ) );
	}

	public positionMove = async ( items: TagGroup[], item: TagGroup, direction: 1 | -1 ) => {
		items.forEach( i => {
			i.position *= 10;
			if ( i.id === item.id ) { i.position += 11 * direction; }
		} );
		items.sort( SortByPosition );
		items.forEach( ( t, ti ) => {
			let shouldSave = false;
			t.position /= 10;
			if ( t.position !== ti ) shouldSave = true;
			t.position = ti;
			if ( shouldSave ) this.store.dispatch( DimeTagGroupActions.ONE.UPDATE.initiate( t ) );
		} );
	}
}
