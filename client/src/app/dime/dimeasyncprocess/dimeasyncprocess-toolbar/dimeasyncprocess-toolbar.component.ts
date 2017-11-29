import { DimeAsyncProcessOneCreateInitiateAction, DimeAsyncProcessState } from '../dimeasyncprocess.ngrx';
import { Store } from '@ngrx/store';
import { Component, OnInit } from '@angular/core';

@Component( {
	selector: 'app-dimeasyncprocess-toolbar',
	templateUrl: './dimeasyncprocess-toolbar.component.html',
	styleUrls: ['./dimeasyncprocess-toolbar.component.css']
} )
export class DimeAsyncProcessToolbarComponent implements OnInit {

	constructor( private store: Store<DimeAsyncProcessState> ) { }

	ngOnInit() {
	}

	public create = () => {
		this.store.dispatch( new DimeAsyncProcessOneCreateInitiateAction() );
	}

}
