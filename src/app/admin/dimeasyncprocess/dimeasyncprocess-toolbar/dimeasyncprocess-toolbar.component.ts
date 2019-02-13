import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';
import { AppState } from '../../../app.state';
import { DimeAsyncProcessOneCreateInitiateAction } from '../dimeasyncprocess.ngrx';

@Component( {
	selector: 'app-dimeasyncprocess-toolbar',
	templateUrl: './dimeasyncprocess-toolbar.component.html',
	styleUrls: ['./dimeasyncprocess-toolbar.component.css']
} )
export class DimeAsyncProcessToolbarComponent implements OnInit {

	constructor( private store: Store<AppState> ) { }

	ngOnInit() {
	}

	public create = () => {
		this.store.dispatch( new DimeAsyncProcessOneCreateInitiateAction() );
	}

}
