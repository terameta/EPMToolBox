import { Component, TemplateRef } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { AppState } from '../../app.state';
import { SignOut } from '../../auth/auth.actions';
import { map, filter, combineLatest, tap } from 'rxjs/operators';
import { SortByName, SortByPosition } from '../../../../shared/utilities/utilityFunctions';
import { SetTag } from '../../central/central.actions';

@Component( {
	selector: 'app-dimemenu',
	templateUrl: './dimemenu.component.html',
	styleUrls: ['./dimemenu.component.css']
} )
export class DimemenuComponent {
	public state$ = this.store.pipe( select( 'central' ) );
	public tagState$ = this.store.pipe( select( 'tag' ) );
	public tagGroups$ = this.tagState$.pipe(
		map( s => Object.values( s.groups ).sort( SortByPosition ).map( ( g: any ) => ( { group: g, list: Object.values( s.items ).filter( ( t: any ) => t.taggroup === g.id ) } ) ) ),
		combineLatest( this.state$ ),
		map( ( [gl, s] ) => gl.map( ( g: any ) => ( { ...g, selection: g.list.find( ( t: any ) => ( t.id === s.selectedTags[g.group.id] ) ) || { id: 0, name: 'All' } } ) ) ),
		map( gl => gl.map( ( g: any ) => ( { ...g, list: [{ id: 0, name: 'All' }, ...g.list] } ) ) )
	);

	public items$ = this.state$.pipe(
		filter( s => !!s.currentFeature ),
		map( s => this.toFeature( s.currentFeature ) ),
		combineLatest( this.store ),
		filter( ( [f, s] ) => !!s ),
		map( ( [f, s] ) => s[f] ),
		filter( s => !!s ),
		map( s => ( { list: Object.values( s.items ).sort( SortByName ), current: s.curItem } ) )
	);

	constructor( private store: Store<AppState> ) { }

	public signOut = () => this.store.dispatch( new SignOut() );

	private toFeature = ( payload: string ) => {
		switch ( payload ) {
			case 'environments': return 'environment';
			case 'streams': return 'stream';
			case 'maps': return 'map';
			case 'matrices': return 'matrix';
			case 'schedules': return 'schedule';
			case 'processes': return 'process';
			case 'asyncprocesses': return 'asyncprocess';
			case 'settings': return 'settings';
			case 'secrets': return 'secret';
			case 'credentials': return 'credential';
			case 'users': return 'users';
			case 'tags': return 'tag';
			default: return payload;
		}
	}

	public setTag = ( taggroup: number, tag: number ) => this.store.dispatch( new SetTag( { taggroup, tag } ) );
}
