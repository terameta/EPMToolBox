import { Store } from '@ngrx/store';
import { DimeMatrixOneCreateInitiateAction, DimeMatrixState } from '../dimematrix.ngrx';
import { Component, OnInit } from '@angular/core';

import { DimeMatrixService } from '../dimematrix.service';

@Component( {
	selector: 'app-dimematrix-toolbar',
	templateUrl: './dimematrix-toolbar.component.html',
	styleUrls: ['./dimematrix-toolbar.component.css']
} )
export class DimeMatrixToolbarComponent implements OnInit {

	constructor( private store: Store<DimeMatrixState> ) { }

	ngOnInit() {
	}

	public create = () => {
		this.store.dispatch( new DimeMatrixOneCreateInitiateAction() );
	}

}
