// import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';

import { DimeStreamService } from '../dimestream.service';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';
import { Store } from '@ngrx/store';
import { AppState } from 'app/ngstore/models';
import { DimeStreamActions } from 'app/dime/dimestream/dimestream.actions';

@Component( {
	selector: 'app-dimestream-detail',
	templateUrl: './dimestream-detail.component.html',
	styleUrls: ['./dimestream-detail.component.css']
} )
export class DimeStreamDetailComponent implements OnInit, OnDestroy {

	constructor(
		// private route: ActivatedRoute,
		// private router: Router,
		public mainService: DimeStreamService,
		public environmentService: DimeEnvironmentService,
		private store: Store<AppState>
	) { }

	ngOnInit() {
	}

	ngOnDestroy() {
		this.store.dispatch( DimeStreamActions.ONE.unload() );
	}
}
