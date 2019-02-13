import { ActivatedRoute, Params } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';

import { Subscription } from 'rxjs';

import { DimeMapService } from '../dimemap.service';

@Component( {
	selector: 'app-dimemap-detail',
	templateUrl: './dimemap-detail.component.html',
	styleUrls: ['./dimemap-detail.component.css']
} )
export class DimemapDetailComponent implements OnInit, OnDestroy {
	paramSubscription: Subscription;

	constructor(
		private route: ActivatedRoute,
		public mainService: DimeMapService
	) { }

	ngOnInit() {
		// this.paramSubscription = this.route.params.subscribe(( params: Params ) => {
		// 	this.mainService.getOne( params['id'] );
		// } );
	}

	ngOnDestroy() {
		// this.paramSubscription = undefined;
	}

}
