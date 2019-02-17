import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../app.state';
import { select, Store } from '@ngrx/store';
import { combineLatest, map, tap } from 'rxjs/operators';
import { SortByName } from '../../../../../shared/utilities/utilityFunctions';
import { Service } from '../../../central/central.service';
import { Tag } from '../../../../../shared/model/dime/tag';
import { DimeTagActions } from '../dimetag.actions';

@Component( {
	selector: 'app-dimetagsingroup',
	templateUrl: './dimetagsingroup.component.html',
	styleUrls: ['./dimetagsingroup.component.css']
} )
export class DimeTagsinGroupComponent implements OnInit {
	public tags$ = this.store.pipe(
		select( 'tag' ),
		combineLatest( this.store.pipe( select( 'central' ) ) ),
		map( ( [ts, cs] ) => ( Object.values( ts.items ).filter( ( i: any ) => i.taggroup === cs.currentID ) ).sort( SortByName ) ),
	);

	public groupID$ = this.store.pipe(
		select( 'central' ),
		map( s => s.currentID )
	);

	constructor(
		private store: Store<AppState>,
		private cs: Service
	) { }

	ngOnInit() {
		console.log( 'Tags module have several unneeded components.' );
		console.log( 'Get rid of them' );
	}

	public rename = async ( tag: Tag ) => {
		const response = await this.cs.prompt( 'New Tag Name?', tag.name );
		if ( response ) this.store.dispatch( DimeTagActions.ONE.UPDATE.initiate( { ...tag, name: response } ) );
	}

	public delete = async ( tag: Tag ) => {
		const response = await this.cs.confirm( 'Are you sure you want to delete ' + tag.name + '?' );
		if ( response ) this.store.dispatch( DimeTagActions.ONE.DELETE.initiate( tag.id ) );
	}

	public create = async ( taggroup ) => {
		const name = await this.cs.prompt( 'New Tag Name?', 'New Tag' );
		if ( name ) this.store.dispatch( DimeTagActions.ONE.CREATE.initiate( { id: 0, name, taggroup } ) );
	}

}
