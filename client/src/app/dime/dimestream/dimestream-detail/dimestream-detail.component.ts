import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';

import { ToastrService } from 'ngx-toastr';
import { Subscription } from 'rxjs/Subscription';

import { DimeStreamService } from '../dimestream.service';
import { DimeEnvironmentService } from '../../dimeenvironment/dimeenvironment.service';

@Component( {
	selector: 'app-dimestream-detail',
	templateUrl: './dimestream-detail.component.html',
	styleUrls: ['./dimestream-detail.component.css']
} )
export class DimestreamDetailComponent implements OnInit, OnDestroy {
	paramsSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		private router: Router,
		public mainService: DimeStreamService,
		public environmentService: DimeEnvironmentService,
	) { }

	ngOnInit() {
		// this.paramsSubscription = this.route.params.subscribe(
		// 	( params: Params ) => {
		// 		this.mainService.getOne( params['id'] );
		// 	}
		// );
	}

	ngOnDestroy() {
		// this.paramsSubscription.unsubscribe();
	}
}
