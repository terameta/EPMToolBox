import { Component, OnInit } from '@angular/core';
import { Service } from '../directories.service';
import { select } from '@ngrx/store';
import { filter } from 'rxjs/operators';

@Component( {
	selector: 'app-directory-list',
	templateUrl: './directory-list.component.html',
	styleUrls: ['./directory-list.component.scss']
} )
export class DirectoryListComponent implements OnInit {
	public state$ = this.srvc.store.pipe(
		select( 'directories' ),
		filter( state => state.loaded )
	);

	constructor(
		public srvc: Service
	) { }

	ngOnInit() {
	}

}
