import { Component, Input } from '@angular/core';
import { Store, select } from '@ngrx/store';
import { map, tap } from 'rxjs/operators';
import { AppState } from '../../app.state';
import { SortByPosition, SortByName } from '../../../../shared/utilities/utilityFunctions';

@Component( {
	selector: 'app-tag-selector',
	templateUrl: './tag-selector.component.html',
	styleUrls: ['./tag-selector.component.scss']
} )
export class TagSelectorComponent {
	@Input() tags: { [key: string]: boolean } = {};
	public state$ = this.store.pipe(
		select( 'tag' ),
		map( s => ( { ...s, groups: Object.values( s.groups ).sort( SortByPosition ) } ) ),
		map( s => ( { ...s, items: Object.values( s.items ).sort( SortByName ) } ) )
	);

	constructor( private store: Store<AppState> ) { }
}
